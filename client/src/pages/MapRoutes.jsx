import Header from "../components/Header";
import "../styles/mapRoutes.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import axios from "axios";
import { useEffect, useState } from "react";
import L from "leaflet";
import industry from "../assets/industry.png";
import "leaflet-routing-machine";
import React from "react";

const colors = [
  "#008080",
  "#FFA500",
  "#800080",
  "#32CD32",
  "#00FFFF",
  "#FF69B4",
  "#FF7F50",
  "#1E90FF",
  "#DC143C",
  "#FF00FF",
  "#00FF00",
  "#87CEEB",
  "#FA8072",
  "#DAA520",
  "#6A5ACD",
  "#40E0D0",
  "#DC143C",
  "#4169E1",
  "#6B8E23",
  "#BA55D3",
];

const getCustomerIconSVG = (route_id) => {
  const color = colors[(route_id - 1) % colors.length];
  return `<svg width="100" height="207" viewBox="0 0 100 207" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" 
                d="M100 50C100 56.1758 98.8804 62.0898 96.833 67.5505L51.0002 207L5.47681 72.7756C1.97559 65.9451 0 58.2034 0 50C0 22.3857 22.3857 0 50 0C77.6143 0 100 22.3857 100 50ZM50 66C59.9412 66 68 57.9412 68 48C68 38.0588 59.9412 30 50 30C40.0588 30 32 38.0588 32 48C32 57.9412 40.0588 66 50 66Z" 
                fill="${color}"/>
            </svg>`;
};

// eslint-disable-next-line react/prop-types
const MapWithRouting = ({ routeCoordinates, routeColor }) => {
  const map = useMap();
  

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    if (!map || !routeCoordinates || routeCoordinates.length < 2) return;

    // eslint-disable-next-line react/prop-types
    const waypoints = routeCoordinates.map((coords) => L.latLng(coords));
    const fetchRoute = async () => {
      const response = await axios.post(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          coordinates: waypoints.map((wp) => [wp.lng, wp.lat]),
        }
      );

      const routeGeoJson = response.data.routes[0].geometry;

      if (map) {
        const routingControl = L.Routing.control({
          waypoints,
          router: L.Routing.osrmv1({
            geojson: routeGeoJson,
          }),
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

        return routingControl;
      }
    };

    fetchRoute();

    return () => {

      if (map) {
        map.eachLayer((layer) => {
          if (layer instanceof L.Routing.Control) {
            map.removeLayer(layer);
          }
        });
      }
    };
  }, [map, routeCoordinates, routeColor]);

  return null;
};

export default function MapRoutes() {
  const [data, setData] = useState([]);
  const [deliveryMan, setDeliveryMan] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/route/")
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => {
        console.log("Error in getRoutes API request:", err);
      });
    axios
      .get("http://localhost:8000/api/deliverymen")
      .then((res) => {
        console.log(res.data);
        setDeliveryMan(res.data);
      })
      .catch((err) => console.log("Error in getDeliveryDetails " + err));
    // axios.get("http://localhost:8000/api/route/shuffle").then((res) => {
    //   console.log(res);
    // });
  }, []);

  const customIcon = L.icon({
    iconUrl: industry,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const createCustomerIcon = (route_id) => {
    const svgString = getCustomerIconSVG(route_id);
    const svgDataUrl = "data:image/svg+xml;base64," + btoa(svgString);
    return L.icon({
      iconUrl: svgDataUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  return (
    <section className="mapRoutes-container">
      <Header />
      <section className="mapRoutes-content">
        <div className="mapRoutes-content-mapContainer">
          {/* <MapContainer
            center={[13.054398115031136, 80.26375998957623]}
            zoom={12}
            className="mapRoutes-content-map"
          >
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              minZoom={0}
              maxZoom={20}
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
              const hasValidCoordinates = routeCoordinates.length > 1;

              return (
                <React.Fragment key={route.route_id}>
                  {hasValidCoordinates && (
                    <MapWithRouting
                      routeCoordinates={routeCoordinates}
                      routeColor={routeColor}
                    />
                  )}
                  {route.customers.map((customer) => {
                    const coordinates = customer.coordinates;
                    console.log(customer);
                    return (
                      <Marker
                        key={`customer-${customer.customer_id}`}
                        position={[coordinates[1], coordinates[0]]}
                        icon={createCustomerIcon(route.route_id)}
                      >
                        <Popup>
                          Customer ID: {customer.customer_id} <br />
                          Name: {customer.name} <br />
                          Address: {customer.address} <br />
                          Phone: {customer.phone} <br />
                          Coordinates:{" "}
                          {`${customer.coordinates[0]} , ${customer.coordinates[1]}`}{" "}
                          <br />
                          <a
                            href={`https://www.google.com/maps?q=${customer.coordinates[1]},${customer.coordinates[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open in Google Maps
                          </a>
                        </Popup>
                      </Marker>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </MapContainer> */}
        </div>
        <div className="mapRoutes-content-details">
          <div className="mapRoutes-content-details-top">
            <div className="mapRoutes-content-details-top-search"></div>
            <div className="mapRoutes-content-details-top-filter"></div>
          </div>
          <div className="mapRoutes-content-details-bottom">
            {deliveryMan.map((man) => {
              // Get today's date in ISO format (without time)
              const today = new Date().toISOString().split("T")[0];

              // Filter routes for the dropdown
              const routeNames = man.routes
                .map((routeId) => {
                  const route = data.find((r) => r._id === routeId);

                  // Check if today's date exists in the delivery history
                  const hasToday = route?.delivery_history.some((history) => {
                    const deliveryDate = new Date(history)
                      .toISOString()
                      .split("T")[0];
                    return deliveryDate === today;
                  });

                  return !hasToday && route ? route.route_name : null; // Exclude if today's date exists
                })
                .filter((routeName) => routeName !== null); // Remove null values

              return (
                <div key={man._id} className="deliveryman-details-card">
                  <p>
                    <strong>Driver ID:</strong> {man.driver_id}
                  </p>
                  <p>
                    <strong>Name:</strong> {man.name}
                  </p>
                  <p>
                    <strong>Phone:</strong> {man.phone}
                  </p>
                  <p>
                    <strong>Routes:</strong>
                  </p>
                  <select className="routes-dropdown">
                    <option value="" disabled selected>
                      -
                    </option>
                    {routeNames.map((routeName, index) => (
                      <option
                        key={`${man._id}-route-${index}`}
                        value={routeName}
                      >
                        {routeName}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      console.log(`Deliveryman ${man.driver_id} selected`);
                    }}
                  >
                    Submit
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </section>
  );
}
