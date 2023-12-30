import React, { useEffect, useState } from "react";
import { useGoogleMap } from "@react-google-maps/api";
import { createPortal } from "react-dom";

const MapContol = ({ position, children, zIndex = 0 }) => {
  const map = useGoogleMap();
  const [container] = useState(document.createElement("div"));

  useEffect(() => {
    const controlsContainer = map.controls[position];

    controlsContainer.push(container);

    return () => {
      const index = controlsContainer.indexOf(container);
      if (index !== -1) {
        controlsContainer.removeAt(index);
      }
    };
  }, [map]);

  useEffect(() => {
    container.style.width = "auto";
    container.style.zIndex = zIndex;
  }, [zIndex]);

  return createPortal(children, container);
};

export default MapContol;
