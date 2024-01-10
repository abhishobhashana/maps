import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, TrafficLayer } from "@react-google-maps/api";
import { styles } from "./consts/style";
import { Listbox, Transition } from "@headlessui/react";
import { Loader } from "../../assets/images/Loader";
import MapContol from "./mapContol";
import { Plus } from "../../assets/images/Plus";
import { Minus } from "../../assets/images/Minus";
import { PlusDark } from "../../assets/images/Plus-dark";
import { MinusDark } from "../../assets/images/Minus-dark";
import { Location } from "../../assets/images/Location";
import { List } from "../../assets/images/List";
import { Layer } from "../../assets/images/Layer";
import data from "../../data/data.json";
import Pin from "../../assets/images/Pin";
import Column from "../../assets/images/Column";
import Check from "../../assets/images/Check";
import AddMarker from "../../pages/layers/addMarker";
import Marker from "../../pages/layers/marker";
import { AppIcon } from "../../assets/images/AppIcon";
import { Sidemenu } from "../../assets/images/Sidemenu";
import { Close } from "../../assets/images/Close";
import IconButton from "../iconButton";
import { Search } from "../../assets/images/Search";
import { UseModeChecker } from "../../useModeChecker";
import { Routes } from "../../assets/images/Route";
import favicon from "../../../public/favicon.svg";
import { Logo } from "../../assets/images/Logo";

