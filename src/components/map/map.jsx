import React, { Fragment, useEffect, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  TrafficLayer,
  OverlayView,
} from "@react-google-maps/api";
import { styles } from "./consts/style";
import { Dialog, Listbox, RadioGroup, Transition } from "@headlessui/react";
import MapContol from "./mapContol";
import {
  AppIcon,
  Check,
  Close,
  CloseCircle,
  Layer,
  Loader,
  Location,
  Logo,
  Minus,
  MinusDark,
  Pin,
  Plus,
  PlusDark,
  Search,
  Sidemenu,
} from "../../assets/icons";
import data from "../../data/data.json";
import AddMarker from "../../pages/layers/addMarker";
import MarkerComponent from "../../pages/layers/marker";
import IconButton from "../iconButton";
import { UseModeChecker } from "../../useModeChecker";
import Explore from "../../assets/icons/Explore.png";
import ExploreDark from "../../assets/icons/Explore-dark.jpeg";
import Driving from "../../assets/icons/Driving.png";
import DrivingDark from "../../assets/icons/Driving-dark.jpeg";
import Transit from "../../assets/icons/Transit.png";
import TransitDark from "../../assets/icons/Transit-dark.jpeg";
import Satellite from "../../assets/icons/Satellite.png";

const libraries = ["places", "visualization"];

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY,
    libraries,
  });

  const mode = UseModeChecker();
  const [center, setCenter] = useState({ lat: 21.5222, lng: 70.4579 });
  const [zoom, setZoom] = useState("");

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
  ];

  const [position, setPosition] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [mapType, setMapType] = useState("satellite");

  const mapTypes = [
    {
      id: 0,
      name: data.explore,
      img: mode ? ExploreDark : Explore,
    },
    {
      id: 1,
      name: data.driving,
      img: mode ? DrivingDark : Driving,
    },
    {
      id: 2,
      name: data.transit,
      img: mode ? TransitDark : Transit,
    },
    {
      id: 3,
      name: data.satellite,
      img: Satellite,
    },
  ];

  const [mapTypeLayer, setMapTypeLayer] = useState(mapTypes[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [selected, setSelected] = useState("");
  const [disableZoomIn, setDisableZoomIn] = useState(false);
  const [disableZoomOut, setDisableZoomOut] = useState(false);
  const [marker, setMarker] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);

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
      setPosition(true);
      setZoom(18);
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
        return <MarkerComponent markers={markers} />;

      default:
        break;
    }
  };

  const getPosition = () => {
    if (position) {
      return (
        <OverlayView mapPaneName={OverlayView.OVERLAY_LAYER} position={center}>
          <span className="inline-flex rounded-full h-6 w-6 bg-dark-blue rounded-full border-4 border-white"></span>
        </OverlayView>
      );
    }
    return;
  };

  useEffect(() => {
    if (selected.id === 1) {
      setZoom(6);
    } else {
      setZoom(13);
    }
  }, [selected]);

  function handleZoomChanged() {
    const currentZoom = this.getZoom();
    setZoom(currentZoom);
  }

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    switch (mapTypeLayer.id) {
      case 0:
        setMapType("roadmap");
        setShowTraffic(false);
        break;

      case 1:
        setMapType("roadmap");
        setShowTraffic(true);
        break;

      case 2:
        setMapType("roadmap");
        setShowTraffic(false);
        break;

      case 3:
        setMapType("satellite");
        setShowTraffic(false);
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
            <div className="hidden sm:flex lg:hidden md:hidden w-fit flex flex-col items-center bg-white dark:bg-secondary shadow-md rounded-xl m-4">
              <IconButton
                className="border-b border-seperator dark:border-dark-seperator focus-visible:outline-none"
                icon={<Logo />}
                onClick={openModal}
              />
              <IconButton icon={<Location />} onClick={handleLocation} />
            </div>
          </MapContol>

          <Transition appear show={isOpen} as={Fragment}>
            <Dialog
              as="div"
              className="hidden sm:flex relative z-10"
              onClose={closeModal}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 backdrop-blur-sm" />
              </Transition.Child>

              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-200"
                enterFrom="translate-y-full opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transform transition ease-in-out duration-100"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="translate-y-full opacity-0"
              >
                <div className="fixed bottom-0 w-full flex flex-col bg-light-white dark:bg-secondary shadow-md rounded-t-2xl">
                  <div className="flex min-h-full items-center justify-center text-center">
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-t-2xl bg-white/60 dark:bg-secondary p-6 text-left align-middle shadow-xl transition-all">
                      <div className="flex items-center justify-between">
                        <h1 className="text-2xl text-secondary dark:text-white">
                          Choose Map
                        </h1>
                        <span
                          className="text-2xl text-secondary dark:text-white"
                          onClick={closeModal}
                        >
                          <CloseCircle />
                        </span>
                      </div>

                      <RadioGroup
                        by="id"
                        value={mapTypeLayer}
                        onChange={setMapTypeLayer}
                      >
                        <div className="grid grid-cols-2 gap-5 pt-5">
                          {mapTypes.map((items) => (
                            <RadioGroup.Option
                              key={items.id}
                              value={items}
                              className={({ active }) =>
                                `${active ? "border-2 border-dark-blue" : ""}
                  relative cursor-pointer select-none rounded-xl w-full box-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dark-blue`
                              }
                            >
                              <div className="flex flex-col w-full items-center justify-between">
                                <img
                                  className="relative h-[4.5rem] w-full rounded-t-xl"
                                  src={items.img}
                                />
                                <span className="rounded-b-xl p-3 w-full truncate text-base bg-light-grey dark:bg-[#414141] text-secondary dark:text-white leading-none">
                                  {items.name}
                                </span>
                              </div>
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </Dialog.Panel>
                  </div>
                </div>
              </Transition.Child>
            </Dialog>
          </Transition>

          <MapContol position={google.maps.ControlPosition.RIGHT_TOP}>
            <div className="hidden sm:flex lg:hidden md:hidden w-fit bg-white dark:bg-secondary rounded-xl mx-4">
              <Listbox as="div" by="id" value={selected} onChange={setSelected}>
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button className="map-btn relative w-fit rounded-xl cursor-ponter p-3 shadow-md focus-visible:outline-none">
                      <Layer />
                    </Listbox.Button>
                    <Transition
                      show={open}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-75"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-100"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-75"
                    >
                      <Listbox.Options className="absolute mt-3 right-0 max-h-60 overflow-auto rounded-xl py-1 backdrop-blur-sm bg-white/90 dark:bg-secondary/95 text-base shadow-lg focus:outline-none">
                        {menuItems.map((items) => (
                          <Listbox.Option
                            className="relative cursor-pointer select-none pl-11 pr-24 py-2 font-sans border-b border-seperator dark:border-dark-seperator last:border-b-0"
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

                                <span className="block truncate font-sans text-base text-secondary dark:text-white">
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
                        className="flex items-center bg-light-grey text-secondary/70 dark:text-dark-grey text-base p-2.5 pl-9 rounded-xl focus:outline-none"
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
                      <span className="min-h-screen flex items-center justify-center text-secondary/70 dark:text-dark-grey text-base pb-40 rounded-lg">
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
                        leave="transition ease-in duration-100"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-75"
                      >
                        <Listbox.Options className="absolute w-max grid grid-cols-2 gap-4 items-center mt-6 p-4 right-[-0.5rem]  overflow-auto rounded-xl backdrop-blur-sm bg-light-white dark:bg-secondary/95 text-base shadow-2xl border border-seperator dark:border-dark-seperator focus:outline-none">
                          {mapTypes.map((items) => (
                            <Listbox.Option
                              className={({ selected }) =>
                                `${
                                  selected ? "border-2 border-dark-blue" : ""
                                } relative cursor-pointer select-none rounded-xl w-full border-box object-cover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dark-blue`
                              }
                              key={items.id}
                              value={items}
                            >
                              <div className="flex flex-col w-full items-center justify-between">
                                <img
                                  className="relative h-20 w-full rounded-t-xl"
                                  src={items.img}
                                />
                                <span className="rounded-b-xl p-3 w-full truncate text-base bg-white/50 dark:bg-[#414141] text-secondary dark:text-white leading-none">
                                  {items.name}
                                </span>
                              </div>
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  )}
                </Listbox>

                {/* <span
                  className="cursor-pointer text-base text-secondary dark:text-dark-grey"
                  onClick={handleZoomIn}
                >
                  3D
                </span>

                <button onClick={handleZoomOut}>
                  <Routes />
                </button> */}

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
                        leave="transition ease-in duration-100"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-75"
                      >
                        <Listbox.Options className="absolute mt-6 right-0 max-h-60 overflow-auto rounded-xl py-1 backdrop-blur-sm bg-white/80 dark:bg-secondary/95 text-base shadow-2xl focus:outline-none">
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

          {getPosition()}

          {showTraffic ? (
            <TrafficLayer
              options={{
                autoRefresh: true,
              }}
              autoUpdate
            />
          ) : null}
        </GoogleMap>
      )}
    </>
  );
};

export default Map;
