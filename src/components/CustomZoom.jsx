import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import IconButton from "./iconButton";
import { Minus, MinusDark, Plus, PlusDark } from "../assets/icons";

const CustomZoom = ({ mode }) => {
  const map = useMap();

  const [disableZoomIn, setDisableZoomIn] = useState(false);
  const [disableZoomOut, setDisableZoomOut] = useState(false);

  useEffect(() => {
    const updateDisableStatus = () => {
      const currentZoom = map.getZoom();
      const minZoom = map.getMinZoom();
      const maxZoom = map.getMaxZoom();
      setDisableZoomIn(currentZoom === maxZoom);
      setDisableZoomOut(currentZoom === minZoom);
    };

    map.on("zoom", updateDisableStatus);
    updateDisableStatus();

    return () => {
      map.off("zoom", updateDisableStatus);
    };
  }, [map]);

  const zoomIn = () => {
    if (!disableZoomIn) {
      map.zoomIn();
    }
  };

  const zoomOut = () => {
    if (!disableZoomOut) {
      map.zoomOut();
    }
  };

  return (
    <div className="absolute bottom-2.5 right-2.5 hidden lg:flex w-fit items-center bg-light-white dark:bg-secondary shadow-md rounded-2xl">
      {mode ? (
        <>
          <IconButton
            className="map-btn"
            small
            disableVal={disableZoomOut}
            icon={<Minus />}
            onClick={zoomOut}
          />

          <IconButton
            className="map-btn"
            small
            disableVal={disableZoomIn}
            icon={<Plus />}
            onClick={zoomIn}
          />
        </>
      ) : (
        <>
          <IconButton
            className="map-btn-dark"
            small
            disableVal={disableZoomOut}
            icon={<MinusDark />}
            onClick={zoomOut}
          />

          <IconButton
            className="map-btn-dark"
            small
            disableVal={disableZoomIn}
            icon={<PlusDark />}
            onClick={zoomIn}
          />
        </>
      )}
    </div>
  );
};

export default CustomZoom;
