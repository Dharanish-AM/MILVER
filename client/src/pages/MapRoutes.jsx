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

  return `<svg width="100" height="207" viewBox="0 0 100 207" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Pin Body (outer part) -->
            <path fill-rule="evenodd" clip-rule="evenodd" 
              d="M100 50C100 56.1758 98.8804 62.0898 96.833 67.5505L51.0002 207L5.47681 72.7756C1.97559 65.9451 0 58.2034 0 50C0 22.3857 22.3857 0 50 0C77.6143 0 100 22.3857 100 50ZM50 66C59.9412 66 68 57.9412 68 48C68 38.0588 59.9412 30 50 30C40.0588 30 32 38.0588 32 48C32 57.9412 40.0588 66 50 66Z" 
              fill="${color}"/>
          </svg>`;
};

const MapWithRouting = ({ routeCoordinates, routeColor }) => {
  const map = useMap();

  useEffect(() => {
    // Only add the routing control if the map is defined
    if (!map) return;

    const routingControl = L.Routing.control({
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
      if (map) {
        map.removeControl(routingControl);
      }
    };
  }, [map, routeCoordinates, routeColor]);

  return null;
};

export default function MapRoutes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/route/getallroutes")
      .then((res) => {
        setData(res.data.data);
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
          <MapContainer
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
        <div className="mapRoutes-content-details"></div>
      </section>
    </section>
  );
}
