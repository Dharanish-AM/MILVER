import Header from "../components/Header";
import "../App.css";
import cow from "../assets/cow.png";
import tick from "../assets/tick.png";
import exclamation from "../assets/exclamation.png";
import supplied from "../assets/supplied.png";
import collected from "../assets/collected.png";
import broken from "../assets/broken.png";
import person from "../assets/person.png";
function Dashboard() {
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
              <div className="Dashboard-left-bottom-right-table"></div>
            </div>
          </div>
        </div>
        <div className="Dashboard-right"></div>
      </section>
    </section>
  );
}

export default Dashboard;
