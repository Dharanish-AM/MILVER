import Header from "../components/Header";
import "../styles/mapRoutes.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  Tooltip,
} from "react-leaflet";
import axios from "axios";
import { useEffect, useState } from "react";
import L from "leaflet";
import industry from "../assets/industry.png";
import React from "react";

const getRouteIcon = (driver) => {
  const color = driver === null ? "orange" : "green";
  return `<svg width="100" height="207" viewBox="0 0 100 207" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" 
                d="M100 50C100 56.1758 98.8804 62.0898 96.833 67.5505L51.0002 207L5.47681 72.7756C1.97559 65.9451 0 58.2034 0 50C0 22.3857 22.3857 0 50 0C77.6143 0 100 22.3857 100 50ZM50 66C59.9412 66 68 57.9412 68 48C68 38.0588 59.9412 30 50 30C40.0588 30 32 38.0588 32 48C32 57.9412 40.0588 66 50 66Z" 
                fill="${color}"/>
            </svg>`;
};

export default function MapRoutes() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [deliveryMan, setDeliveryMan] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState({});
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/route/")
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);
      })
      .catch((err) => console.log("Error in getRoutes API request:", err));

    axios
      .get("http://localhost:8000/api/deliverymen")
      .then((res) => {
        setDeliveryMan(res.data);
      })
      .catch((err) => console.log("Error in getDeliveryDetails " + err));
  }, []);

  const handleFilterChange = (val) => {
    const filterValue = val.target.value;
    setFilter(filterValue);

    if (filterValue === "assigned") {
      setFilteredData(data.filter((route) => route.driver !== null));
    } else if (filterValue === "notAssigned") {
      setFilteredData(data.filter((route) => route.driver === null));
    } else {
      setFilteredData(data);  
    }
  };

  const handleSearchChange = (val) => {
    const searchValue = val.target.value.toLowerCase();
    setSearch(searchValue);

    const searchFiltered = data.filter((route) =>
      route.route_name.toLowerCase().includes(searchValue)
    );
    setFilteredData(
      filter === "assigned"
        ? searchFiltered.filter((route) => route.driver !== null)
        : filter === "notAssigned"
        ? searchFiltered.filter((route) => route.driver === null)
        : searchFiltered
    );
  };
  const handleSelectDeliveryMan = (routeId, deliveryManId) => {
    setSelectedDeliveryMan((prevState) => ({
      ...prevState,
      [routeId]: deliveryManId,
    }));
  };

  const handleAssignDeliveryMan = (routeId, deliveryManId) => {
    const payload = {
      driver_objid: deliveryManId,
      route_objid: routeId,
    };

    axios
      .post("http://localhost:8000/api/route/assigndeliverymenmanual", payload)
      .then((res) => {
        console.log("Delivery man assigned successfully:", res.data);

        setData((prevData) =>
          prevData.map((route) =>
            route._id === routeId
              ? { ...route, driver: res.data.driver }
              : route
          )
        );
        setFilteredData((prevFilteredData) =>
          prevFilteredData.map((route) =>
            route._id === routeId
              ? { ...route, driver: res.data.driver }
              : route
          )
        );
      })
      .catch((err) => console.error("Error assigning delivery man:", err));
    window.location.reload();
  };

  const customIcon = L.icon({
    iconUrl: industry,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const createRouteIcon = (driver) => {
    const svgString = getRouteIcon(driver);
    const svgDataUrl = "data:image/svg+xml;base64," + btoa(svgString);
    return L.icon({
      iconUrl: svgDataUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };
  const handleRouteInfoClick = (route) => {
    setSelectedRoute(route);
  };

  const artMilkCompanyPosition = [13.054398115031136, 80.26375998957623];

  return (
    <section className="mapRoutes-container">
      <Header />
      <section className="mapRoutes-content">
        {selectedRoute ? (
          <div className="mapRoutes-content-routeDetails">
            <button onClick={() => setSelectedRoute(null)}>Back to Map</button>
            <h2>Route Details</h2>
            <p>
              <strong>Route ID:</strong> {selectedRoute.route_id}
            </p>
            <p>
              <strong>Route Name:</strong> {selectedRoute.route_name}
            </p>
            <p>
              <strong>Distance:</strong> {selectedRoute.distance} km
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedRoute.driver ? (
                <span style={{ color: "green" }}>
                  Assigned to {selectedRoute.driver.name}
                </span>
              ) : (
                <span style={{ color: "orange" }}>Not Assigned</span>
              )}
            </p>
          </div>
        ) : (
          <div className="mapRoutes-content-mapContainer">
            <MapContainer
              center={[
                artMilkCompanyPosition[0],
                artMilkCompanyPosition[1] - 0.02,
              ]}
              zoom={14}
              className="mapRoutes-content-map"
            >
              <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                minZoom={0}
                maxZoom={20}
              />
              <Marker position={artMilkCompanyPosition} icon={customIcon}>
                <Popup>ART Milk Company</Popup>
              </Marker>

              {filteredData.map((route, index) => {
                const routePosition = [
                  route.location.latitude,
                  route.location.longitude,
                ];
                return (
                  <React.Fragment key={route._id}>
                    <Polyline
                      positions={[artMilkCompanyPosition, routePosition]}
                      color={route.driver === null ? "orange" : "green"}
                    />
                    <Marker
                      position={routePosition}
                      icon={createRouteIcon(route.driver)}
                    >
                      <Tooltip className="small-tooltip" permanent>
                        <strong>{route.route_name}</strong>
                        <br />
                        Distance: {route.distance} km
                      </Tooltip>
                    </Marker>
                  </React.Fragment>
                );
              })}
            </MapContainer>
          </div>
        )}
        <div className="mapRoutes-content-details">
          <div className="mapRoutes-content-details-top">
            <div className="mapRoutes-content-details-top-search">
              <div className="mapRoutes-content-details-top-search-container">
                <div className="mapRoutes-content-details-top-search-container-img"></div>
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  className="mapRoutes-content-details-top-search-container-input"
                  placeholder="search ..."
                ></input>
              </div>
            </div>
            <div className="mapRoutes-content-details-top-filter">
              <select value={filter} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="assigned">Assigned</option>
                <option value="notAssigned">Not Assigned</option>
              </select>
            </div>
            <div className="mapRoutes-content-details-top-add">
              <button>+</button>
            </div>
          </div>
          <div className="mapRoutes-content-details-bottom">
            {filteredData.length > 0 ? (
              filteredData.map((route) => {
                const assignedAvailableDeliveryMen = deliveryMan.filter(
                  (man) =>
                    man.routes.includes(route._id) && man.status === "available"
                );

                return (
                  <div
                    key={route._id}
                    className="mapRoutes-content-details-bottom-container"
                  >
                    <div className="mapRoutes-content-details-bottom-left">
                      <div className="mapRoutes-content-details-bottom-left-status-container">
                        <span>Status : </span>
                        {route.driver === null ? (
                          <div style={{ color: "orange", fontWeight: 650 }}>
                            {" "}
                            Not Assigned{" "}
                          </div>
                        ) : (
                          <div style={{ color: "green", fontWeight: 650 }}>
                            {" "}
                            Assigned{" "}
                          </div>
                        )}
                      </div>
                      <div className="mapRoutes-content-details-bottom-left-routeid">
                        <span>Route ID : </span>
                        <div> {route.route_id}</div>
                      </div>
                      <div className="mapRoutes-content-details-bottom-left-routename">
                        <span>Route name : </span>
                        <div>{route.route_name}</div>
                      </div>
                      <div className="mapRoutes-content-details-bottom-left-distance">
                        <span>Distance : </span>
                        <div>{route.distance}</div>
                      </div>
                    </div>
                    <div className="mapRoutes-content-details-bottom-right">
                      {route.driver === null ? (
                        <>
                          <div className="mapRoutes-content-details-bottom-right-list">
                            <select
                              value={selectedDeliveryMan[route._id] || ""}
                              onChange={(e) =>
                                handleSelectDeliveryMan(
                                  route._id,
                                  e.target.value
                                )
                              }
                            >
                              <option value="" disabled>
                                Select Delivery Man
                              </option>
                              {assignedAvailableDeliveryMen.length > 0 ? (
                                assignedAvailableDeliveryMen.map((man) => (
                                  <option key={man._id} value={man._id}>
                                    {man.name} ({man.phone})
                                  </option>
                                ))
                              ) : (
                                <option value="" disabled>
                                  No available delivery men assigned
                                </option>
                              )}
                            </select>
                          </div>

                          <button
                            className="mapRoutes-content-details-bottom-right-button"
                            onClick={() => {
                              if (selectedDeliveryMan[route._id]) {
                                handleAssignDeliveryMan(
                                  route._id,
                                  selectedDeliveryMan[route._id]
                                );
                              }
                            }}
                          >
                            Assign
                          </button>
                        </>
                      ) : (
                        <div className="mapRoutes-content-details-bottom-right-Assigned">
                          <span>Assigned Delivery Man: </span>
                          <div>
                            {route.driver.name} ({route.driver.phone})
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className="mapRoutes-content-details-bottom-info"
                      onClick={() => handleRouteInfoClick(route)}
                    ></div>
                  </div>
                );
              })
            ) : (
              <p>No routes available</p>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