const libraries = ["places", "visualization"];

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY,
    libraries,
  });

  const [map, setMap] = useState(null);
  const mode = UseModeChecker();
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

  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [mapType, setMapType] = useState("satellite");

  const mapTypes = [
    {
      id: 0,
      name: data.standard,
      img: mode
        ? "https://cdn.apple-mapkit.com/mk/5.76.120/images/icons/map-type-standard-dark.png"
        : "https://cdn.apple-mapkit.com/mk/5.76.120/images/icons/map-type-standard.png",
    },
    {
      id: 1,
      name: data.hybrid,
      img: "https://cdn.apple-mapkit.com/mk/5.76.120/images/icons/map-type-hybrid.png",
    },
    {
      id: 2,
      name: data.satellite,
      img: "https://cdn.apple-mapkit.com/mk/5.76.120/images/icons/map-type-satellite.png",
    },
  ];
  const [mapTypeLayer, setMapTypeLayer] = useState(mapTypes[0]);
  const [openSearchDrawer, setOpenSearchDrawer] = useState(false);
  const [selected, setSelected] = useState(menuItems[0]);
  const [disableZoomIn, setDisableZoomIn] = useState(false);
  const [disableZoomOut, setDisableZoomOut] = useState(false);
  const [marker, setMarker] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  // `https://api.maptiler.com/geocoding/${value}.json?autocomplete=false&fuzzyMatch=true&limit=3&key=LsBlTM26EDYF7qNveOnR`

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debounceSearch = debounce(async (value) => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        const places = data.filter((user) => {
          return (
            value &&
            user &&
            user.name &&
            user.name.toLowerCase().includes(value.toLowerCase())
          );
        });
        setSearchResult(places);
      } else {
        console.warn(response.statusText);
      }
    } catch (e) {
      console.warn("error found", e);
    }
  }, 1000);

  useEffect(() => {
    debounceSearch(searchValue);
    return () => clearTimeout(debounceSearch);
  }, [searchValue]);

  const onSearchChange = (value) => {
    setSearchValue(value);
    if (value.length >= 1) {
      debounceSearch(value);
    } else {
      debounceSearch(null);
    }
  };

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
    switch (mapTypeLayer.id) {
      case 0:
        setMapType("roadmap");
        break;

      case 1:
        setMapType("hybrid");
        break;

      case 2:
        setMapType("satellite");
        break;

      default:
        break;
    }
  }, [mapTypeLayer]);

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
            styles: mode ? styles.dark : styles.silver,
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
            <div className="hidden sm:flex lg:hidden md:hidden w-fit flex flex-col items-center bg-light-white dark:bg-secondary shadow-md rounded-xl m-4">
              <IconButton
                className="border-b border-seperator dark:border-dark-seperator"
                icon={<Logo />}
                onClick={() => setOpenSearchDrawer(!openSearchDrawer)}
              />
              <IconButton icon={<Location />} onClick={handleLocation} />
            </div>
          </MapContol>

          {openSearchDrawer ? (
            <div className="hidden sm:flex lg:hidden md:hidden absolute bottom-0 w-full flex flex-col bg-light-white dark:bg-secondary shadow-md rounded-t-2xl border border-seperator dark:border-dark-seperator">
              <div className="flex items-center justify-between px-5 pt-5">
                <h1 className="text-2xl text-secondary dark:text-white">
                  Choose map
                </h1>
                <span
                  className="text-2xl text-secondary dark:text-white"
                  onClick={() => setOpenSearchDrawer(!openSearchDrawer)}
                >
                  <Close />
                </span>
              </div>
              <div className="grid grid-cols-2 gap-5 p-5">
                {mapTypes.map((items) => (
                  <div
                    className="relative cursor-pointer select-none w-full"
                    key={items.id}
                    value={items.id}
                  >
                    <>
                      <img
                        className="relative box-border h-28 w-full rounded-xl object-cover"
                        src={items.img}
                      />
                      <span className="absolute bottom-0 p-3 w-full rounded-b-lg truncate text-base bg-light-white dark:bg-[#414141] text-secondary dark:text-white leading-none">
                        {items.name}
                      </span>
                    </>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <MapContol position={google.maps.ControlPosition.RIGHT_TOP}>
            <div className="hidden sm:flex lg:hidden md:hidden w-fit bg-light-white dark:bg-secondary rounded-xl mx-4">
              <Listbox as="div" by="id" value={selected} onChange={setSelected}>
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button className="map-btn relative w-fit rounded-xl cursor-ponter p-3 shadow-md">
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
                      <Listbox.Options className="absolute mt-3 right-0 max-h-60 overflow-auto rounded-xl py-1 backdrop-blur-sm bg-white/80 dark:bg-secondary/95 text-base shadow-lg focus:outline-none">
                        {menuItems.map((items) => (
                          <Listbox.Option
                            className="relative cursor-pointer select-none pl-12 pr-16 py-2 font-sans border-b border-seperator dark:border-dark-seperator last:border-b-0"
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

                                <span className="block truncate font-sans text-secondary dark:text-white">
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
            <div className="hidden lg:flex md:flex h-14 w-screen bg-light-white dark:bg-secondary shadow-md border-b-2 border-seperator dark:border-dark-seperator flex items-center justify-between first:p-0 first:pr-6 px-6 py-3.5">
              <div className="flex items-center">
                {openSideMenu && (
                  <div
                    className={`${
                      openSideMenu ? "mr-6" : "m-0"
                    } h-[91rem] w-full mt-[87rem] flex flex-col gap-4 p-6 bg-light-white dark:bg-secondary text-white shadow-md border-r-2 border-seperator dark:border-dark-seperator`}
                  >
                    <span
                      className="cursor-pointer"
                      onClick={() => setOpenSideMenu(!openSideMenu)}
                    >
                      <Close />
                    </span>
                    <div className="grid w-80 relative items-center">
                      <span className="absolute ml-2 pointer-events-none">
                        <Search />
                      </span>

                      <input
                        type="text"
                        placeholder="Search Maps"
                        autoComplete="off"
                        aria-label="Search Maps"
                        className="flex items-center bg-light-grey text-secondary/40 dark:text-dark-grey text-base p-2.5 pl-9 rounded-xl focus:outline-none"
                        spellCheck="false"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                      />
                    </div>
                    {searchResult.slice(0, 8).map((place, index) => {
                      return (
                        <div key={index} className="min-h-screen py-4">
                          <span
                            key={index}
                            className="bg-light-grey text-secondary/40 dark:text-dark-grey text-base cursor-pointer p-4 rounded-lg"
                            onClick={() => onSearchChange(place.name)}
                          >
                            {place.name}
                          </span>
                        </div>
                      );
                    })}

                    {!searchResult
                      .map((e) => e.name)
                      .toString()
                      .toLocaleLowerCase()
                      .includes(searchValue) && searchValue.length >= 1 ? (
                      <span className="min-h-screen flex items-center justify-center text-secondary/40 dark:text-dark-grey text-base pb-40 rounded-lg">
                        {data.noResult}
                      </span>
                    ) : null}
                  </div>
                )}
                <span
                  className={`${openSideMenu ? "pr-6" : "px-6"} cursor-pointer`}
                  title="show menu"
                  onClick={() => setOpenSideMenu(!openSideMenu)}
                >
                  <Sidemenu />
                </span>
                <h1 className="text-xl text-secondary dark:text-dark-grey pr-6">
                  {data.app}
                </h1>
              </div>

              <div className="flex items-center gap-8">
                <button onClick={handleLocation}>
                  <Location />
                </button>

                <Listbox
                  as="div"
                  by="id"
                  value={mapTypeLayer}
                  onChange={setMapTypeLayer}
                >
                  {({ open }) => (
                    <div className="relative mt-0.5">
                      <Listbox.Button className="relative w-fit cursor-ponter focus:outline-none">
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
                        <Listbox.Options className="absolute flex items-center mt-6 px-0 py-7 right-0 max-h-60 overflow-auto flex rounded-xl backdrop-blur-sm bg-white/80 dark:bg-secondary/90 text-base shadow-2xl border border-seperator dark:border-dark-seperator focus:outline-none">
                          {mapTypes.map((items) => (
                            <Listbox.Option
                              className="relative cursor-pointer select-none pl-7 last:pr-7"
                              key={items.id}
                              value={items}
                            >
                              {({ selected }) => (
                                <>
                                  <div className="flex flex-col items-center gap-2.5">
                                    <img
                                      className={`${
                                        selected
                                          ? "border-2 border-dark-blue"
                                          : ""
                                      } box-border h-[60px] w-20 rounded-lg object-cover`}
                                      src={items.img}
                                    />
                                    <span className="block truncate font-sans text-secondary dark:text-white leading-none">
                                      {items.name}
                                    </span>
                                  </div>
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  )}
                </Listbox>

                <span
                  className="cursor-pointer text-base text-secondary dark:text-dark-grey"
                  onClick={handleZoomIn}
                >
                  3D
                </span>

                <button onClick={handleZoomOut}>
                  <Routes />
                </button>

                <Listbox
                  as="div"
                  by="id"
                  value={selected}
                  onChange={setSelected}
                >
                  {({ open }) => (
                    <div className="relative mt-0.5">
                      <Listbox.Button className="relative w-fit cursor-ponter focus:outline-none">
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
                        <Listbox.Options className="absolute mt-6 right-0 max-h-60 overflow-auto rounded-xl py-1 backdrop-blur-sm bg-white/80 dark:bg-secondary/90 text-base shadow-2xl focus:outline-none">
                          {menuItems.map((items) => (
                            <Listbox.Option
                              className="relative cursor-pointer select-none pl-10 pr-24 py-2 font-sans border-b border-seperator dark:border-dark-seperator last:border-b-0"
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

                                  <span className="block truncate font-sans text-secondary dark:text-white">
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
            <div className="hidden lg:flex md:flex w-fit flex items-center bg-light-white dark:bg-secondary shadow-md rounded-2xl m-5">
              {mode ? (
                <>
                  <IconButton
                    className="map-btn"
                    small
                    disableVal={disableZoomOut}
                    icon={<Minus />}
                    onClick={handleZoomOut}
                  />

                  <IconButton
                    className="map-btn"
                    small
                    disableVal={disableZoomIn}
                    icon={<Plus />}
                    onClick={handleZoomIn}
                  />
                </>
              ) : (
                <>
                  <IconButton
                    className="map-btn-dark"
                    small
                    disableVal={disableZoomOut}
                    icon={<MinusDark />}
                    onClick={handleZoomOut}
                  />

                  <IconButton
                    className="map-btn-dark"
                    small
                    disableVal={disableZoomIn}
                    icon={<PlusDark />}
                    onClick={handleZoomIn}
                  />
                </>
              )}
            </div>
          </MapContol>

          <MapContol position={google.maps.ControlPosition.LEFT_BOTTOM}>
            <div className="flex md:flex w-fit gap-1.5 items-center m-5">
              <Logo height={20} width={20} />

              <h1 className="text-xl text-secondary dark:text-white">
                {data.app}
              </h1>
            </div>
          </MapContol>

          {getLayers()}
        </GoogleMap>
      )}
    </>
  );
};

export default Map;
