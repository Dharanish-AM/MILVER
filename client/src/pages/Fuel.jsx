import { useState } from "react";
import Header from "../components/Header";
import "../styles/fuel.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Fuel() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

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
                <div className="fuel-overview-report-generate-button">
                    <div className="fuel-overview-report-generate-button-img">
                        
                    </div>
                    <div className="fuel-overview-report-generate-button-label">
                        GENERATE REPORT
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fuel-data"></div>
        </div>
      </div>
    </div>
  );
}
