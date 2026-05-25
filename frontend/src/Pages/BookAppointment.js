import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Header from "../Components/Header";
import DoctorHeader from "../Components/DoctorHeader";

const BookAppointment = () => {
  const { doctorID } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Fetch logged-in patient's ID
  const loggedInPatientId = localStorage.getItem("patientID");

  useEffect(() => {
    if (!loggedInPatientId) {
      alert("Please log in to book an appointment.");
      navigate("/loginpatient");
      return;
    }

    const fetchDoctorDetails = async () => {
      try {
        console.log(doctorID);
        const { data } = await axios.post(`/api/v1/doctors/singleDoc`, {
          doctorID,
        });
        if (data.success) {
          setDoctor(data.doctor);
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorID, loggedInPatientId, navigate]);

  const handlePayment = async (appointmentID, amount) => {
    try {
      // ✅ 1️⃣ Create order from backend
      const { data } = await axios.post(
        "http://localhost:2000/api/v1/payments/create-order",
        { amount }
      );
      console.log(data);

      const options = {
        key: "rzp_test_ILtCxOiZLwUlCg", // Use from .env
        amount: amount * 100, // Convert INR to paise
        currency: "INR",
        name: "Doctor Appointment",
        description: "Payment for doctor appointment",
        order_id: data.order_id, // Ensure this is coming from backend
        handler: async function (response) {
          try {
            // ✅ 2️⃣ Verify Payment
            const verifyRes = await axios.post(
              "http://localhost:2000/api/v1/payments/verify",
              {
                appointmentID,
                paymentID: response.razorpay_payment_id,
                orderID: response.razorpay_order_id,
                signature: response.razorpay_signature,
              }
            );

            if (verifyRes.data.success) {
              alert("✅ Payment successful! Your appointment is confirmed.");
            } else {
              alert("⚠️ Payment verification failed!");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("⚠️ Payment verification failed. Please try again.");
          }
        },

        prefill: {
          email: "patient@example.com",
        },
        theme: {
          color: "#6a0dad",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("⚠️ Payment initiation failed. Please try again.");
    }
  };

  const [bookingDays, setBookingDays] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    // Generate next 7 days dynamically with values
    const days = [];
    for (let i = 0; i < 7; i++) {
        const dateObj = moment().add(i, 'days');
        days.push({
            label: dateObj.format("ddd DD"),
            value: dateObj.format("YYYY-MM-DD")
        });
    }
    setBookingDays(days);
    if (days.length > 0) setSelectedDate(days[0].value);
  }, []);

  useEffect(() => {
    const fetchBookedSlots = async () => {
        try {
            const { data } = await axios.get(`/api/v1/appointments?doctorID=${doctorID}`);
            if (data.success) {
                setBookedSlots(data.appointments);
            }
        } catch (error) {
            console.error("Error fetching booked slots:", error);
        }
    };
    if (doctorID) fetchBookedSlots();
  }, [doctorID]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time.");
      return;
    }

    const requestData = {
      doctorID,
      patientID: loggedInPatientId,
      date: selectedDate,
      time: selectedTime,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:2000/api/v1/appointments/book",
        requestData
      );
      if (data.success) {
        alert("Appointment booked successfully! Proceeding to payment...");
        handlePayment(data.appointment._id, doctor.price);
        navigate("/meet");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || "This slot is already booked. Please choose another time.");
      } else {
        console.error("Error booking appointment:", error);
        alert("An error occurred while booking. Please try again.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!doctor) return <p>Doctor not found.</p>;

  return (
    <div>
      <Header />
      <div
        style={{
          padding: "20px",
          maxWidth: "900px",
          margin: "auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={doctor.image}
            alt={doctor.name}
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "10px",
              objectFit: "cover",
            }}
          />
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
              {doctor.name} <span style={{ color: "blue" }}>✔</span>
            </h1>
            <p style={{ fontSize: "14px" }}>
              <strong>Degree:</strong> {doctor.degree}
            </p>
            <p style={{ fontSize: "18px", color: "gray" }}>
              {doctor.speciality}
            </p>
            <p style={{ fontSize: "14px" }}>
              <strong>Experience:</strong> {doctor.experience} Years
            </p>

            <p style={{ fontSize: "16px", fontWeight: "bold" }}>
              Appointment Fee: ₹{doctor.price}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>Booking slots</h3>

          <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
            {bookingDays.map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date.value)}
                  style={{
                    padding: "10px 15px",
                    borderRadius: "5px",
                    backgroundColor:
                      selectedDate === date.value ? "#6a0dad" : "#f0f0f0",
                    color: selectedDate === date.value ? "white" : "black",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {date.label}
                </button>
              )
            )}
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
            {[
              "10:30 AM",
              "11:00 AM",
              "11:30 AM",
              "12:00 PM",
              "2:00 PM",
              "2:30 PM",
              "3:30 PM",
              "4:00 PM",
              "4:30 PM",
              "5:00 PM",
            ].map((time, index) => {
              // 🕒 1. Filter past slots for Today
              const isToday = selectedDate === moment().format("YYYY-MM-DD");
              if (isToday) {
                const slotTime = moment(time, "h:mm A");
                const now = moment();
                if (slotTime.isBefore(now.add(15, 'minutes'))) {
                   return null; 
                }
              }

              // 🚫 2. Filter already booked slots
              const isBooked = bookedSlots.some(
                (appt) => appt.date === selectedDate && appt.time === time && appt.status !== 'Cancelled'
              );
              if (isBooked) return null;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedTime(time)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "5px",
                    backgroundColor:
                      selectedTime === time ? "#6a0dad" : "#f0f0f0",
                    color: selectedTime === time ? "white" : "black",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {time}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleBooking}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              backgroundColor: "#6a0dad",
              color: "white",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Book an appointment
          </button>
        </div>
      </div>
    </div>
  );
};


export default BookAppointment;
