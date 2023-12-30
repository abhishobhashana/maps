import React from "react";
import { Marker } from "@react-google-maps/api";
import MarkerIcon from "../../assets/images/marker.png";

const AddMarker = ({ marker }) => {
  return (
    <>
      {marker.map((e, index) => (
        <Marker
          key={index}
          position={{
            lat: parseFloat(e.lat),
            lng: parseFloat(e.lng),
          }}
          icon={MarkerIcon}
        />
      ))}
    </>
  );
};

export default AddMarker;
