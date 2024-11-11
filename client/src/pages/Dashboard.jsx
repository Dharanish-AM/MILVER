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

function Dashboard() {
  const deliveryDetails = [
    {
      no: 1,
      name: "Ajay",
      route: "T Nagar",
      half: 15,
      full: 10,
      supplied: 25,
      collected: 20,
      damaged: 2,
      coordinates: [13.0418, 80.2337],
    },
    {
      no: 2,
      name: "Dharanish",
      route: "Nungambakkam",
      half: 12,
      full: 8,
      supplied: 20,
      collected: 18,
      damaged: 1,
      coordinates: [13.0604, 80.2411],
    },
    {
      no: 3,
      name: "jeyaprakash",
      route: "1000 lights",
      half: 10,
      full: 12,
      supplied: 22,
      collected: 19,
      damaged: 0,
      coordinates: [13.0553, 80.2566],
    },
    {
      no: 4,
      name: "sabari",
      route: "Mandaveli",
      half: 10,
      full: 12,
      supplied: 22,
      collected: 19,
      damaged: 0,
      coordinates: [13.0293, 80.2591],
    },
    {
      no: 5,
      name: "vijayguhan",
      route: "Santhome",
      half: 10,
      full: 12,
      supplied: 22,
      collected: 19,
      damaged: 0,
      coordinates: [13.0336, 80.2692],
    },
    {
      no: 6,
      name: "jeyaprakash",
      route: "1000 lights",
      half: 10,
      full: 12,
      supplied: 22,
      collected: 19,
      damaged: 0,
      coordinates: [13.0553, 80.2566],
    },
  ];
  const routes = [
    { name: "T Nagar", color: "red", percentage: 40 },
    { name: "Mandavelli", color: "darkred", percentage: 70 },
    { name: "Nungambakkam", color: "green", percentage: 30 },
    { name: "Santhome", color: "orange", percentage: 45 },
    { name: "1000 lights", color: "blue", percentage: 50 },
  ];

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [name, setname] = useState();
  const position = [13.05, 80.28];
  const mapRef = useRef();
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const bounds = L.latLngBounds(
        deliveryDetails.map((detail) => detail.coordinates)
      );
      map.fitBounds(bounds);
    }
  }, [deliveryDetails]);

  const handleRowClick = (details) => {
    console.log("coordinates", details.coordinates);
    setname(details.name);
    setSelectedRoute(details.coordinates);

    if (mapRef.current) {
      const map = mapRef.current;
      map.setView(details.coordinates, 15);
    }
  };

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
                        <th className="delivery-details-table-Name">Name</th>
                        <th className="delivery-details-table-Route">Route</th>
                        <th className="delivery-details-table-1/2">1/2</th>
                        <th className="delivery-details-table-1">1</th>
                        <th className="delivery-details-table-supplied">
                          <img
                            src={supplied}
                            alt="supplied"
                            style={{ width: "10px", height: "20px" }}
                          />
                        </th>
                        <th className="delivery-details-table-collected">
                          <img
                            src={collected}
                            alt="collected"
                            style={{ width: "10px", height: "20px" }}
                          />
                        </th>
                        <th className="delivery-details-table-broken">
                          <img
                            src={broken}
                            alt="broken"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryDetails.map((detail, index) => (
                        <tr key={index} onClick={() => handleRowClick(detail)}>
                          <td
                            className="delivery-details-table-No"
                            style={{ padding: "15px 15px" }}
                          >
                            {detail.no}
                          </td>
                          <td className="delivery-details-table-Name">
                            {detail.name}
                          </td>
                          <td className="delivery-details-table-Route">
                            {detail.route}
                          </td>
                          <td className="delivery-details-table-1/2">
                            {detail.half}
                          </td>
                          <td className="delivery-details-table-1">
                            {detail.full}
                          </td>
                          <td className="delivery-details-table-supplied">
                            {detail.supplied}
                          </td>
                          <td className="delivery-details-table-collected">
                            {detail.collected}
                          </td>
                          <td className="delivery-details-table-broken">
                            {detail.damaged}
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
          <div
            className="Dashboard-right-mapContainer"
          >
            
          </div>

          <div className="Dashboard-right-routes">
            <div className="Dashboard-right-routes-heading">
              <div className="Dashboard-right-routes-heading-img"></div>
              <div className="Dashboard-right-routes-heading-text">ROUTES</div>
            </div>
            <div className="Dashboard-right-routes-content">
              {routes.map((route, index) => (
                <div className="route" key={index}>
                  <div
                    className="route-dot"
                    style={{ backgroundColor: route.color }}
                  ></div>
                  <span className="route-name">{route.name}</span>
                  <span className="route-percentage">{route.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          </div>
        
      </section>
    </section>
  );
}

export default Dashboard;
