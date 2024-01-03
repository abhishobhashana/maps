import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, TrafficLayer } from "@react-google-maps/api";
import { styles } from "./consts/style";
import { Listbox, Transition } from "@headlessui/react";
import Loader from "../../assets/images/Loader";
import MapContol from "./mapContol";
import Plus from "../../assets/images/Plus";
import Minus from "../../assets/images/Minus";
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
import IconButton from "../iconButton";

const libraries = ["places", "visualization"];

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY,
    libraries,
  });

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
  const [mapType, setMapType] = useState("satellite");
  const [selected, setSelected] = useState(menuItems[0]);
  const [disableZoomIn, setDisableZoomIn] = useState(false);
  const [disableZoomOut, setDisableZoomOut] = useState(false);
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
    width: "100vw",
    height: "100vh",
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

  function handleZoomChanged() {
    const currentZoom = this.getZoom();
    setZoom(currentZoom);
  }

  useEffect(() => {
    if (zoom < 8) {
      setMapType("satellite");
    } else {
      setMapType("roadmap");
    }
  });

  useEffect(() => {
    if (zoom === 3) {
      setDisableZoomOut(true);
    } else {
      setDisableZoomOut(false);
    }
    if (zoom === 22) {
      setDisableZoomIn(true);
    } else {
      setDisableZoomIn(false);
    }
  });

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
            mapTypeId: mapType,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            gestureHandling: "greedy",
            restriction: {
              latLngBounds: {
                north: 85,
                south: -85,
                east: 179,
                west: -179,
              },
              strictBounds: true,
            },
          }}
          center={center}
          zoom={zoom}
          onClick={(e) => {
            onMapClick(e);
          }}
          onZoomChanged={handleZoomChanged}
        >
          <MapContol position={google.maps.ControlPosition.RIGHT_TOP}>
            <div className="hidden sm:flex md:hidden w-fit flex flex-col items-center bg-secondary shadow-md backdrop-blur-sm rounded-xl m-4">
              <IconButton
                className="border-b border-dark-seperator"
                icon={<Location />}
                onClick={handleLocation}
              />
              <IconButton icon={<List />} onClick={handleZoomIn} />
            </div>
          </MapContol>

          <MapContol position={google.maps.ControlPosition.RIGHT_TOP}>
            <div className="hidden sm:flex md:hidden w-fit bg-secondary shadow-md rounded-xl mx-4">
              <Listbox as="div" by="id" value={selected} onChange={setSelected}>
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button className="map-btn relative w-fit cursor-ponter rounded-lg p-3.5 shadow-md outline:none">
                      <Layer />
                    </Listbox.Button>
                    <Transition
                      show={open}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-75"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-200"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-75"
                    >
                      <Listbox.Options className="absolute mt-3 right-0 max-h-60 overflow-auto rounded-md py-1 bg-secondary text-base shadow-lg focus:outline-none">
                        {menuItems.map((items) => (
                          <Listbox.Option
                            className="relative cursor-pointer select-none pl-12 pr-16 py-2 font-sans border-b border-dark-seperator last:border-b-0"
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

                                <span className="block truncate font-sans text-dark-white">
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

          <MapContol position={google.maps.ControlPosition.TOP_CENTER}>
            <div className="hidden lg:flex md:flex w-screen bg-secondary shadow-md flex items-center justify-between px-6 py-3.5">
              <h1 className="text-xl text-dark-grey">{data.app}</h1>
              <div className="flex gap-8">
                <button onClick={handleLocation}>
                  <Location />
                </button>
                <Listbox as="div" by="id" value={style} onChange={setStyle}>
                  {({ open }) => (
                    <div className="relative mt-0.5">
                      <Listbox.Button className="relative w-fit cursor-ponter rounded-lg shadow-md focus:outline-none">
                        <AppIcon />
                      </Listbox.Button>
                      <Transition
                        show={open}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-75"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-75"
                      >
                        <Listbox.Options className="absolute mt-6 right-0 max-h-60 overflow-auto rounded-md py-1 bg-secondary text-base shadow-lg focus:outline-none">
                          {mapStyles.map((items) => (
                            <Listbox.Option
                              className="relative cursor-pointer select-none pl-10 pr-24 py-2 border-b border-dark-seperator last:border-b-0"
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

                                  <span className="block truncate font-sans text-dark-white">
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
                      <Listbox.Button className="relative w-fit cursor-ponter rounded-lg shadow-md focus:outline-none">
                        <Layer />
                      </Listbox.Button>
                      <Transition
                        show={open}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-75"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-75"
                      >
                        <Listbox.Options className="absolute mt-8 right-0 max-h-60 overflow-auto rounded-md py-1 bg-secondary text-base shadow-md focus:outline-none">
                          {menuItems.map((items) => (
                            <Listbox.Option
                              className="relative cursor-pointer select-none pl-10 pr-24 py-2 font-sans border-b border-dark-seperator last:border-b-0"
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

                                  <span className="block truncate font-sans text-dark-white">
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
            <div className="hidden lg:flex md:flex w-fit flex items-center bg-secondary shadow-md rounded-2xl m-5">
              <IconButton
                small
                zoomControl
                disableVal={disableZoomOut}
                icon={<Minus />}
                onClick={handleZoomOut}
              />

              <IconButton
                small
                zoomControl
                disableVal={disableZoomIn}
                icon={<Plus />}
                onClick={handleZoomIn}
              />
            </div>
          </MapContol>

          {getLayers()}
        </GoogleMap>
      )}
    </>
  );
};

export default Map;
