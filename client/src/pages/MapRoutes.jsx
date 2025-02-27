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

const apiKey = "55e8c4aa-6a8e-4ac8-b886-ac98649ed892";
export default function MapRoutes() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [deliveryMan, setDeliveryMan] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState({});
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedRouteData, setUpdatedRouteData] = useState(null);
  const [openmodel, setopenmodel] = useState(false);
  const [bottlecount, setbottlecount] = useState();
  const [newRoute, setNewRoute] = useState(false)
  const [routeName, setRouteName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [distance, setDistance] = useState("");
  const [defaultAmount, setDefaultAmount] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/route/")
      .then((res) => {
        setData(res.data);
        setFilteredData(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log("Error in getRoutes API request:", err));

    axios
      .get("http://localhost:8000/api/deliverymen")
      .then((res) => {
        setDeliveryMan(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log("Error in getDeliveryDetails " + err));
  }, []);
  const handlebottlecountchange = (e) => {
    setbottlecount(e.target.value);
  };
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
  const [currentrouteid, setcurrentrouteid] = useState(null);
  const[currentdeliverymenid,setdeliverymenid]=useState(null);
  const handleAssignDeliveryMan = (routeId, deliveryManId) => {
    setopenmodel(true);
    setcurrentrouteid(routeId);
    setdeliverymenid(deliveryManId)
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
  };

  const submitbottlemodel = async () => {
    console.log(bottlecount)
    const response=await axios.post("http://localhost:8000/api/bottle/create",{route_objid:currentrouteid,totalBottles:bottlecount,driver_objid:currentdeliverymenid});
    console.log(response.data);
    closebottlemodel(false);
    window.location.reload();
  };
  const closebottlemodel = () => {
    setopenmodel(false);
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
  const handleEditClick = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setUpdatedRouteData({
        route_name: selectedRoute.route_name,
        status: selectedRoute.driver ? "Assigned" : "Not Assigned",
        route_id: selectedRoute.route_id,
        distance: selectedRoute.distance,
        phone: "1234567890",
        latitude: selectedRoute.location.latitude,
        longitude: selectedRoute.location.longitude,
      });
    }
  };

  const handleFieldChange = (field, value) => {
    setUpdatedRouteData((prevState) => ({ ...prevState, [field]: value }));
  };
  const handleSubmitChanges = () => {
    axios
      .post("http://localhost:8000/", updatedRouteData)
      .then((res) => {
        console.log("Data updated successfully:", res.data);
        setEditMode(false);
      })
      .catch((err) => console.error("Error updating data:", err));
  };
  const artMilkCompanyPosition = [13.054398115031136, 80.26375998957623];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const routeData = {
      route_name: routeName,
      customers: [],
      drivers: null,
      distance: parseFloat(distance),
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      defaultAmount: parseFloat(defaultAmount),
    };

    try {
      const response = await axios.post("http://localhost:8000/api/route/", routeData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Route added successfully:", response.data);
      alert("Route added successfully!");
    } catch (error) {
      console.error("Error adding route:", error);
      alert("Failed to add route.");
    }
  };


  return (
    <section className="mapRoutes-container">
      <Header />
      <section className="mapRoutes-content">
        {selectedRoute ? (
          <div className="mapRoutes-content-routeDetails">
            <div className="mapRoutes-content-routeDetails-Container">
              <div className="mapRoutes-content-routeDetails-Container-header">
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="mapRoutes-content-routeDetails-Container-Backbutton"
                ></button>
                <div className="mapRoutes-content-routeDetails-Container-header-title">
                  {editMode ? (
                    <input
                      type="text"
                      value={updatedRouteData.route_name}
                      onChange={(e) =>
                        handleFieldChange("route_name", e.target.value)
                      }
                      placeholder="Enter Route Name"
                    />
                  ) : (
                    selectedRoute.route_name.toUpperCase()
                  )}
                </div>
              </div>
              <section className="mapRoutes-content-routeDetails-Container-content">
                <div
                  className="mapRoutes-content-routeDetatils-Container-content-editButton"
                  onClick={handleEditClick}
                ></div>
                <section>
                  <span>STATUS : </span>

                  <div
                    style={{ color: selectedRoute.driver ? "green" : "orange" }}
                  >
                    {selectedRoute.driver ? "Assigned" : "Not Assigned"}
                  </div>
                </section>
                <section>
                  <span>ROUTE ID : </span>
                  {editMode ? (
                    <input
                      type="text"
                      value={updatedRouteData.route_id}
                      onChange={(e) =>
                        handleFieldChange("route_id", e.target.value)
                      }
                    />
                  ) : (
                    <div>{selectedRoute.route_id}</div>
                  )}
                </section>
                <section>
                  <span>DISTANCE : </span>
                  {editMode ? (
                    <input
                      type="number"
                      value={updatedRouteData.distance}
                      onChange={(e) =>
                        handleFieldChange("distance", e.target.value)
                      }
                    />
                  ) : (
                    <div>{selectedRoute.distance} km</div>
                  )}
                </section>
                <section>
                  <span>ROUTE PHONE NUMBER : </span>
                  {editMode ? (
                    <input
                      type="text"
                      value={updatedRouteData.phone}
                      onChange={(e) =>
                        handleFieldChange("phone", e.target.value)
                      }
                    />
                  ) : (
                    <div>1234567890</div>
                  )}
                </section>
                <section>
                  <span>COORDINATES : </span>
                  {editMode ? (
                    <div>
                      <input
                        type="number"
                        value={updatedRouteData.latitude}
                        onChange={(e) =>
                          handleFieldChange("latitude", e.target.value)
                        }
                        placeholder="Latitude"
                      />
                      <input
                        type="number"
                        value={updatedRouteData.longitude}
                        onChange={(e) =>
                          handleFieldChange("longitude", e.target.value)
                        }
                        placeholder="Longitude"
                      />
                    </div>
                  ) : (
                    <div>
                      {selectedRoute.location.latitude} °N,{" "}
                      {selectedRoute.location.longitude} °E
                    </div>
                  )}
                </section>
              </section>
              {editMode && (
                <button
                  className="mapRoutes-content-routeDetatils-Container-content-submitButton"
                  onClick={handleSubmitChanges}
                >
                  Make Changes
                </button>
              )}

              {selectedRoute.driver === null ? null : (
                <div className="mapRoutes-content-routeDetails-driverContainer">
                  <header>DRIVER DETAILS</header>
                  <section>
                    <span>Name :</span>
                    <div>{selectedRoute.driver.name}</div>
                  </section>
                  <section>
                    <span>Primary Phone Number :</span>
                    <div>{selectedRoute.driver.phone}</div>
                  </section>
                  <section>
                    <span>Secondary Phone Number :</span>
                    <div>1234567890</div>
                  </section>
                  <section>
                    <span>Address :</span>
                    <div>{selectedRoute.driver.address}</div>
                  </section>
                  <section>
                    <span>Category :</span>
                    <div>{selectedRoute.driver.category}</div>
                  </section>
                </div>
              )}
              <div className="mapRoutes-content-routeDetails-historyContainer">
                <header>DELIVERY HISTORY</header>
                {selectedRoute.delivery_history &&
                selectedRoute.delivery_history.length > 0 ? (
                  <table className="delivery-history-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Date</th>
                        <th>Driver Name</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRoute.delivery_history.map((history, index) => {
                        const driverDetails = deliveryMan.find(
                          (man) => man._id === history.driver
                        );
                        return (
                          <tr key={history._id}>
                            <td>{index + 1}</td>
                            <td>
                              {new Date(history.assigned_at).toLocaleString()}
                            </td>
                            <td>
                              {driverDetails ? driverDetails.name : "Unknown"}
                            </td>
                            <td>
                              {driverDetails ? driverDetails.phone : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p>No delivery history available</p>
                )}
              </div>
            </div>
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
                url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${apiKey}`}
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                minZoom={0}
                maxZoom={20}
              />
              <Marker position={artMilkCompanyPosition} icon={customIcon}>
                <Popup>ART Milk Company</Popup>
              </Marker>

              {filteredData.map((route) => {
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
              <button onClick={() => setNewRoute(!newRoute)} style={{ backgroundColor: newRoute ? "red" : "#333" }}>{newRoute ? "x" : "+"}</button>
            </div>
          </div>
          {
            newRoute ?
              <div className="mapRoutes-content-details-bottom-newRoute-container">
                <div className="mapRoutes-content-details-bottom-newRoute-container-heading">
                  Add New Route
                </div>
                <form className="mapRoutes-content-details-bottom-newRoute-container-form" onSubmit={handleSubmit}>
                  <div className="mapRoutes-content-details-bottom-newRoute-container-form-input-container">
                    <div>Route Name</div>
                    <input type="text" value={routeName} onChange={(e) => setRouteName(e.target.value)} required />
                  </div>
                  <div className="mapRoutes-content-details-bottom-newRoute-container-form-input-container">
                    <div>Coordinates</div>
                    <input type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
                    <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
                  </div>
                  <div className="mapRoutes-content-details-bottom-newRoute-container-form-input-container">
                    <div>Distance</div>
                    <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} required />
                  </div>
                  <div className="mapRoutes-content-details-bottom-newRoute-container-form-input-container">
                    <div>Default Amount</div>
                    <input type="number" value={defaultAmount} onChange={(e) => setDefaultAmount(e.target.value)} required />
                  </div>
                  <button type="submit">Add Route</button>
                </form>
              </div> :
              <div className="mapRoutes-content-details-bottom">
                {filteredData.length > 0 ? (
                  filteredData.map((route) => {
                    const assignedAvailableDeliveryMen = deliveryMan.filter(
                      (man) =>
                        man.routes.some((r) => r.id === route.route_id) && // Match route_id correctly
                        man.status === "available"
                    );
                    const allDeliveryMan = deliveryMan.filter(
                      (man) =>
                        man.routes.some((r) => r.id === route.route_id) &&
                        (man.status === "available" || "assigned")
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
                                  ) : allDeliveryMan.length > 0 ? (
                                    allDeliveryMan.map((man) => (
                                      <option
                                        key={man._id}
                                        value={man._id}
                                        style={{ color: "orange" }}
                                      >
                                        {man.name} ({man.phone})
                                      </option>
                                    ))
                                  ) : (
                                    <option key="" disabled>
                                      No Delivery man available
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
                              {route.driver?.name || "No Driver Assigned"} ({route.driver?.phone || "No Phone"})

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
          }
        </div>
        {openmodel && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Popup Modal</h2>
              <div className="contents">
                <label htmlFor="">Enter bottle count</label>{" "}
                <input
                  type="number"
                  value={bottlecount}
                  onChange={handlebottlecountchange}
                  placeholder="enter bottles count"
                />
              </div>
              <button
                onClick={() => submitbottlemodel()}
                className="submit-btn"
              >
                Submit
              </button>
              <button onClick={() => closebottlemodel()} className="close-btn">
                Close
              </button>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
