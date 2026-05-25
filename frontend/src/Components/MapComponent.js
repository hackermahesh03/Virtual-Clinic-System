import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { IoIosCall } from "react-icons/io";
import { MdLocalPharmacy, MdLocationOn, MdClose } from "react-icons/md";

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapComponent({ location }) {
  const [pharmacies, setPharmacies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      fetchPharmacies();
    }
  }, [location]);

  const fetchPharmacies = async () => {
    setLoading(true);
    setError(null);
    try {
      const { latitude, longitude } = location;
      const query = `
        [out:json][timeout:60];
        node["amenity"="pharmacy"](around:10000,${latitude},${longitude});
        out body;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      const data = await response.json();

      const results = data.elements.map((el) => ({
        name: el.tags?.name || "Pharmacy",
        address:
          el.tags?.["addr:full"] ||
          [el.tags?.["addr:street"], el.tags?.["addr:city"]]
            .filter(Boolean)
            .join(", ") ||
          "Address not available",
        phone_number: el.tags?.phone || el.tags?.["contact:phone"] || null,
        location: { lat: el.lat, lng: el.lon },
        distance: getDistance(latitude, longitude, el.lat, el.lon),
      }));

      results.sort((a, b) => a.distance - b.distance);
      console.log("Pharmacies found:", results);
      setPharmacies(results);
    } catch (err) {
      console.error("Error fetching pharmacies:", err);
      setError("Could not load pharmacies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  return (
    <>
      {!showModal && (
        <>
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={14}
            style={{ height: "70%", width: "80%", borderRadius: "0.5rem" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[location.latitude, location.longitude]}
              icon={redIcon}
            >
              <Popup>📍 Your current location</Popup>
            </Marker>
            {pharmacies.map((pharmacy, index) => (
              <Marker
                key={index}
                position={[pharmacy.location.lat, pharmacy.location.lng]}
                icon={redIcon}
              >
                <Popup>
                  <strong>{pharmacy.name}</strong>
                  <br />
                  {pharmacy.distance}m away
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            {loading ? "Loading..." : "See Pharmacies"}
          </button>
        </>
      )}

      {showModal && (
        <div className="bg-white p-8 rounded-lg overflow-auto min-h-screen">
          <div className="flex flex-col p-4 overflow-auto">
            <button
              onClick={() => setShowModal(false)}
              className="place-self-center bg-red-400 cursor-pointer rounded-xl p-4 font-bold flex items-center gap-2"
            >
              <MdClose size={20} /> Close
            </button>

            {error && (
              <p className="text-center text-red-500 mt-4 font-semibold">
                {error}
              </p>
            )}

            {!error && pharmacies.length === 0 && !loading && (
              <p className="text-center text-gray-500 mt-8 text-lg">
                No pharmacies found within 10km of your location.
              </p>
            )}

            {loading && (
              <p className="text-center text-blue-500 mt-8 text-lg font-semibold">
                Searching pharmacies nearby...
              </p>
            )}

            <div className="flex justify-evenly items-start gap-10 flex-wrap font-bold text-lg mt-6">
              {pharmacies.map((item, index) => (
                <div
                  key={index}
                  className="bg-white shadow-xl p-4 rounded-xl flex flex-col w-[350px] gap-2"
                >
                  <div className="flex items-center justify-center bg-green-100 rounded-lg p-4 mb-2">
                    <MdLocalPharmacy size={60} color="#16a34a" />
                  </div>
                  <h1 className="text-xl text-green-700">{item.name}</h1>
                  <div className="flex items-start gap-2 text-base font-normal text-gray-700">
                    <MdLocationOn size={20} className="mt-1 shrink-0 text-red-500" />
                    <span>{item.address}</span>
                  </div>
                  <p className="text-blue-600 font-semibold">
                    📏 {item.distance} metres away
                  </p>
                  <p className="text-gray-600 font-normal">
                    📞 {item.phone_number || "Phone not available"}
                  </p>
                  {item.phone_number && (
                    <button
                      className="p-3 rounded-xl bg-green-500 flex justify-center items-center gap-2 hover:bg-green-400 cursor-pointer mt-2 text-white"
                      onClick={() =>
                        (window.location.href = `tel:${item.phone_number}`)
                      }
                    >
                      <IoIosCall size={24} />
                      Call
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MapComponent;