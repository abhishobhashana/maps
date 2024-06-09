import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  AttributionControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import CustomZoom from "../CustomZoom";
import { UseModeChecker } from "../../useModeChecker";
import { Dialog, Listbox, RadioGroup, Transition } from "@headlessui/react";
import {
  Bus,
  Close,
  CloseCircle,
  Globe,
  Loader,
  Location,
  LocationDenied,
  LocationFill,
  Logo,
  MapIcon,
  PinCircle,
  Routes,
  Search,
  SearchCircle,
  Sidemenu,
  Train,
} from "../../assets/icons";
import data from "../../data/data.json";
import "leaflet/dist/leaflet.css";
import IconButton from "../iconButton";
import Explore from "../../assets/images/Explore.png";
import ExploreDark from "../../assets/images/Explore-dark.png";
import Satellite from "../../assets/images/Satellite.png";
import LocationMarker from "../../assets/images/LocationMarker.png";
import LocationCircle from "../../assets/images/LocationCircle.png";

const Maps = () => {
  const mode = UseModeChecker();

  const lightMap =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  // https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png
  // https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}
  // https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png
  // https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png
  const darkMap =
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  const satellite =
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png";

  const mapTypes = [
    {
      id: 0,
      name: data.explore,
      img: mode ? ExploreDark : Explore,
    },
    {
      id: 1,
      name: data.satellite,
      img: Satellite,
    },
  ];

  const mapRef = useRef();
  const [center, setCenter] = useState({ lat: 21.5222, lng: 70.4579 });
  const [locationDetails, setLocationDetails] = useState({
    lat: 0,
    lng: 0,
    name: "",
    address: "",
    country: "",
  });
  const [zoom, setZoom] = useState(7);
  const [loading, setLoading] = useState(false);
  const [mapType, setMapType] = useState("");
  const [mapTypeLayer, setMapTypeLayer] = useState(mapTypes[0]);
  const [position, setPosition] = useState(false);
  const [searchedPosition, setSearchedPosition] = useState(false);
  const [isOpenSearchPanel, setIsOpenSearchPanel] = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);
  const [isOpenSearchModal, setIsOpenSearchModal] = useState(false);
  const [recents, setRecents] = useState([]);
  const [mapTypeIcon, setMapTypeIcon] = useState({
    icon: <Logo />,
  });

  const locationIndicatorIcon = L.icon({
    iconUrl: LocationCircle,
    iconSize: [25, 25],
    iconAnchor: [20, 20],
    popupAnchor: [0, -32],
  });

  const locationMarkerIcon = L.icon({
    iconUrl: LocationMarker,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -32],
  });

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debounceSearch = debounce(async (value) => {
    if (value.length) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?&addressdetails=1&q=${value}&format=json&limit=9`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          const data = await response.json();
          const filteredData = data?.filter((place) =>
            place?.name?.toLowerCase().includes(value.toLowerCase())
          );

          setTimeout(() => {
            if (filteredData.length > 0) {
              setSearchResult(filteredData);
              setIsSearchEmpty(false);
            } else {
              setSearchResult([]);
              setIsSearchEmpty(true);
            }
            setLoading(false);
          }, 500);
        } else {
          console.warn(response.statusText);
        }
      } catch (e) {
        console.warn("Error found", e);
        setLoading(false);
      }
    } else {
      setSearchResult([]);
      setIsSearchEmpty(false);
      setLoading(false);
    }
  }, 300);

  const debounceSearchRoutes = debounce(
    async (from_lat, from_lng, to_lat, to_lng) => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://routing.openstreetmap.de/routed-car/route/v1/driving/${from_lng},${from_lat};${to_lng},${to_lat}?overview=false&alternatives=true&steps=true`,
          {
            method: "GET",
          }
        );

        setIsSearchEmpty(true);

        if (response.ok) {
          const data = await response.json();
          const filteredData = data?.filter((place) =>
            place?.name?.toLowerCase().includes(value.toLowerCase())
          );
          setTimeout(() => {
            setSearchResult(filteredData);
            if (filteredData.length) {
              setIsSearchEmpty(false);
            } else {
              setIsSearchEmpty(true);
            }
          }, 500);
          setLoading(false);
        } else {
          console.warn(response.statusText);
        }
      } catch (e) {
        console.warn("error found", e);
      }
    },
    300
  );

  const getSearchedResultsTypeIcon = (type) => {
    switch (type) {
      case "city":
      case "centre":
      case "hamlet":
      case "police":
      case "ruins":
        return <PinCircle />;

      case "bus_station":
        return <Bus />;

      case "stop":
      case "station":
      case "train_station":
        return <Train />;

      default:
        return <SearchCircle />;
    }
  };

  useEffect(() => {
    debounceSearch(searchValue);
    return () => clearTimeout(debounceSearch);
  }, [searchValue]);

  useEffect(() => {
    switch (mapTypeLayer.id) {
      case 0:
        setMapType(mode ? darkMap : lightMap);
        setMapTypeIcon({
          icon: <Logo />,
        });
        break;

      case 1:
        setMapType(satellite);
        setMapTypeIcon({
          icon: <Globe />,
        });
        break;

      default:
        break;
    }
  }, [mapTypeLayer, mode]);

  const onSearchChange = (value) => {
    setSearchValue(value);
    if (value.length >= 1) {
      debounceSearch(value);
    } else {
      debounceSearch(null);
    }
  };

  const handleSelectedItembyClick = (place) => {
    const pos = {
      lat: Number(place?.lat),
      lng: Number(place?.lon),
    };
    setCenter(pos);
    setPosition(false);
    setSearchedPosition(true);
    setOpenLocationModal(true);
    setIsOpenSearchPanel(false);
    setShowCancel(false);
    mapRef.current.flyTo(pos, 10);
    const details = {
      name: place?.name,
      country: place?.address?.country,
      address: place?.display_name,
      lat: place?.lat,
      lng: place?.lon,
    };
    setLocationDetails(details);
    setRecents((prev) => {
      if (prev.some((item) => item.name === details.name)) {
        return prev;
      } else {
        const newRecents = [details, ...prev];
        return newRecents;
      }
    });
  };

  const handleRecentSelectedItembyClick = (place) => {
    const pos = {
      lat: Number(place?.lat),
      lng: Number(place?.lng),
    };
    setCenter(pos);
    setPosition(false);
    setSearchedPosition(true);
    setOpenLocationModal(true);
    setIsOpenSearchPanel(false);
    setShowCancel(false);
    mapRef.current.flyTo(pos, 10);
    const details = {
      name: place?.name,
      country: place?.country,
      address: place?.address,
      lat: place?.lat,
      lng: place?.lng,
    };
    setLocationDetails(details);
  };

  const getLocationDetails = async (lat, lng) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&limit=10`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLoading(false);
        setLocationDetails({
          lat: data?.lat,
          lng: data?.lon,
          name: data?.address?.suburb || data?.address?.road,
          address: data?.display_name,
          country: data?.address?.country,
        });
      } else {
        console.warn(response.statusText);
      }
    } catch (e) {
      console.warn("error found", e);
    }
  };

  const handleLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          setPosition(true);
          setSearchedPosition(false);
          setZoom(18);
          mapRef.current.flyTo(pos, 18);
          getLocationDetails(pos.lat, pos.lng);
        },
        function (error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setPosition(false);
              const pos = {
                lat: 21.5222,
                lng: 70.4579,
              };
              setCenter(pos);
              setLocationDetails(pos);
              mapRef.current.flyTo(pos, 7);
              break;

            default:
              break;
          }
        }
      );
    }
  };

  useEffect(() => {
    if (!position && !searchedPosition) {
      handleLocation();
    }
  }, [position, searchedPosition]);

  return (
    <MapContainer
      ref={mapRef}
      className="min-h-screen h-dvh max-w-8xl !bg-light-white dark:!bg-default"
      center={center}
      zoom={zoom}
      animate={true}
      preferCanvas={true}
      zoomControl={false}
      attributionControl={false}
      zoomAnimation
      minZoom={2}
      maxBounds={[
        [-90, -180],
        [90, 180],
      ]}
    >
      <TileLayer url={mapType} />
      <AttributionControl
        position="bottomleft"
        prefix='<a href="https://leafletjs.com/">Leaflet</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <CustomZoom mode={mode} />

      {position || searchedPosition ? (
        <Marker
          position={center}
          icon={position ? locationIndicatorIcon : locationMarkerIcon}
          eventHandlers={{
            click: () => {
              if (position) {
                setOpenLocationModal(true);
              }
              if (searchedPosition) {
                setSearchedPosition(true);
                setOpenLocationModal(true);
              }
            },
          }}
        >
          <Popup
            className="tracking-tight relative hidden lg:flex w-fit p-4 bg-light-white dark:bg-secondary rounded-xl shadow-2xl border border-seperator dark:border-dark-seperator"
            offset={[200, 180]}
            closeButton={false}
          >
            <div className="w-full flex flex-col gap-2.5 font-sans">
              <div className="flex gap-2.5 items-start justify-between">
                <div className="flex flex-col">
                  <span className="leading-6 font-displayMedium text-xl text-secondary dark:text-white">
                    {position ? data.myLocation : locationDetails?.name}
                  </span>
                  <span className="leading-6 text-base text-light-grey-third dark:text-light-grey-second">
                    {locationDetails?.country}
                  </span>
                </div>
                <span
                  className="w-fit cursor-pointer"
                  onClick={() => mapRef.current.closePopup()}
                >
                  <CloseCircle popup />
                </span>
              </div>
              <div className="flex flex-col gap-2.5 items-start">
                <span className="text-base font-sansMedium text-secondary dark:text-white">
                  {data.details}
                </span>
                <div className="w-full flex flex-col bg-white dark:bg-[#414141] rounded-xl gap-2.5">
                  <div className="p-4 pb-0 w-full flex gap-5">
                    <div className="w-full flex flex-col">
                      <span className="text-xs text-light-grey-third dark:text-light-grey-second">
                        {data.address}
                      </span>
                      <span className="min-w-[16rem] w-full tracking-tight text-sm text-secondary dark:text-white">
                        {locationDetails.address}
                      </span>
                    </div>
                  </div>
                  <span className="ml-4 border border-seperator/10 dark:border-dark-seperator" />
                  <div className="p-4 pt-0 flex flex-col font-sans">
                    <span className="text-xs text-light-grey-third dark:text-light-grey-second">
                      {data.coords}
                    </span>
                    <span className="text-sm text-secondary dark:text-white">
                      {locationDetails.lat}&#44;&nbsp;
                      {locationDetails.lng}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Popup>

          <Transition appear show={openLocationModal} as={Fragment}>
            <Dialog
              as="div"
              className="tracking-tight lg:hidden sm:flex relative z-10"
              onClose={() => {
                setOpenLocationModal(false);
              }}
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
                <div className="fixed inset-0" />
              </Transition.Child>

              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-y-full opacity-0"
                enterTo="translate-y-0 opacity-100"
                leave="transform transition ease-in-out duration-150"
                leaveFrom="translate-y-0 opacity-100"
                leaveTo="translate-y-full opacity-0"
              >
                <div className="fixed bottom-0 w-full flex flex-col bg-light-white dark:bg-primary shadow-md rounded-t-2xl">
                  <div className="flex min-h-full items-center justify-center text-center">
                    <Dialog.Panel className="w-full max-w-md flex flex-col transform overflow-hidden rounded-t-2xl bg-light-white dark:bg-secondary p-4 pb-6 gap-4 text-left align-middle shadow-xl transition-all">
                      {loading ? (
                        <Loader className="max-h-56" />
                      ) : (
                        <div className="w-full flex flex-col gap-2.5 font-sans">
                          <div className="flex gap-2.5 items-start justify-between">
                            <div className="flex flex-col">
                              <span className="leading-6 font-displayMedium text-2xl text-secondary dark:text-white">
                                {position
                                  ? data.myLocation
                                  : locationDetails.name}
                              </span>
                              <span className="leading-6 text-lg text-light-grey-third dark:text-light-grey-second">
                                {locationDetails.country}
                              </span>
                            </div>
                            <span
                              className="w-fit cursor-pointer"
                              onClick={() => {
                                setOpenLocationModal(false);
                                setIsOpenSearchPanel(true);
                                if (searchValue.length) {
                                  setShowCancel(true);
                                }
                              }}
                            >
                              <CloseCircle />
                            </span>
                          </div>
                          <div className="flex flex-col gap-2.5 items-start">
                            <span className="text-lg font-sansMedium text-secondary dark:text-white">
                              {data.details}
                            </span>
                            <div className="w-full flex flex-col bg-white dark:bg-[#414141] rounded-xl  gap-2.5">
                              <div className="p-4 pb-0 w-full flex gap-5">
                                <div className="w-full flex flex-col">
                                  <span className="text-sm text-light-grey-third dark:text-light-grey-second">
                                    {data.address}
                                  </span>
                                  <span className="text-base text-secondary dark:text-white">
                                    {locationDetails.address}
                                  </span>
                                </div>
                              </div>
                              <span className="ml-4 border border-seperator/10 dark:border-dark-seperator" />
                              <div className="p-4 pt-0 flex flex-col font-sans">
                                <span className="text-sm text-light-grey-third dark:text-light-grey-second">
                                  {data.coords}
                                </span>
                                <span className="text-base text-secondary dark:text-white">
                                  {locationDetails.lat}&#44;&nbsp;
                                  {locationDetails.lng}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Dialog.Panel>
                  </div>
                </div>
              </Transition.Child>
            </Dialog>
          </Transition>
        </Marker>
      ) : null}

      <div className="relative hidden lg:flex h-12 w-screen bg-light-white dark:bg-secondary font-sans  shadow-md border-b-2 border-seperator dark:border-dark-seperator items-center justify-between first:p-0 first:pr-6 pr-6 py-3.5">
        <div className="flex items-center">
          {openSideMenu && (
            <div
              className={`${
                openSideMenu ? "mr-6" : "m-0"
              } h-[91rem] w-[100%] min-w-[23.1rem] max-w-[23.1rem] mt-[87rem] flex flex-col gap-4 p-6 bg-light-white dark:bg-secondary text-white shadow-md border-r-2 border-seperator dark:border-dark-seperator`}
            >
              <span
                className="w-fit cursor-pointer"
                onClick={() => setOpenSideMenu(!openSideMenu)}
              >
                <Close />
              </span>

              <div className="grid w-full relative items-center">
                <span className="absolute ml-2 pointer-events-none">
                  <Search />
                </span>

                {searchValue.length ? (
                  <span
                    className="absolute right-2 cursor-pointer"
                    onClick={() => {
                      setSearchValue("");
                      setSearchResult([]);
                    }}
                  >
                    <CloseCircle input />
                  </span>
                ) : null}

                <input
                  type="text"
                  placeholder="Search Maps"
                  autoComplete="off"
                  aria-label="Search Maps"
                  className="flex items-center bg-light-white-second dark:bg-light-grey placeholder-light-grey-third dark:placeholder-light-grey-second text-secondary dark:text-white text-base p-2 pl-8 rounded-xl focus:outline-none"
                  spellCheck="false"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>

              {searchValue.length && !loading ? (
                <div>
                  {searchResult?.map((place, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full border-b last:border-none border-seperator dark:border-dark-seperator"
                      >
                        <span
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSelectedItembyClick(place)}
                        >
                          <span>{getSearchedResultsTypeIcon(place.type)}</span>
                          <div className="flex flex-col p-2">
                            <span className="text-[1.063rem] leading-5 tracking-tight text-secondary dark:text-white">
                              {place?.name}
                            </span>
                            <span className="flex text-sm tracking-tight text-secondary dark:text-light-grey-second">
                              {place?.address?.state}&#44;&nbsp;
                              {place?.address?.country}
                            </span>
                          </div>
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : searchValue.length && loading ? (
                <Loader className="pb-40" />
              ) : null}

              {!searchResult.length && recents.length ? (
                <div className="w-full flex flex-col gap-5">
                  <div className="flex flex-col">
                    <div className="flex justify-between border-b-2 border-seperator dark:border-dark-seperator">
                      <span className="p-0 pb-2 text-base font-sansMedium tracking-tight text-light-grey-third dark:text-light-grey-second">
                        {data.recents}
                      </span>

                      <span
                        className="text-base tracking-tight text-blue cursor-pointer"
                        onClick={() => {
                          setIsOpenSearchPanel(false);
                          setShowCancel(false);
                          setRecents([]);
                        }}
                      >
                        {data.clear}
                      </span>
                    </div>

                    {recents &&
                      recents.map((e, index) => {
                        return (
                          <div
                            className="flex items-center border-b last:border-0 border-seperator dark:border-dark-seperator"
                            key={index}
                            onClick={() => handleRecentSelectedItembyClick(e)}
                          >
                            <Search />
                            <div className="flex items-center gap-1 p-2.5">
                              <span className="text-base tracking-tight text-secondary dark:text-white">
                                {e?.name}
                              </span>
                              <span className="text-xs tracking-tight text-secondary dark:text-light-grey-second">
                                &#x2022;
                              </span>
                              <span className="text-base tracking-tight text-secondary dark:text-light-grey-second">
                                {e.country}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : null}

              {isSearchEmpty && !searchResult.length ? (
                <span className="min-h-screen flex items-center justify-center text-light-grey-third dark:text-light-grey-second text-base pb-40 rounded-lg">
                  {data.noResult}
                </span>
              ) : null}
            </div>
          )}

          <span
            className={`${openSideMenu ? "pr-6" : "px-6"} cursor-pointer`}
            title="open sidemenu"
            onClick={() => setOpenSideMenu(!openSideMenu)}
          >
            <Sidemenu />
          </span>

          <span className="font-sansMedium text-lg tracking-tighter text-secondary dark:text-light-white pr-6">
            {position || searchedPosition ? locationDetails.name : data.app}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={handleLocation}>
            {searchedPosition ? (
              <Location />
            ) : position ? (
              <LocationFill />
            ) : (
              <LocationDenied />
            )}
          </button>

          <Listbox
            as="div"
            by="id"
            value={mapTypeLayer}
            onChange={setMapTypeLayer}
          >
            {({ open }) => (
              <div className="relative mt-1.5">
                <Listbox.Button className="relative w-fit cursor-ponter focus:outline-none">
                  <MapIcon />
                </Listbox.Button>
                <Transition
                  show={open}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-50"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-200"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-50"
                >
                  <Listbox.Options className="absolute w-max grid grid-cols-2 gap-4 items-center mt-6 p-4 right-0 overflow-auto rounded-xl bg-light-white dark:bg-secondary text-base shadow-2xl border border-seperator dark:border-dark-seperator focus:outline-none">
                    {mapTypes.map((items) => (
                      <Listbox.Option
                        className={({ selected }) =>
                          `${
                            selected ? "border-2 border-dark-blue" : ""
                          } relative cursor-pointer select-none rounded-xl w-full border-box object-cover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dark-blue active:bg-secondary`
                        }
                        key={items.id}
                        value={items}
                      >
                        <div className="flex flex-col w-full items-center justify-between">
                          <img
                            className="relative h-20 w-full rounded-t-xl active:opacity-50"
                            src={items.img}
                            alt={items.name}
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

          <button
            onClick={() => {
              setOpenSideMenu(!openSideMenu);
            }}
          >
            <Routes />
          </button>
        </div>
      </div>

      <div className="absolute top-2.5 right-2.5 hidden sm:flex lg:hidden md:hidden w-fit flex-col items-center gap-2.5">
        <div className="flex flex-col bg-light-white dark:bg-secondary shadow-md rounded-xl">
          <IconButton
            className="!p-3 border-b border-seperator/10 dark:border-dark-seperator focus-visible:outline-none"
            icon={mapTypeIcon.icon}
            onClick={() => setIsOpenSearchModal(true)}
          />
          <IconButton
            className="!p-3"
            icon={
              searchedPosition ? (
                <Location />
              ) : position ? (
                <LocationFill />
              ) : (
                <LocationDenied />
              )
            }
            onClick={handleLocation}
          />
        </div>
      </div>

      <Transition
        appear
        show={true}
        as={Fragment}
        enter="transform transition ease-in-out duration-200"
        enterFrom="translate-y-full opacity-0"
        enterTo="translate-y-0 opacity-100"
        leave="transform transition ease-in-out duration-200"
        leaveFrom="translate-y-0 opacity-100"
        leaveTo="translate-y-full opacity-0"
      >
        <div
          className={`${
            showCancel && !openLocationModal ? "h-[95%]" : "h-auto"
          } lg:hidden fixed bottom-0 w-full sm:flex sm:flex-col sm:gap-5 bg-light-white dark:bg-secondary shadow-md rounded-t-2xl p-4 font-sans`}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex w-full relative items-center">
              <span className="absolute ml-2 pointer-events-none">
                <Search />
              </span>

              {searchValue.length ? (
                <span
                  className="absolute right-2 cursor-pointer"
                  onClick={() => {
                    setSearchValue("");
                    setShowCancel(false);
                  }}
                >
                  <CloseCircle input />
                </span>
              ) : null}

              <input
                type="text"
                placeholder="Search Maps"
                autoComplete="off"
                aria-label="Search Maps"
                className="flex w-full items-center bg-light-white-second dark:bg-light-grey placeholder-light-grey-third dark:placeholder-light-grey-second text-secondary font-sans tracking-tight dark:text-white text-lg leading-none p-2 pl-8 rounded-xl focus:outline-none"
                spellCheck="false"
                value={searchValue}
                onClick={() => {
                  setIsOpenSearchPanel(true);
                  setShowCancel(true);
                }}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>

            {showCancel ? (
              <span
                className="cursor-pointer text-lg text-blue"
                onClick={() => {
                  setIsOpenSearchPanel(false);
                  setShowCancel(false);
                  setSearchValue("");
                }}
              >
                {data.cancel}
              </span>
            ) : null}
          </div>

          {searchValue.length && !loading ? (
            <div>
              {searchResult?.map((place, index) => {
                return (
                  <div
                    key={index}
                    className="w-full border-b last:border-none border-seperator dark:border-dark-seperator"
                  >
                    <span
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSelectedItembyClick(place)}
                    >
                      <span>{getSearchedResultsTypeIcon(place.type)}</span>
                      <div className="flex flex-col p-2">
                        <span className="text-[1.063rem] leading-5 tracking-tight text-secondary dark:text-white">
                          {place?.name}
                        </span>
                        <span className="flex text-sm tracking-tight text-secondary dark:text-light-grey-second">
                          {place?.address?.state}&#44;&nbsp;
                          {place?.address?.country}
                        </span>
                      </div>
                    </span>
                  </div>
                );
              })}
            </div>
          ) : searchValue.length && loading ? (
            <Loader className="pb-40" />
          ) : null}

          {!searchValue.length && recents.length ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <div className="flex items-center justify-between p-0 pb-2.5">
                  <span className="text-base font-sansMedium tracking-tight text-light-grey-third dark:text-light-grey-second">
                    {data.recents}
                  </span>
                  {!showCancel && recents.length > 3 ? (
                    <span
                      className="text-base tracking-tight text-blue cursor-pointer"
                      onClick={() => {
                        setIsOpenSearchPanel(true);
                        setShowCancel(true);
                      }}
                    >
                      {data.more}
                    </span>
                  ) : null}

                  {showCancel ? (
                    <span
                      className="text-base tracking-tight text-blue cursor-pointer"
                      onClick={() => {
                        setIsOpenSearchPanel(false);
                        setShowCancel(false);
                        setRecents([]);
                      }}
                    >
                      {data.clear}
                    </span>
                  ) : null}
                </div>
                <div className="pl-3 bg-white dark:bg-grey rounded-lg">
                  {(showCancel ? recents : recents.slice(0, 3)).map(
                    (e, index) => (
                      <div
                        className="p-3 px-0 flex items-center border-b last:border-none border-seperator/10 dark:border-dark-seperator/40"
                        key={index}
                        onClick={() => handleRecentSelectedItembyClick(e)}
                      >
                        <Search />
                        <div className="flex items-center gap-1 pl-2">
                          <span className="text-[1.063rem] tracking-tight text-secondary dark:text-white">
                            {e?.name}
                          </span>
                          <span className="text-xs tracking-tight text-secondary dark:text-light-grey-second">
                            &#x2022;
                          </span>
                          <span className="text-[1.063rem] tracking-tight text-secondary dark:text-light-grey-second">
                            {e.country}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {isSearchEmpty && searchResult.length ? (
            <span className="min-h-screen flex items-center justify-center text-light-grey-third dark:text-light-grey-second text-base pb-40 rounded-lg">
              {data.noResult}
            </span>
          ) : null}
        </div>
      </Transition>

      <Transition appear show={isOpenSearchModal} as={Fragment}>
        <Dialog
          as="div"
          className="hidden sm:flex relative z-10"
          onClose={() => setIsOpenSearchModal(false)}
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
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transform transition ease-in-out duration-150"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
            <div className="fixed bottom-0 w-full flex flex-col bg-light-white dark:bg-primary shadow-md rounded-t-2xl">
              <div className="flex min-h-full items-center justify-center text-center">
                <Dialog.Panel className="w-full max-w-md flex flex-col transform overflow-hidden rounded-t-2xl bg-light-white dark:bg-secondary p-4 pb-6 gap-4 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-displayMedium text-2xl text-secondary dark:text-white">
                      {data.chooseMap}
                    </span>
                    <span
                      className="text-2xl text-secondary dark:text-white"
                      onClick={() => setIsOpenSearchModal(false)}
                    >
                      <CloseCircle />
                    </span>
                  </div>

                  <RadioGroup
                    by="id"
                    value={mapTypeLayer}
                    onChange={setMapTypeLayer}
                  >
                    <div className="grid grid-cols-2 items-center gap-4">
                      {mapTypes.map((items) => (
                        <RadioGroup.Option
                          key={items.id}
                          value={items}
                          className={({ active }) =>
                            `${active ? "border-2 border-dark-blue" : ""}
                  relative cursor-pointer select-none rounded-lg w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dark-blue active:bg-secondary`
                          }
                        >
                          <div className="flex flex-col w-full items-center justify-between">
                            <img
                              className="relative h-[4.5rem] w-full rounded-t-lg active:opacity-50"
                              src={items.img}
                            />
                            <span className="rounded-b-lg p-3 w-full truncate text-base bg-white dark:bg-[#414141] text-[1.063rem] text-secondary dark:text-white leading-none">
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
    </MapContainer>
  );
};

export default Maps;
