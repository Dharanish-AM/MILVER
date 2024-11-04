import Header from "../components/Header";
import "../styles/App.css";
import cow from "../assets/cow.png";
import tick from "../assets/tick.png";
import exclamation from "../assets/exclamation.png";
import supplied from "../assets/supplied.png";
import collected from "../assets/collected.png";
import broken from "../assets/broken.png";
import person from "../assets/person.png";
function Dashboard() {
  const deliveryDetails = [
    { no: 1, name: "Ajay", route: "T Nagar", half: 15, full: 10, supplied: 25, collected: 20, damaged: 2 },
    { no: 2, name: "Dharanish", route: "Nungambakkam", half: 12, full: 8, supplied: 20, collected: 18, damaged: 1 },
    { no: 3, name: "jeyaprakash", route: "1000 lights", half: 10, full: 12, supplied: 22, collected: 19, damaged: 0 },
    { no: 3, name: "sabari", route: "Mandavelli", half: 10, full: 12, supplied: 22, collected: 19, damaged: 0 },
    { no: 3, name: "vijayguhan", route: "Santhome", half: 10, full: 12, supplied: 22, collected: 19, damaged: 0 },
    { no: 3, name: "jeyaprakash", route: "1000 lights", half: 10, full: 12, supplied: 22, collected: 19, damaged: 0 },
   
  ];
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

              <div className="Dashboard-left-bottom-right-table">
              <table className="delivery-details-table">
                  <thead className="delivery-details-table-head" >
                    <tr style={{}}>
                      <th style={{}}className="delivery-details-table-No">
                        No
                      </th>
                      <th style={{}} className="delivery-details-table-Name">
                        Name
                      </th>
                      <th style={{}} className="delivery-details-table-Route">
                        Route
                      </th>
                      <th style={{}} className="delivery-details-table-1/2">
                        1/2
                      </th>
                      <th style={{}} className="delivery-details-table-1">
                        1
                      </th>
                      <th style={{}} className="delivery-details-table-supplied">
                        <img src={supplied} alt="supplied" style={{width:'10px',height:'20px'}}/>
                      </th>
                      <th style={{}} className="delivery-details-table-collected">
                        <img src={collected} alt="collected" style={{width:'10px',height:'20px'}}/>
                      </th>
                      <th style={{}} className="delivery-details-table-broken">
                        <img src={broken} alt="broken"style={{width:'20px',height:'20px'}}/>
                      </th>
                    </tr>
                  </thead>
               <hr/>
                  <tbody>
                  {deliveryDetails.map((detail, index) => (
                    <tr key={index}>
                      <td style={{padding:'10px 0'}}>{detail.no}</td>
                      <td>{detail.name}</td>
                      <td>{detail.route}</td>
                      <td>{detail.half}</td>
                      <td>{detail.full}</td>
                      <td>{detail.supplied}</td>
                      <td>{detail.collected}</td>
                      <td>{detail.damaged}</td>
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
          <div className="Dashboard-right-mapContainer"></div>
          <div className="Dashboard-right-routes">
            <div className="Dashboard-right-routes-heading">
              <div className="Dashboard-right-routes-heading-img"></div>
              <div className="Dashboard-right-routes-heading-text">
                ROUTES
              </div>
            </div>
            <div className="Dashboard-right-routes-content"></div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Dashboard;
