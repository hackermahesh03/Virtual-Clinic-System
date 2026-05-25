import React, { useEffect, useState } from "react";
import MapComponent from "../Components/MapComponent.js";
import Header from "../Components/Header.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function PharmacyPage() {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setShow(true);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported.");
    }
  }, []);

  return (
    <>
      <Header />
      <div className="h-screen bg-[url('https://i.pinimg.com/originals/72/59/6e/72596e499f868bdfce8220559315fcf5.jpg')] bg-cover w-full flex flex-col  items-center">
        <h1 className="font-bold m-5 text-4xl">Nearby Pharamacies</h1>
        {show ? (
          <MapComponent location={location} />
        ) : (
          <div className="flex justify-center items-center h-full">
            {" "}
            <AiOutlineLoading3Quarters
              className="animate-spin"
              size={100}
            />{" "}
          </div>
        )}
      </div>
    </>
  );
}

export default PharmacyPage;
