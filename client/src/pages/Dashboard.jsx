import Header from "../components/Header";
import "../styles/dashboard.css";
import cow from "../assets/cow.png";
import tick from "../assets/tick.png";
import exclamation from "../assets/exclamation.png";
import supplied from "../assets/supplied.png";
import collected from "../assets/collected.png";
import broken from "../assets/broken.png";
import person from "../assets/person.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import industry from "../assets/industry.png";
import L from "leaflet";
import axios from "axios";
import { useMap } from "react-leaflet";
import RouteImg from "../assets/RouteImg";

function Dashboard() {
  const [routes, setRoutes] = useState([]);
  const [data, setData] = useState([]);
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const mapRef = useRef();
  const colors = [
    "#008080", // Teal
    "#FFA500", // Orange
    "#800080", // Purple
    "#32CD32", // Lime Green
    "#00FFFF", // Cyan
    "#FF69B4", // Hot Pink
    "#FF7F50", // Coral
    "#1E90FF", // Dodger Blue
    "#DC143C", // Crimson Red
    "#FF00FF", // Magenta
    "#00FF00", // Lime Green
    "#87CEEB", // Sky Blue
    "#FA8072", // Salmon
    "#DAA520", // Goldenrod
    "#6A5ACD", // Slate Blue
    "#40E0D0", // Turquoise
    "#DC143C", // Crimson
    "#4169E1", // Royal Blue
    "#6B8E23", // Olive Drab
    "#BA55D3", // Medium Orchid
  ];
  const getCustomerIconSVG = (route_id) => {
    const color = colors[(route_id - 1) % colors.length];

    return `<svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="16" fill="${color}"/>
    </svg>`;
  };

  // eslint-disable-next-line react/prop-types
  const MapWithRouting = ({ routeCoordinates, routeColor }) => {
    const map = useMap();

    useEffect(() => {
      if (routeCoordinates) {
        const routingControl = L.Routing.control({
          // eslint-disable-next-line react/prop-types
          waypoints: routeCoordinates.map((coords) => L.latLng(coords)),
          routeWhileDragging: true,
          show: false,
          routePopup: false,
          collapsible: false,
          addWaypoints: false,
          showAlternatives: false,
          lineOptions: {
            styles: [{ color: routeColor, weight: 2.5, opacity: 0.7 }],
          },
          createMarker: () => null,
        }).addTo(map);
        return () => {
          map.removeControl(routingControl);
        };
      }
      return null;
    }, [map, routeCoordinates, routeColor]);

    return null;
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/route/")
      .then((res) => {
        console.log(res);
        setRoutes(res.data);
      })
      .catch((err) => {
        console.log("Error in getRoutes API request:", err);
      });
    axios
      .get("http://localhost:8000/api/deliverymen/")
      .then((res) => {
        console.log(res.data);
        const deliverymen = res.data;
        setDeliveryDetails(deliverymen);
      })
      .catch((err) => {
        console.log("Error in getAllDeliveryMen : ", err);
      });
  }, []);

  const createCustomerIcon = (route_id) => {
    const svgString = getCustomerIconSVG(route_id);
    const svgDataUrl = "data:image/svg+xml;base64," + btoa(svgString);
    return L.icon({
      iconUrl: svgDataUrl,
      iconSize: [8, 8],
      iconAnchor: [4, 8],
      popupAnchor: [0, -8],
    });
  };
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const bounds = L.latLngBounds(
        deliveryDetails.map((detail) => detail.coordinates)
      );
      map.fitBounds(bounds);
    }
  }, [deliveryDetails]);

  const customIcon = L.icon({
    iconUrl: industry,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  return (
    <section className="Dashboard">
      <Header />
      <section className="Dashboard-container">
        <div className="Dashboard-left">
          <div className="Dashboard-left-top">
            <div className="Dashboard-left-top-element">
              <div className="Dashboard-left-top-element-content">
                <div
                  className="Dashboard-left-top-element-content-img"
                  style={{ backgroundImage: `url(${cow})` }}
                ></div>
                <div className="Dashboard-left-top-element-content-text">
                  1230 L
                </div>
              </div>
              <div className="Dashboard-left-top-element-label">
                MILK COLLECTED
              </div>
            </div>
            <div className="Dashboard-left-top-element">
              <div className="Dashboard-left-top-element-content">
                <div
                  className="Dashboard-left-top-element-content-img"
                  style={{ backgroundImage: `url(${tick})` }}
                ></div>
                <div className="Dashboard-left-top-element-content-text">
                  500
                </div>
              </div>
              <div className="Dashboard-left-top-element-label">
                CUSTOMERS DELIVERED
              </div>
            </div>
            <div className="Dashboard-left-top-element">
              <div className="Dashboard-left-top-element-content">
                <div
                  className="Dashboard-left-top-element-content-img"
                  style={{ backgroundImage: `url(${exclamation})` }}
                ></div>
                <div className="Dashboard-left-top-element-content-text">
                  730
                </div>
              </div>
              <div className="Dashboard-left-top-element-label">
                CUSTOMERS REMAINING
              </div>
            </div>
          </div>
          <div className="Dashboard-left-bottom">
            <div className="Dashboard-left-bottom-left">
              <div className="Dashboard-left-bottom-left-top">
                <div className="Dashboard-left-bottom-left-top-bottles">
                  <div className="Dashboard-left-bottom-left-top-bottles-heading">
                    BOTTLES
                  </div>
                  <div className="Dashboard-left-bottom-left-top-bottles-element-container">
                    <div className="Dashboard-left-bottom-left-top-bottles-element">
                      <div className="Dashboard-left-bottom-left-top-bottles-element-label">
                        <div
                          className="Dashboard-left-bottom-left-top-bottles-element-label-img"
                          style={{ backgroundImage: `url(${supplied})` }}
                        ></div>
                        <div className="Dashboard-left-bottom-left-top-bottles-element-label-text">
                          supplied
                        </div>
                      </div>
                      <div className="Dashboard-left-bottom-left-top-bottles-element-value">
                        <span>1200</span>
                      </div>
                    </div>
                    <div className="Dashboard-left-bottom-left-top-bottles-element">
                      <div className="Dashboard-left-bottom-left-top-bottles-element-label">
                        <div
                          className="Dashboard-left-bottom-left-top-bottles-element-label-img"
                          style={{ backgroundImage: `url(${collected})` }}
                        ></div>
                        <div className="Dashboard-left-bottom-left-top-bottles-element-label-text">
                          collected
                        </div>
                      </div>
                      <div className="Dashboard-left-bottom-left-top-bottles-element-value">
                        <span>500</span>
                      </div>
                    </div>
                    <div className="Dashboard-left-bottom-left-top-bottles-element">
                      <div className="Dashboard-left-bottom-left-top-bottles-element-label">
                        <div
                          className="Dashboard-left-bottom-left-top-bottles-element-label-img"
                          style={{ backgroundImage: `url(${broken})` }}
                        ></div>
                        <div className="Dashboard-left-bottom-left-top-bottles-element-label-text">
                          damaged
                        </div>
                      </div>
                      <div className="Dashboard-left-bottom-left-top-bottles-element-value">
                        <span>4</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="Dashboard-left-bottom-left-top-topRoutes">
                  <div className="Dashboard-left-bottom-left-top-topRoutes-heading">
                    TOP ROUTES
                  </div>
                  <div className="Dashboard-left-bottom-left-top-topRoutes-element-container">
                    <div className="Dashboard-left-bottom-left-top-topRoutes-element">
                      <div>1</div>
                      <div>:</div>Route 1
                    </div>
                    <div className="Dashboard-left-bottom-left-top-topRoutes-element">
                      <div>2</div>
                      <div>:</div>Route 2
                    </div>
                    <div className="Dashboard-left-bottom-left-top-topRoutes-element">
                      <div>3</div>
                      <div>:</div>Route 3
                    </div>
                  </div>
                </div>
              </div>
              <div className="Dashboard-left-bottom-left-profile">
                <div className="Dashboard-left-bottom-left-profile-innerContainer">
                  <div className="Dashboard-left-bottom-left-profile-innerContainer-details">
                    <div className="Dashboard-left-bottom-left-profile-innerContainer-details-name">
                      Barath Sakthi
                    </div>
                    <div className="Dashboard-left-bottom-left-profile-innerContainer-logout">
                      Logout
                    </div>
                  </div>
                  <div className="Dashboard-left-bottom-left-profile-innerContainer-img"></div>
                </div>
              </div>
            </div>
            <div className="Dashboard-left-bottom-right">
              <div className="Dashboard-left-bottom-right-heading">
                <div className="Dashboard-left-bottom-right-heading-img"></div>
                <div className="Dashboard-left-bottom-right-heading-text">
                  DELIVERY DETAILS
                </div>
              </div>
              <div className="Dashboard-left-bottom-right-overview">
                <div className="Dashboard-left-bottom-right-overview-element">
                  <div className="Dashboard-left-bottom-right-overview-element-value">
                    <div
                      className="Dashboard-left-bottom-right-overview-element-value-img"
                      style={{ backgroundImage: `url(${person})` }}
                    ></div>
                    <div className="Dashboard-left-bottom-right-overview-element-value-text">
                      6/13
                    </div>
                  </div>
                  <div className="Dashboard-left-bottom-right-overview-element-label">
                    Active Members
                  </div>
                </div>
                <div className="Dashboard-left-bottom-right-overview-element">
                  <div className="Dashboard-left-bottom-right-overview-element-value">
                    <div
                      className="Dashboard-left-bottom-right-overview-element-value-img"
                      style={{ backgroundImage: `url(${tick})` }}
                    ></div>
                    <div className="Dashboard-left-bottom-right-overview-element-value-text">
                      3
                    </div>
                  </div>
                  <div className="Dashboard-left-bottom-right-overview-element-label">
                    Completed
                  </div>
                </div>
              </div>
              <div className="Dashboard-left-bottom-right-table">
                <div className="table-responsive">
                  <table className="delivery-details-table">
                    <thead className="delivery-details-table-head">
                      <tr>
                        <th className="delivery-details-table-No">No</th>
                        <th className="delivery-details-table-status">
                          Status
                        </th>
                        <th className="delivery-details-table-Name">Name</th>
                        <th className="delivery-details-table-route">Route</th>
                        <th className="delivery-details-table-1/2">1/2</th>
                        <th className="delivery-details-table-1">1</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryDetails.map((detail, index) => (
                        <tr key={index}>
                          <td className="delivery-details-table-No">
                            {index + 1}
                          </td>
                          <td className="delivery-details-table-status">
                            <div
                              className="delivery-details-table-status-circle"
                              style={{
                                backgroundColor:
                                  detail.status === "assigned"
                                    ? "green"
                                    : detail.status === "on_leave"
                                    ? "red"
                                    : "orange",
                              }}
                            ></div>
                          </td>
                          <td className="delivery-details-table-Name">
                            {detail.name || "no data"}
                          </td>
                          <td className="delivery-details-table-route">
                            {detail.status === "assigned" ? routes.find((route) => {   
                                const temp = route.driver && route.driver._id === detail._id;
                                console.log(temp)
                            }) : "-"}
                          </td>
                          <td className="delivery-details-table-1-2">
                            {detail.full || 0}
                          </td>
                          <td className="delivery-details-table-1">
                            {detail.supplied || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Dashboard-right">
          <div className="Dashboard-right-mapContainer">
            <MapContainer
              center={[13.054398115031136, 80.26375998957623]}
              zoom={13}
              className="Dashboard-right-mapContainer-map"
              zoomControl={false}
            >
              <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                attribution="&copy; <a href='https://www.stadiamaps.com/' target='_blank'>Stadia Maps</a> &copy; <a href='https://openmaptiles.org/' target='_blank'>OpenMapTiles</a> &copy; <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a> contributors"
              />
              <Marker
                position={[13.054398115031136, 80.26375998957623]}
                icon={customIcon}
              >
                <Popup>ART Milk Company</Popup>
              </Marker>
              {data.map((route) => {
                const routeCoordinates = [
                  [13.054398115031136, 80.26375998957623],
                ];

                route.customers.forEach((customer) => {
                  const coordinates = customer.coordinates;
                  routeCoordinates.push([coordinates[1], coordinates[0]]);
                });

                const routeColor = colors[(route.route_id - 1) % colors.length];

                return (
                  <>
                    <MapWithRouting
                      key={route.route_id}
                      routeCoordinates={routeCoordinates}
                      routeColor={routeColor}
                    />
                    {route.customers.map((customer) => {
                      const coordinates = customer.coordinates;
                      return (
                        <Marker
                          key={customer.customer_id}
                          position={[coordinates[1], coordinates[0]]}
                          icon={createCustomerIcon(route.route_id)}
                        >
                          <Popup>Customer ID: {customer.customer_id}</Popup>
                        </Marker>
                      );
                    })}
                  </>
                );
              })}
            </MapContainer>
          </div>

          <div className="Dashboard-right-routes">
            <div className="Dashboard-right-routes-heading">
              <div className="Dashboard-right-routes-heading-img"></div>
              <div className="Dashboard-right-routes-heading-text">ROUTES</div>
            </div>
            <div className="Dashboard-right-routes-content">
              <div className="Dashboard-right-routes-content">
                {deliveryDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="Dashboard-right-routes-content-item"
                  >
                    <RouteImg route_id={index} colors={colors} />
                    <div className="Dashboard-right-routes-content-item-route">
                      {detail.to}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Dashboard;
