import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaMapMarkedAlt,
  FaGlobeAsia,
  FaMapPin,
  FaSyncAlt,
  FaCheckCircle
} from "react-icons/fa";

// Accent colors
const ACCENT1 = "#00c9a7";
const ACCENT2 = "#7f53ac";
const ACCENT3 = "#f84070";

// Input style helper
const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  background: "#24292f",
  color: "#e0e0e0",
  border: `2px solid ${ACCENT1}44`,
  borderRadius: "9px",
  fontSize: "1.03rem",
  marginBottom: "12px",
  fontWeight: 500,
  transition: "border 0.22s, box-shadow 0.23s"
};

const HotspotMap = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("500");
  const [mapUrl, setMapUrl] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://127.0.0.1:5000";

  const generateMap = async () => {
    if (!latitude || !longitude) {
      toast.error("Please enter latitude and longitude!");
      return;
    }
    try {
      setLoading(true);
      toast.loading("Generating hotspot map...");
      const response = await axios.post(`${BASE_URL}/generate_hotspot_map`, {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius_km: parseFloat(radius),
      });
      toast.dismiss();
      if (response.data.status === "success" && response.data.map_url) {
        toast.success("✅ Map generated successfully!");
        const freshUrl = `${BASE_URL}/hotspot_map?ts=${new Date().getTime()}`;
        setMapUrl(freshUrl);
        setShowMap(true);
      } else {
        toast.error("⚠️ Map generation failed.");
        console.error("Backend response:", response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Error connecting to backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(118deg,#1a2233 0%,#232850 100%)",
      paddingTop: 40
    }}>
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        style={{
          maxWidth: 640,
          margin: "auto",
          background: "linear-gradient(126deg, #23294a 77%, #00c9a715 100%)",
          borderRadius: 24,
          boxShadow: "0 9px 32px #23285099",
          padding: "36px 30px 32px 30px"
        }}
      >
        <div style={{textAlign: "center", marginBottom: 13}}>
          <FaMapMarkedAlt style={{fontSize:"2.33em",color: ACCENT1,verticalAlign:"-10px",marginRight:"10px"}}/>
          <span style={{fontSize:"1.47em",fontWeight:700,letterSpacing:2, color: ACCENT2}}>
            Asia Accident Hotspot Map
          </span>
        </div>
        <div style={{textAlign:"center",fontSize:"1.09em",color:"#e0eaff",marginBottom:"2em"}}>
          Enter coordinates to <span style={{color:ACCENT1,fontWeight:600}}>view accident-prone areas</span> on an interactive map.
        </div>

        {/* Inputs Row */}
        <motion.div style={{
          display: "flex",
          gap: 18,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 19
        }}>
          <div>
            <label style={{color:ACCENT1,fontWeight:600,marginBottom:4,display:"block"}}>
              <FaMapPin style={{marginRight:4,verticalAlign:"-2px"}}/>
              Latitude
            </label>
            <input
              type="number"
              style={inputStyle}
              placeholder="e.g. 19.0760"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
            />
          </div>
          <div>
            <label style={{color:ACCENT2,fontWeight:600,marginBottom:4,display:"block"}}>
              <FaMapPin style={{marginRight:4,verticalAlign:"-2px"}}/>
              Longitude
            </label>
            <input
              type="number"
              style={inputStyle}
              placeholder="e.g. 72.8777"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
            />
          </div>
          <div>
            <label style={{color:ACCENT3,fontWeight:600,marginBottom:4,display:"block"}}>
              <FaGlobeAsia style={{marginRight:4,verticalAlign:"-2px"}}/>
              Radius (km)
            </label>
            <input
              type="number"
              style={inputStyle}
              placeholder="Radius"
              value={radius}
              onChange={e => setRadius(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Generate Button */}
        <motion.button
          whileHover={{
            scale: 1.06,
            background: `linear-gradient(87deg,${ACCENT1} 25%,${ACCENT2} 100%)`,
            color: "#fff"
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: `linear-gradient(87deg,${ACCENT1} 75%,${ACCENT2} 100%)`,
            color: "#fff",
            border: "none",
            borderRadius: "2em",
            fontWeight: "bold",
            letterSpacing: "1.1px",
            fontSize: "1.07em",
            padding: "0.8em 2.2em",
            boxShadow: `0 4px 22px ${ACCENT1}33`,
            marginBottom: "1.9em",
            cursor: "pointer"
          }}
          onClick={generateMap}
          disabled={loading}
        >
          {loading
            ? (<><FaSyncAlt className="spin" style={{marginRight:7}}/> Generating...</>)
            : (<><FaCheckCircle style={{marginRight:7}}/> Generate Map</>)
          }
        </motion.button>

        {/* Result Map */}
        {showMap && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, type: "spring" }}
            style={{marginTop:"1.3em"}}
          >
            <div style={{ fontWeight: 700, fontSize: "1.2em", color: ACCENT2, margin: "0 0 0.8em 0" }}>
              <FaMapMarkedAlt style={{ color: ACCENT1, marginRight: 7, verticalAlign: "-2px" }} />
              Interactive Hotspot Map
            </div>
            <iframe
              src={mapUrl}
              title="Hotspot Map"
              width="100%"
              height="540px"
              style={{
                border: `2px solid ${ACCENT2}`,
                borderRadius: "16px",
                boxShadow: "0 2px 18px #23294a66"
              }}
            ></iframe>
          </motion.div>
        )}
      </motion.div>
      <style>{`
        .spin { animation: spin 0.9s infinite linear;}
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default HotspotMap;
