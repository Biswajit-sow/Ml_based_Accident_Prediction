import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
import { FaCarCrash, FaRegChartBar, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

// Accent color palette
const ACCENT1 = "#00c9a7"; // teal
const ACCENT2 = "#7f53ac"; // violet
const ACCENT3 = "#3f51b5"; // blue
const ACCENT4 = "#f84070"; // pink

const styles = {
  root: {
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
    background: `linear-gradient(135deg, #23292f 0%, #232850 70%, #13171a 100%)`,
    color: "#e0e0e0",
  },
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 30px 10px 30px",
    background: `linear-gradient(90deg, #13171a 65%, #13171a 85%, ${ACCENT2} 100%)`,
    boxShadow: `0 2px 18px #0008`,
    position: "sticky",
    top: 0,
    zIndex: 20,
    borderBottom: `3px solid ${ACCENT1}`,
  },
  logo: {
    fontWeight: 900,
    fontSize: "1.33rem",
    letterSpacing: "2px",
    display: "flex",
    alignItems: "center",
    color: ACCENT1,
    textShadow: `0 3px 12px ${ACCENT2}66`
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
  },
  link: {
    color: "#e0e0e0",
    textDecoration: "none",
    fontSize: "1.07rem",
    position: "relative",
    fontWeight: 500,
    padding: "6px 0",
    borderBottom: "2.5px solid transparent",
    transition: "border 0.28s, color 0.28s",
  },
  container: {
    maxWidth: "560px",
    margin: "46px auto",
    padding: "0 10px"
  },
  formCard: {
    background: `linear-gradient(120deg, #202836 70%, ${ACCENT3}22 100%)`,
    borderRadius: "22px",
    boxShadow: "0 2px 32px rgba(0,0,0,0.17)",
    padding: "38px 26px 29px 26px",
    marginBottom: "56px",
    border: `1.5px solid ${ACCENT2}22`
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    margin: "10px 0 18px 0",
    background: "#24292f",
    color: "#e0eaff",
    border: `1.5px solid ${ACCENT3}22`,
    borderRadius: "9px",
    fontSize: "1rem",
    transition: "border 0.21s, box-shadow 0.21s, background 0.19s",
    outline: "none",
    fontWeight: 500,
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    margin: "10px 0 18px 0",
    background: "#23294a",
    color: "#e0eaff",
    border: `1.5px solid ${ACCENT1}11`,
    borderRadius: "9px",
    fontSize: "1rem",
    fontWeight: 500,
    transition: "border 0.2s, box-shadow 0.2s, background 0.19s",
    outline: "none"
  },
  inputFocus: {
    border: `2px solid ${ACCENT4}`,
    background: "#252547",
    boxShadow: `0 0px 12px ${ACCENT4}33`,
    color: "#fff4fa"
  },
  selectFocus: {
    border: `2px solid ${ACCENT1}`,
    background: "#21224a",
    boxShadow: `0 0px 12px ${ACCENT1}33`,
    color: "#fff"
  },
  button: {
    width: "100%",
    padding: "15px 0",
    background: `linear-gradient(87deg, ${ACCENT4} 20%, ${ACCENT2} 100%)`,
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    letterSpacing: "1px",
    fontSize: "1.08rem",
    cursor: "pointer",
    transition: "background 0.35s, transform 0.18s",
    marginTop: "10px",
    boxShadow: `0 4px 32px ${ACCENT2}33`
  },
  footer: {
    borderTop: `2px solid ${ACCENT2}44`,
    background: `linear-gradient(90deg, #20263f 60%, #161b33 100%)`,
    color: "#fff",
    fontSize: "1.03rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "21px 0 16px 0",
    marginTop: "3em",
    gap: "19px",
    boxShadow: `0 -2px 22px ${ACCENT2}33`
  },
  footerSocial: {
    display: "flex",
    gap: "17px",
    marginLeft: "13px",
  }
};

