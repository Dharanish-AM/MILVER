import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/fuel.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import axios from "axios";

export default function Fuel() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("none");
  const [data, setData] = useState([]); 

  const filterOptions = ["none", "Assigned", "Not Assigned"];

  useEffect(() => {
    const getdata = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/route/`
        );
        console.log(response.data)
        const routes = response.data.map((route, index) => ({
          sno:route.route_id,
          route: route.route_name, 
          drivers: route.driver?.name || "Unassigned", 
          totalCost: 0, 
          todaysAmount: 0,
          editable: false,
        }));
        setData(routes);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    getdata();
  }, []);

  const handleFilterChange = (option) => {
    setFilter(option.value);
  };

  const handleGenerateReport = () => {
    console.log(
      "Generating report from",
      fromDate,
      "to",
      toDate,
      "with filter",
      filter
    );
  };
const handleSave=async(e)=>{

console.log(e.sno)

const response=await axios.post(`${import.meta.env.VITE_API_URL}/fuelallowance/update`,{routeid:e.sno,deliverymanid:2,defaultamount:e.totalCost,todaysamount:e.todaysAmount});

}
  const toggleEdit = (index) => {
    const newData = [...data];
    newData[index].editable = !newData[index].editable;
    setData(newData);
  };

  const handleInputChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  return (
    <div className="fuel">
      <Header />
      <div className="fuel-container">
        <div className="fuel-innerContainer">
          <div className="fuel-header">
            <div className="fuel-header-img"></div>
            <div className="fuel-header-text">FUEL ALLOWANCE</div>
          </div>
          <div className="fuel-overview">
            <div className="fuel-overview-daily">
              <div className="fuel-overview-daily-content">
                <span>Rs. </span>1200
              </div>
              <div className="fuel-overview-daily-label">TODAY FUEL COST</div>
            </div>
            <div className="fuel-overview-total">
              <div className="fuel-overview-total-content">
                <span>Rs. </span>14521
              </div>
              <div className="fuel-overview-total-label">
                CURRENT MONTH TOTAL
              </div>
            </div>
            <div className="fuel-overview-report">
              <div className="fuel-overview-report-from">
                <div className="fuel-overview-report-from-label">From Date</div>
                <div className="fuel-overview-report-from-datepicker">
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="custom-datepicker-input"
                    calendarClassName="custom-datepicker-calendar"
                  />
                </div>
              </div>
              <div className="fuel-overview-report-to">
                <div className="fuel-overview-report-to-label">To Date</div>
                <div className="fuel-overview-report-to-datepicker">
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="custom-datepicker-input"
                    calendarClassName="custom-datepicker-calendar"
                  />
                </div>
              </div>
              <div className="fuel-overview-report-generate">
                <div
                  className="fuel-overview-report-generate-button"
                  onClick={handleGenerateReport}
                >
                  <div className="fuel-overview-report-generate-button-img"></div>
                  <div className="fuel-overview-report-generate-button-label">
                    GENERATE REPORT
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fuel-data">
            <div className="fuel-data-top">
              <div className="fuel-top-searchbar">
                <div className="fuel-top-searchbar-img"></div>
                <input
                  type="text"
                  placeholder="search..."
                  value={search}
                  onChange={(val) => setSearch(val.target.value)}
                  className="fuel-top-searchbar-search-searchbar-input"
                />
              </div>
              <div className="fuel-top-filter">
                <Dropdown
                  options={filterOptions}
                  onChange={handleFilterChange}
                  value={filter}
                />
              </div>
            </div>
            <div
              className="fuel-data-bottom"
              style={{ overflowY: "auto", maxHeight: "400px" }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                }}
              >
                <thead
                  style={{
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#f5f5f5",
                    zIndex: 1,
                  }}
                >
                  <tr style={{ textAlign: "left" }}>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>S. No</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Route Name</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Drivers</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>TA</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>PAID</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr
                      key={index}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                      }}
                    >
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                        {row.sno}
                      </td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                        {row.route}
                      </td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                        {row.drivers}
                      </td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                        {row.editable ? (
                          <input
                            type="number"
                            value={row.totalCost}
                            onChange={(e) =>
                              handleInputChange(index, "totalCost", e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "5px",
                              border: "1px solid #ccc",
                              borderRadius: "5px",
                            }}
                          />
                        ) : (
                          `Rs. ${row.totalCost}`
                        )}
                      </td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                        {row.editable ? (
                          <input
                            type="number"
                            value={row.todaysAmount}
                            onChange={(e) =>
                              handleInputChange(index, "todaysAmount", e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "5px",
                              border: "1px solid #ccc",
                              borderRadius: "5px",
                            }}
                          />
                        ) : (
                          `Rs. ${row.todaysAmount}`
                        )}
                      </td>
                      <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                      <button
  className={`edit-button ${
    row.editable ? "save-button" : "edit-mode-button"
  }`}
  onClick={() => {
    if (row.editable) {
      handleSave(row); 
    }
    toggleEdit(index); 
  }}
  style={{
    padding: "5px 10px",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }}
>
  {row.editable ? "Save" : "Edit"}
</button>

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
  );
}
