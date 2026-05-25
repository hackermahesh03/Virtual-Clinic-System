import React from "react";
import { FaUserCircle } from "react-icons/fa";
const Cards = ({ cardData }) => {
  return (
    <>
    <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden mt-6">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-4 font-bold">Info</th>
            <th className="p-4 font-bold">Details</th>
            <th className="p-4 font-bold">Status/Speciality</th>
            <th className="p-4 font-bold text-center">Registration Date</th>
          </tr>
        </thead>
        <tbody>
          {cardData?.map((item) => (
            <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="p-4">
                {item.image ? (
                  <img className="h-12 w-12 rounded-full object-cover border-2 border-gray-200" src={item.image} alt={item.name} />
                ) : (
                  <FaUserCircle className="text-gray-400" size={40} />
                )}
              </td>
              <td className="p-4">
                <div className="font-bold text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.email || `Adhaar: ${item.adhaarno}`}</div>
              </td>
              <td className="p-4">
                {item.speciality ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {item.speciality}
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Patient
                  </span>
                )}
              </td>
              <td className="p-4 text-center text-gray-600">
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
              </td>
            </tr>
          ))}
          {(!cardData || cardData.length === 0) && (
            <tr>
              <td colSpan="4" className="p-10 text-center text-gray-400 italic">
                No records found. Please select a category above.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Cards;
