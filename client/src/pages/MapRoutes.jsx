import Header from "../components/Header";
import "../styles/mapRoutes.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import axios from "axios";
import { useEffect, useState } from "react";
import L from "leaflet";
import industry from "../assets/industry.png";
import "leaflet-routing-machine";

// SVG function that returns an SVG string based on route_id
const getCustomerIconSVG = (route_id) => {
  switch (route_id) {
    case 1:
      return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="red" />
              </svg>`;
    case 2:
      return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="blue" />
              </svg>`;
    default:
      return `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="black" />
              </svg>`;
  }
};

// Custom hook to use the map instance
const MapWithRouting = ({ routeCoordinates, routeColor }) => {
  const map = useMap(); // Get the map instance from the MapContainer

  useEffect(() => {
    const routingControl = L.Routing.control({
      waypoints: routeCoordinates.map((coords) => L.latLng(coords)),
      routeWhileDragging: true, // Allow dragging to adjust the route
      show : false,
      routePopup: false,
      collapsible: false,
      addWaypoints: false,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: routeColor, weight: 4, opacity: 0.7 }],
      },
      createMarker: () => null, // Disable the creation of turn-by-turn instruction markers
    }).addTo(map);
    

    return () => {
      map.removeControl(routingControl); // Clean up the routing control on unmount
    };
  }, [map, routeCoordinates, routeColor]);

  return null; // This component does not render anything visually
};

// MapRoutes component
export default function MapRoutes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/route/getallroutes")
      .then((res) => {
        setData(res.data.data); // Store the data in state
      })
      .catch((err) => {
        console.log("Error in getRoutes API request:", err);
      });
  }, []);

  const customIcon = L.icon({
    iconUrl: industry,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Function to dynamically create Leaflet icons from SVG string
  const createCustomerIcon = (route_id) => {
    const svgString = getCustomerIconSVG(route_id);
    const svgDataUrl = "data:image/svg+xml;base64," + btoa(svgString);
    return L.icon({
      iconUrl: svgDataUrl,
      iconSize: [16, 16],
      iconAnchor: [8, 16],
      popupAnchor: [0, -16],
    });
  };

  // Function to return color based on route_id
  const getRouteColor = (route_id) => {
    switch (route_id) {
      case 1:
        return "red";
      case 2:
        return "blue";
      default:
        return "black";
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <section className="mapRoutes-container">
      <Header />
      <section className="mapRoutes-content">
        <div className="mapRoutes-content-mapContainer">
          <MapContainer
            center={[13.054398115031136, 80.26375998957623]} // Default center
            zoom={15}
            className="mapRoutes-content-map"
          >
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              minZoom={0}
              maxZoom={20}
            />
            <Marker position={[13.054398115031136, 80.26375998957623]} icon={customIcon}>
              <Popup>ART Milk Company</Popup>
            </Marker>

            {/* Loop through each route and plot customers, polyline for actual route */}
            {data.map((route) => {
              const routeCoordinates = [];
              route.customers.forEach((customer) => {
                const coordinates = customer.coordinates;
                routeCoordinates.push([coordinates[1], coordinates[0]]);
              });

              // Get the route color based on route_id
              const routeColor = getRouteColor(route.route_id);

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
                        icon={createCustomerIcon(route.route_id)} // Use dynamic icon based on route_id
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
        <div className="mapRoutes-content-details"></div>
      </section>
    </section>
  );
}
