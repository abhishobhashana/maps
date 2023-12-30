import React from "react";
import { OverlayView, Marker as CustomMarker } from "@react-google-maps/api";
import MarkerIcon from "../../assets/images/marker.png";

const Marker = ({ markers }) => {
  return (
    <div>
      {markers.map(({ lat, lng, id, title }) => {
        return (
          <OverlayView
            key={id}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            position={{ lat: lat, lng: lng }}
          >
            <CustomMarker
              key={id}
              title={title}
              position={{ lat: lat, lng: lng }}
              icon={MarkerIcon}
            />
          </OverlayView>
        );
      })}
    </div>
  );
};

export default Marker;
