import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, TrafficLayer } from "@react-google-maps/api";
import { styles } from "./consts/style";
import { Listbox, Transition } from "@headlessui/react";
import Loader from "../../assets/images/Loader";
import MapContol from "./mapContol";
import Plus from "../../assets/images/Plus";
import Minus from "../../assets/images/minus";
import Location from "../../assets/images/Location";
import List from "../../assets/images/List";
import Layer from "../../assets/images/Layer";
import data from "../../data/data.json";
import Pin from "../../assets/images/Pin";
import Column from "../../assets/images/Column";
import Check from "../../assets/images/Check";
import AddMarker from "../../pages/layers/addMarker";
import Marker from "../../pages/layers/marker";
import { AppIcon } from "../../assets/images/AppIcon";

const libraries = ["places", "visualization"];

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY,
    libraries,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [center, setCenter] = useState({ lat: 23.0260736, lng: 72.58112 });
  const [zoom, setZoom] = useState(10);

  const menuItems = [
    {
      id: 0,
      name: data.addMarker,
      icon: <Pin />,
    },
    {
      id: 1,
      name: data.marker,
      icon: <Pin />,
    },
    {
      id: 2,
      name: data.traffic,
      icon: <Column />,
    },
  ];

  const mapStyles = [
    {
      id: 0,
      name: data.dark,
      style: styles.dark,
      icon: <Pin />,
    },
    {
      id: 1,
      name: data.light,
      style: styles.silver,
      icon: <Pin />,
    },
  ];

  const [style, setStyle] = useState(mapStyles[0]);
  const [selected, setSelected] = useState(menuItems[0]);
  const [marker, setMarker] = useState([]);

  const markers = [
    {
      id: 1,
      title: "Gujarat",
      lat: 22.6708,
      lng: 71.5724,
    },
    {
      id: 2,
      title: "Rajasthan",
      lat: 27.0238,
      lng: 74.2179,
    },
    {
      id: 3,
      title: "Uttar Pradesh",
      lat: 27.5706,
      lng: 80.0982,
    },
    {
      id: 4,
      title: "Maharashtra",
      lat: 19.7515,
      lng: 75.7139,
    },
  ];

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  const handleResize = () => {
    if (window.innerWidth < 500) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setCenter(pos);
    });
  };

  const handleZoomIn = () => {
    setZoom(zoom + 1);
  };

  const handleZoomOut = () => {
    setZoom(zoom - 1);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  const onMapClick = (e) => {
    if (selected.id === 0) {
      setMarker(() => [
        {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
      ]);
    } else return;
  };

  const getLayers = () => {
    switch (selected.id) {
      case 0:
        return <AddMarker marker={marker} />;

      case 1:
        return <Marker markers={markers} />;

      case 2:
        return (
          <TrafficLayer
            options={{
              autoRefresh: true,
            }}
            autoUpdate
          />
        );

      default:
        break;
    }
  };

  useEffect(() => {
    if (selected.id !== 0) {
      setZoom(6);
    } else {
      setZoom(8);
    }
  }, [selected]);

  return (
    <>
      {!isLoaded ? (
        <Loader />
      ) : (
        <GoogleMap
          mapContainerClassName="map"
          mapContainerStyle={containerStyle}
          options={{
            styles: style.style,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            minZoom: 1.9,
            gestureHandling: "greedy",
          }}
          center={center}
          zoom={zoom}
          onClick={(e) => {
            onMapClick(e);
          }}
        >
          {isMobile && (
            <>
              <MapContol position={google.maps.ControlPosition.RIGHT_TOP}>
                <div className="w-fit flex flex-col items-center gap-5 bg-default-bg-menu rounded-xl p-2.5 m-5 mb-2.5">
                  <button className="h-5" onClick={handleLocation}>
                    <Location />
                  </button>
                  <button onClick={handleZoomIn}>
                    <List />
                  </button>
                </div>
              </MapContol>

              <MapContol position={google.maps.ControlPosition.RIGHT_TOP}>
                <div className="w-fit bg-default-bg-menu rounded-xl mx-5">
                  <Listbox
                    as="div"
                    by="id"
                    value={selected}
                    onChange={setSelected}
                  >
                    {({ open }) => (
                      <div className="relative mt-1">
                        <Listbox.Button
                          className={` relative w-fit cursor-ponter rounded-lg p-2.5 shadow-md outline:none`}
                        >
                          <Layer />
                        </Listbox.Button>
                        <Transition
                          show={open}
                          enter="transition duration-400 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <Listbox.Options className="absolute mt-2 right-0 max-h-60 overflow-auto rounded-md py-1 backdrop-blur-sm bg-default-bg-menu/80 text-base shadow-lg focus:outline-none">
                            {menuItems.map((items) => (
                              <Listbox.Option
                                className="relative cursor-pointer select-none pl-12 pr-16 py-2 font-sans border-b border-[#545458] last:border-b-0"
                                key={items.id}
                                value={items}
                              >
                                {({ selected }) => (
                                  <>
                                    {selected && (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                        <Check />
                                      </span>
                                    )}

                                    <span className="block truncate font-sans text-[#818181]">
                                      {items.name}
                                    </span>

                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                      {items.icon}
                                    </span>
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    )}
                  </Listbox>
                </div>
              </MapContol>
            </>
          )}

          {!isMobile && (
            <>
              <MapContol position={google.maps.ControlPosition.TOP_CENTER}>
                <div className="w-screen bg-default-bg-menu shadow-md flex items-center justify-between p-3.5">
                  <h1 className="text-xl text-[#818181]">{data.app}</h1>
                  <div className="flex gap-8">
                    <button onClick={handleLocation}>
                      <Location />
                    </button>
                    <Listbox as="div" by="id" value={style} onChange={setStyle}>
                      {({ open }) => (
                        <div className="relative mt-0.5">
                          <Listbox.Button
                            className={` relative w-fit cursor-ponter rounded-lg shadow-md focus:outline-none`}
                          >
                            <AppIcon />
                          </Listbox.Button>
                          <Transition
                            show={open}
                            enter="transition duration-400 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <Listbox.Options className="absolute mt-6 right-0 max-h-60 overflow-auto rounded-md py-1 backdrop-blur-sm bg-default-bg-menu/80 text-base shadow-lg focus:outline-none">
                              {mapStyles.map((items) => (
                                <Listbox.Option
                                  className="relative cursor-pointer select-none pl-12 pr-16 py-2 font-sans border-b border-[#545458] last:border-b-0"
                                  key={items.id}
                                  value={items}
                                >
                                  {({ selected }) => (
                                    <>
                                      {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                          <Check />
                                        </span>
                                      )}

                                      <span className="block truncate font-sans text-[#818181]">
                                        {items.name}
                                      </span>

                                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        {items.icon}
                                      </span>
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      )}
                    </Listbox>
                    <button onClick={handleZoomIn}>
                      <List />
                    </button>
                    <Listbox
                      as="div"
                      by="id"
                      value={selected}
                      onChange={setSelected}
                    >
                      {({ open }) => (
                        <div className="relative mt-0.5">
                          <Listbox.Button
                            className={` relative w-fit cursor-ponter rounded-lg shadow-md focus:outline-none`}
                          >
                            <Layer />
                          </Listbox.Button>
                          <Transition
                            show={open}
                            enter="transition duration-400 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <Listbox.Options className="absolute mt-6 right-0 max-h-60 overflow-auto rounded-md py-1 backdrop-blur-sm bg-default-bg-menu/80 text-base shadow-lg focus:outline-none">
                              {menuItems.map((items) => (
                                <Listbox.Option
                                  className="relative cursor-pointer select-none pl-12 pr-16 py-2 font-sans border-b border-[#545458] last:border-b-0"
                                  key={items.id}
                                  value={items}
                                >
                                  {({ selected }) => (
                                    <>
                                      {selected && (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                                          <Check />
                                        </span>
                                      )}

                                      <span className="block truncate font-sans text-[#818181]">
                                        {items.name}
                                      </span>

                                      <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        {items.icon}
                                      </span>
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      )}
                    </Listbox>
                  </div>
                </div>
              </MapContol>

              <MapContol position={google.maps.ControlPosition.RIGHT_BOTTOM}>
                <div className="w-fit flex items-center gap-5 bg-default-bg-menu rounded-xl p-2 m-5">
                  <button className="h-6" onClick={handleZoomOut}>
                    <Minus />
                  </button>
                  <button onClick={handleZoomIn}>
                    <Plus />
                  </button>
                </div>
              </MapContol>
            </>
          )}
          {getLayers()}
        </GoogleMap>
      )}
    </>
  );
};

export default Map;
