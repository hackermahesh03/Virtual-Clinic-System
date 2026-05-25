import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const CreateRoomPage = () => {
  const { roomId } = useParams();
  const containerRef = useRef(null);
  const zcRef = useRef(null);

  useEffect(() => {
    const appID = 1914248640;
    const serverSecret = "2242d3c99a13cde90131e7106b5d6f51";

    const initMeeting = async () => {
      if (zcRef.current) return;

      const patientID = localStorage.getItem("patientID");
      const doctorID = localStorage.getItem("doctorID");
      const doctorName = localStorage.getItem("doctorName");
      const patientEmail = localStorage.getItem("patientEmail");

      const userID = patientID
        ? "patient_" + patientID
        : doctorID
        ? "doctor_" + doctorID
        : "user_" + Date.now();

      const userName = doctorName
        ? "Dr. " + doctorName
        : patientEmail
        ? patientEmail.split("@")[0]
        : "User";

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        userID,
        userName
      );

      const zc = ZegoUIKitPrebuilt.create(kitToken);
      zcRef.current = zc;

      zc.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: "Copy Link",
            url: window.location.href,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
        onLeaveRoom: () => {
          zcRef.current = null;
        },
      });
    };

    if (containerRef.current) {
      initMeeting();
    }

    return () => {
      if (zcRef.current) {
        zcRef.current = null;
      }
    };
  }, [roomId]);

  return (
    <div className="w-screen h-screen">
      <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />
    </div>
  );
};

export default CreateRoomPage;