// Field options
const stateOptions = [
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Delhi", label: "Delhi" },
  { value: "Karnataka", label: "Karnataka" },
  { value: "Tamil Nadu", label: "Tamil Nadu" },
  { value: "Gujarat", label: "Gujarat" },
  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
  { value: "Punjab", label: "Punjab" },
  { value: "West Bengal", label: "West Bengal" },
  { value: "Rajasthan", label: "Rajasthan" },
  { value: "Telangana", label: "Telangana" },
  { value: "Andhra Pradesh", label: "Andhra Pradesh" }
];
const cityOptions = [
  { value: "Mumbai", label: "Mumbai" },
  { value: "Delhi", label: "Delhi" },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Chennai", label: "Chennai" },
  { value: "Pune", label: "Pune" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Kolkata", label: "Kolkata" },
  { value: "Ahmedabad", label: "Ahmedabad" },
  { value: "Lucknow", label: "Lucknow" },
  { value: "Chandigarh", label: "Chandigarh" }
];
const vehicleTypeOptions = [
  { value: "Car", label: "Car" },
  { value: "Bike", label: "Bike" },
  { value: "Truck", label: "Truck" },
  { value: "Auto", label: "Auto" },
  { value: "SUV", label: "SUV" }
];
const lightingOptions = [
  { value: "Daylight", label: "Daylight" },
  { value: "Night", label: "Night" },
  { value: "Dusk/Dawn", label: "Dusk/Dawn" }
];
const trafficOptions = [
  { value: "No Control", label: "No Control" },
  { value: "Signals", label: "Signals" },
  { value: "Police Present", label: "Police Present" }
];

export default function PredictionPage() {
  const [formData, setFormData] = useState({
    datetime: "",
    "Weather Conditions": "Clear",
    "Road Type": "Urban Road",
    "Road Condition": "Dry",
    "Driver Age": 30,
    "Driver License Status": "Valid",
    alcohol_flag: 0,
    driver_experience: "5 years",
    vehicle_condition: "Good",
    driver_speed_habit: 80,
    "State Name": stateOptions[0].value,
    "City Name": cityOptions[0].value,
    "Vehicle Type Involved": vehicleTypeOptions[0].value,
    "Lighting Conditions": lightingOptions[0].value,
    "Traffic Control Presence": trafficOptions[0].value
  });
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (
      ["Driver Age", "driver_speed_habit", "alcohol_flag"].includes(name)
    ) {
      val = value === "" ? "" : Number(value);
    }
    setFormData(prev => ({ ...prev, [name]: val }));
  };
  const handleFocus = (name) => setFocusField(name);
  const handleBlur = () => setFocusField(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/predict", formData);
      navigate("/result", { state: res.data });
    } catch (err) {
      console.error("Prediction Error:", err);
      alert("❌ Prediction failed! Check console for details.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.root}>
      {/* Navbar */}
      <motion.nav style={styles.navbar} initial={{ opacity: 0, y: -32 }} animate={{ opacity: 1, y: 0 }}>
        <div style={styles.logo}>
          <FaCarCrash style={{ marginRight: 8 }} />
          <span style={{color: ACCENT4}}>Crash</span><span style={{color: ACCENT1}}>Predict</span>
        </div>
        <div style={styles.links}>
          <Link style={styles.link} to={"/"}>Home</Link>
          <Link style={styles.link} to={"/predict"}>
            <FaRegChartBar style={{ verticalAlign: "-2px", marginRight: 5, color: ACCENT3 }} />
            Predict
          </Link>
          <Link style={styles.link} to={"/about"}>About</Link>
        </div>
      </motion.nav>
      {/* --- Enhanced Form --- */}
      <div style={styles.container}>
        <motion.form style={styles.formCard} onSubmit={handleSubmit} initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{textAlign: "center", marginBottom: 16}}>
            <span style={{
              fontSize: "1.45rem",
              fontWeight: 700,
              color: ACCENT1,
              letterSpacing: '1px'
            }}>
              Accident Severity Predictor
            </span>
            <div style={{
              margin: "11px auto 0 auto",
              border: `0.5px solid ${ACCENT2}40`,
              width: "48%",
              borderRadius: 2
            }} />
          </div>
          {/* Date/Time */}
          <div style={{margin: "16px 0 0 0"}}>
            <label style={{color: ACCENT2, fontWeight: 600, marginBottom: 3, display: "block"}}>Date & Time</label>
            <motion.input
              type="datetime-local"
              name="datetime"
              style={{
                ...styles.input,
                ...(focusField === "datetime" ? styles.inputFocus : {})
              }}
              onChange={handleChange}
              onFocus={() => handleFocus("datetime")}
              onBlur={handleBlur}
              required
            />
          </div>
          {/* Location (State/City) */}
          <div style={{display:"grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 6}}>
            <div>
              <label style={{color: ACCENT2, fontWeight: 600, marginBottom: 3, display: "block"}}>State</label>
              <motion.select
                name="State Name"
                value={formData["State Name"]}
                style={{
                  ...styles.select,
                  ...(focusField === "State Name" ? styles.selectFocus : {})
                }}
                onChange={handleChange}
                onFocus={() => handleFocus("State Name")}
                onBlur={handleBlur}
              >
                {stateOptions.map(opt => (<option key={opt.label} value={opt.label}>{opt.label}</option>))}
              </motion.select>
            </div>
            <div>
              <label style={{color: ACCENT2, fontWeight: 600, marginBottom: 3, display: "block"}}>City</label>
              <motion.select
                name="City Name"
                value={formData["City Name"]}
                style={{
                  ...styles.select,
                  ...(focusField === "City Name" ? styles.selectFocus : {})
                }}
                onChange={handleChange}
                onFocus={() => handleFocus("City Name")}
                onBlur={handleBlur}
              >
                {cityOptions.map(opt => (<option key={opt.label} value={opt.label}>{opt.label}</option>))}
              </motion.select>
            </div>
          </div>
          {/* Road/Weather */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:6}}>
            <div>
              <label style={{color: ACCENT3, fontWeight: 600}}>Weather</label>
              <motion.select
                name="Weather Conditions"
                value={formData["Weather Conditions"]}
                style={{
                  ...styles.select,
                  ...(focusField === "Weather Conditions" ? styles.selectFocus : {})
                }}
                onChange={handleChange}
                onFocus={() => handleFocus("Weather Conditions")}
                onBlur={handleBlur}
              >
                <option>Clear</option>
                <option>Rainy</option>
                <option>Foggy</option>
                <option>Stormy</option>
              </motion.select>
            </div>
            <div>
              <label style={{color: ACCENT3, fontWeight: 600}}>Lighting</label>
              <motion.select
                name="Lighting Conditions"
                value={formData["Lighting Conditions"]}
                style={{
                  ...styles.select,
                  ...(focusField === "Lighting Conditions" ? styles.selectFocus : {})
                }}
                onChange={handleChange}
                onFocus={() => handleFocus("Lighting Conditions")}
                onBlur={handleBlur}
              >
                {lightingOptions.map(opt => (<option key={opt.label} value={opt.label}>{opt.label}</option>))}
              </motion.select>
            </div>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginTop:6}}>
            <div>
              <label style={{color: ACCENT4, fontWeight: 600}}>Road Type</label>
              <motion.select
                name="Road Type"
                value={formData["Road Type"]}
                style={{
                  ...styles.select,
                  ...(focusField === "Road Type" ? styles.selectFocus : {})
                }}
                onChange={handleChange}
                onFocus={() => handleFocus("Road Type")}
                onBlur={handleBlur}
              >
                <option>Urban Road</option>
                <option>State Highway</option>
                <option>National Highway</option>
              </motion.select>
            </div>
            <div>
              <label style={{color: ACCENT4, fontWeight: 600}}>Road Condition</label>
              <motion.select
                name="Road Condition"
                value={formData["Road Condition"]}
                style={{
                  ...styles.select,
                  ...(focusField === "Road Condition" ? styles.selectFocus : {})
                }}
                onChange={handleChange}
                onFocus={() => handleFocus("Road Condition")}
                onBlur={handleBlur}
              >
                <option>Dry</option>
                <option>Wet</option>
                <option>Damaged</option>
                <option>Construction</option>
              </motion.select>
            </div>
            <div>
              <label style={{color: ACCENT4, fontWeight: 600}}>Traffic Ctrl</label>
              <motion.select
                name="Traffic Control Presence"
                value={formData["Traffic Control Presence"]}
                style={{
                  ...styles.select,
                  ...(focusField === "Traffic Control Presence" ? styles.selectFocus : {})
                }}
                onChange={handleChange}
                onFocus={() => handleFocus("Traffic Control Presence")}
                onBlur={handleBlur}
              >
                {trafficOptions.map(opt => (<option key={opt.label} value={opt.label}>{opt.label}</option>))}
              </motion.select>
            </div>
          </div>
          {/* Vehicle */}
          <div style={{marginTop: "12px"}}>
            <label style={{color: ACCENT1, fontWeight: 600}}>Vehicle Type</label>
            <motion.select
              name="Vehicle Type Involved"
              value={formData["Vehicle Type Involved"]}
              style={{
                ...styles.select,
                ...(focusField === "Vehicle Type Involved" ? styles.selectFocus : {})
              }}
              onChange={handleChange}
              onFocus={() => handleFocus("Vehicle Type Involved")}
              onBlur={handleBlur}
            >
              {vehicleTypeOptions.map(opt => (<option key={opt.label} value={opt.label}>{opt.label}</option>))}
            </motion.select>
          </div>
          <div style={{marginTop: "12px"}}>
            <label style={{color: ACCENT1, fontWeight: 600}}>Vehicle Condition</label>
            <motion.select
              name="vehicle_condition"
              value={formData["vehicle_condition"]}
              style={{
                ...styles.select,
                ...(focusField === "vehicle_condition" ? styles.selectFocus : {})
              }}
              onChange={handleChange}
              onFocus={() => handleFocus("vehicle_condition")}
              onBlur={handleBlur}
            >
              <option>Good</option>
              <option>Average</option>
              <option>Poor</option>
            </motion.select>
          </div>
          {/* Driver fields */}
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 8}}>
            <div>
              <label style={{color: ACCENT1, fontWeight: 600}}>Age</label>
              <motion.input
                type="number"
                name="Driver Age"
                style={{
                  ...styles.input,
                  ...(focusField === "Driver Age" ? styles.inputFocus : {})
                }}
                onChange={handleChange}
                onFocus={() => handleFocus("Driver Age")}
                onBlur={handleBlur}
                value={formData["Driver Age"]}
                min={16}
                max={99}
              />
            </div>
            <div>
              <label style={{color: ACCENT1, fontWeight: 600}}>Speed(km/h)</label>
              <motion.input
                type="number"
                name="driver_speed_habit"
                style={{
                  ...styles.input,
                  ...(focusField === "driver_speed_habit" ? styles.inputFocus : {})
                }}
                onChange={handleChange}
                onFocus={() => handleFocus("driver_speed_habit")}
                onBlur={handleBlur}
                value={formData.driver_speed_habit}
                min={0}
                max={200}
                step={1}
                placeholder="Speed"
              />
            </div>
            <div>
              <label style={{color: ACCENT1, fontWeight: 600}}>Alcohol</label>
              <motion.select
                name="alcohol_flag"
                value={formData.alcohol_flag}
                style={{
                  ...styles.select,
                  ...(focusField === "alcohol_flag" ? styles.selectFocus : {})
                }}
                onChange={handleChange}
                onFocus={() => handleFocus("alcohol_flag")}
                onBlur={handleBlur}
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </motion.select>
            </div>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 8}}>
            <div>
              <label style={{color: ACCENT3, fontWeight: 600}}>License Status</label>
              <motion.select
                name="Driver License Status"
                value={formData["Driver License Status"]}
                style={{
                  ...styles.select,
                  ...(focusField === "Driver License Status" ? styles.selectFocus : {})
                }}
                onChange={handleChange}
                onFocus={() => handleFocus("Driver License Status")}
                onBlur={handleBlur}
              >
                <option>Valid</option>
                <option>Expired</option>
                <option>No License</option>
              </motion.select>
            </div>
            <div>
              <label style={{color: ACCENT3, fontWeight: 600}}>Experience</label>
              <motion.input
                type="text"
                name="driver_experience"
                style={{
                  ...styles.input,
                  ...(focusField === "driver_experience" ? styles.inputFocus : {})
                }}
                onChange={handleChange}
                onFocus={() => handleFocus("driver_experience")}
                onBlur={handleBlur}
                value={formData.driver_experience}
                placeholder="e.g. 5 years, 12 months"
              />
            </div>
          </div>
          {/* Button */}
          <motion.button
            type="submit"
            style={styles.button}
            disabled={loading}
            whileHover={{
              scale: 1.055,
              background: `linear-gradient(100deg, ${ACCENT1} 0%, ${ACCENT4} 100%)`,
              boxShadow: `0 8px 44px ${ACCENT1}44`
            }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Predicting..." : "Predict Severity"}
          </motion.button>
        </motion.form>
      </div>
      {/* Footer */}
      <motion.footer style={styles.footer} initial={{opacity: 0}} animate={{opacity: 1}}>
        <span>&copy; 2025 <span style={{color: ACCENT2, fontWeight:'bold'}}>CrashPredict</span></span>
        <span style={styles.footerSocial}>
          <motion.a whileHover={{ scale: 1.18, color: ACCENT1 }} href="https://github.com/" target="_blank" rel="noopener noreferrer">
            <FaGithub color={ACCENT4} style={{transition:"color 0.2s"}} />
          </motion.a>
          <motion.a whileHover={{ scale: 1.18, color: ACCENT2 }} href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <FaTwitter color={ACCENT2} style={{transition:"color 0.2s"}} />
          </motion.a>
          <motion.a whileHover={{ scale: 1.18, color: ACCENT3 }} href="mailto:support@crashpredict.com">
            <FaEnvelope color={ACCENT3} style={{transition:"color 0.2s"}} />
          </motion.a>
        </span>
      </motion.footer>
    </div>
  );
}
