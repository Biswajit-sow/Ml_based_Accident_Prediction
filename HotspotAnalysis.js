import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaSatellite,
  FaMapMarkedAlt,
  FaMapPin,
  FaGlobe,
  FaMap,
  FaExclamationCircle,
  FaSyncAlt,
  FaChartBar,
  FaUserShield
} from "react-icons/fa";

const ACCENT1 = "#00c9a7";
const ACCENT2 = "#7f53ac";
const ACCENT3 = "#f84070";
const HEADER_BG = "linear-gradient(129deg,#23294a 80%,#00c9a71b 100%)";

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

const getRiskColor = risk =>
  risk === "HIGH" ? ACCENT3 : risk === "MEDIUM" ? "#ffc107" : ACCENT1;

export default function HotspotAnalysis() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("500");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mapUrl, setMapUrl] = useState("");
  const [showMap, setShowMap] = useState(false);

  const BASE_URL = "http://127.0.0.1:5000";

  const handleHotspotAnalysis = async () => {
    if (!latitude || !longitude) {
      toast.error("Please enter both latitude and longitude!");
      return;
    }
    setLoading(true);
    setResult(null);
    setShowMap(false);
    try {
      const response = await axios.post(`${BASE_URL}/hotspot_analysis`, {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius_km: parseFloat(radius),
      });
      setResult(response.data);
      toast.success("Hotspot analysis completed!");
    } catch (error) {
      toast.error("Error fetching hotspot data!");
      console.error(error);
    }
    setLoading(false);
  };

  const handleGenerateMap = async () => {
    if (!latitude || !longitude) {
      toast.error("Please enter latitude and longitude first!");
      return;
    }
    setLoading(true);
    setShowMap(false);
    toast("Generating interactive map...");
    try {
      const response = await axios.post(`${BASE_URL}/generate_hotspot_map`, {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius_km: parseFloat(radius),
      });
      if (response.data.view_url) {
        setMapUrl(response.data.view_url);
        setShowMap(true);
        toast.success("✅ Map generated successfully!");
      } else {
        toast.error("Failed to generate map!");
      }
    } catch (error) {
      toast.error("Error connecting to backend!");
      console.error(error);
    }
    setLoading(false);
  };

  function renderHotspotSummary(hotspots = []) {
    if (!Array.isArray(hotspots) || hotspots.length === 0) return (
      <div style={{textAlign:"center",marginTop:5,fontWeight:500,color:"#c1c6dd"}}>
        <FaExclamationCircle style={{color:"#ffc107",marginRight:7}} />
        No major hotspots found in this area.
      </div>
    );
    const sorted = [...hotspots].sort((a, b) => b.accident_count - a.accident_count);
    const top = sorted.slice(0, 3);
    const maxAccidents = sorted[0]?.accident_count ?? null;
    return (
      <>
        <div style={{marginBottom:9,fontWeight:600}}>
          <FaChartBar style={{color:ACCENT2,marginRight:9,verticalAlign:"-3px"}}/>
          <span style={{color:ACCENT2}}>Total Hotspots:</span> <span style={{color:ACCENT1}}>{hotspots.length}</span>
        </div>
        {maxAccidents !== null &&
          <div style={{marginBottom:7}}>
            <FaUserShield style={{color:ACCENT3,marginRight:8,verticalAlign:"-2px"}}/>
            <span style={{fontWeight:600}}>Maximum Accident Count at a Hotspot:</span>{" "}
            <span style={{color:ACCENT3,fontWeight:700}}>{maxAccidents}</span>
          </div>
        }
        <div style={{marginBottom:8,fontWeight:600,color:ACCENT2}}>Top Hotspots:</div>
        <div>
          {top.map((h, i) => (
            <div key={i} style={{
              background:"rgba(255,255,255,0.08)",
              borderLeft:`5px solid ${getRiskColor(h.risk_level)}`,
              borderRadius: "0.8em",
              fontSize:"1em",
              fontWeight:500,
              marginBottom:6,
              boxShadow:"0 2px 8px #23294a22",
              padding:"7px 13px 6px 9px",
              display:"flex", justifyContent:"space-between", alignItems:"center"
            }}>
              <span>
                <span style={{fontWeight:700,color:getRiskColor(h.risk_level)}}>
                  {h.location_name}
                </span>
                {" "}(Region: {h.region})
              </span>
              <span style={{fontWeight:600,marginLeft:10}}>
                Accidents: <span style={{color:getRiskColor(h.risk_level)}}>{h.accident_count}</span>
                {" "} | Risk: <span style={{color:getRiskColor(h.risk_level)}}>{h.risk_level}</span>
              </span>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg,#1a2233 0%,#232850 100%)",
      paddingTop: 42
    }}>
      <motion.div
        initial={{ opacity: 0, y: 38 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        style={{
          maxWidth: 880,
          margin: "auto",
          background: HEADER_BG,
          borderRadius: 32,
          boxShadow: "0 9px 32px #23285099",
          padding: "36px 36px 42px 36px"
        }}
      >
        <div style={{textAlign: "center", marginBottom: 16}}>
          <FaMapMarkedAlt style={{fontSize:"2.1em",color: ACCENT1,verticalAlign:"-9px",marginRight:"8px"}}/>
          <span style={{fontSize:"1.41em",fontWeight:700,letterSpacing:2, color: ACCENT2}}>
            Accident Hotspot Analysis
          </span>
        </div>
        <div style={{textAlign:"center",fontSize:"1.09em",color:"#e0eaff",marginBottom:"2em"}}>
          Enter coordinates to <span style={{color:ACCENT1,fontWeight:600}}>analyze nearby accident-prone areas</span> or generate an interactive hotspot map.
        </div>

        {/* Inputs Row */}
        <motion.div style={{display:"flex",gap:18,justifyContent:"center",flexWrap:"wrap",marginBottom:22}}>
          <div>
            <label style={{color:ACCENT1,fontWeight:600,marginBottom:4,display:"block"}}>
              <FaMapPin style={{marginRight:5,verticalAlign:"-2px"}}/>
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
              <FaMapPin style={{marginRight:5,verticalAlign:"-2px"}}/>
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
              <FaGlobe style={{marginRight:5,verticalAlign:"-2px"}}/>
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

        {/* Buttons */}
        <div style={{textAlign:"center",marginBottom:"1.7em"}}>
          <motion.button
            whileHover={{
              background: `linear-gradient(87deg,${ACCENT2} 40%,${ACCENT1} 100%)`,
              color: "#fff",
              scale:1.06
            }}
            whileTap={{scale:0.97}}
            style={{
              background: `linear-gradient(87deg,${ACCENT1} 60%,${ACCENT2} 100%)`,
              color: "#fff",
              fontWeight: 700,
              borderRadius: "2em",
              border: "none",
              padding: "0.7em 2em",
              fontSize: "1.11em",
              marginRight: "16px",
              cursor: "pointer",
              letterSpacing:'1px',
              boxShadow: `0 4px 16px ${ACCENT1}33`
            }}
            onClick={handleHotspotAnalysis}
            disabled={loading}
          >
            {loading
              ? (<><FaSyncAlt className="spin" style={{marginRight:7}}/>Analyzing...</>)
              : (<><FaSatellite style={{marginRight:6}}/>Analyze Hotspots</>)
            }
          </motion.button>
          <motion.button
            whileHover={{
              background: `linear-gradient(87deg,${ACCENT3} 40%,${ACCENT1} 100%)`,
              color: "#fff",
              scale:1.04
            }}
            whileTap={{scale:0.97}}
            style={{
              background: `linear-gradient(87deg,${ACCENT3} 45%,${ACCENT1} 100%)`,
              color: "#fff",
              fontWeight: 700,
              borderRadius: "2em",
              border: "none",
              padding: "0.7em 2em",
              fontSize: "1.11em",
              cursor: "pointer",
              letterSpacing:'1px',
              boxShadow: `0 4px 16px ${ACCENT3}33`
            }}
            onClick={handleGenerateMap}
            disabled={loading}
          >
            {loading
              ? (<><FaSyncAlt className="spin" style={{marginRight:7}}/>Generating...</>)
              : (<><FaMap style={{marginRight:6}}/>Generate Map</>)
            }
          </motion.button>
        </div>

        {/* Interactive Map - At Top, More Visible */}
        {showMap && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.58, type: "spring" }}
            style={{
              margin: "0px auto 32px auto",
              background: "#101b29",
              borderRadius:'1.1em',
              boxShadow:"0 6px 40px #00c9a736",
              padding: "16px",
              maxWidth: "100%",
              textAlign:"center"
            }}
          >
            <div style={{ fontWeight: 700, fontSize: "1.24em", color: ACCENT2, margin: "0 0 1.2em 0" }}>
              <FaMapMarkedAlt style={{ color: ACCENT1, marginRight: 8, verticalAlign: "-2px" }} />
              Interactive Hotspot Map
            </div>
            <iframe
              src={mapUrl}
              title="Hotspot Map"
              width="100%"
              height="500px"
              style={{
                border: `3px solid ${ACCENT2}`,
                borderRadius: "18px",
                boxShadow: "0 2px 24px #23294a66"
              }}
            />
          </motion.div>
        )}

        {/* Prediction/Analysis Details - Below Map */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, type: "spring" }}
            style={{
              background:'linear-gradient(126deg,#222847 80%,#00c9a71b 100%)',
              color:'#e0eaff',
              borderRadius:'1.15em',
              boxShadow:`0 4px 20px #00c9a736`,
              margin:"1.3em auto 0 auto",
              padding:"27px 24px 13px 24px",
              maxWidth:540
            }}
          >
            <div style={{textAlign:"center",fontSize:"1.17em",fontWeight:700,marginBottom:7,color:ACCENT1}}>
              <FaSatellite style={{marginRight:11, color:ACCENT3, verticalAlign:"-4px"}}/>
              Hotspot Analysis Summary
            </div>
            <hr style={{margin:"12px 0",opacity:0.16}} />
            <div>
              <FaMapPin style={{color:ACCENT1,marginRight:7}}/><b>Latitude:</b> <span style={{color:ACCENT1}}>{result.location?.latitude}</span>
            </div>
            <div>
              <FaMapPin style={{color:ACCENT2,marginRight:7}}/><b>Longitude:</b> <span style={{color:ACCENT2}}>{result.location?.longitude}</span>
            </div>
            <div>
              <FaGlobe style={{color:ACCENT3,marginRight:7}}/><b>Search Radius:</b> <span style={{color:ACCENT3}}>{result.search_radius_km} km</span>
            </div>
            <div>
              <FaExclamationCircle style={{color:ACCENT3,marginRight:7}}/><b>Status:</b> <span style={{color:ACCENT3}}>{result.status}</span>
            </div>
            <div><b>Timestamp:</b> <span style={{fontWeight:"normal",color:"#b7aaff"}}>{result.timestamp}</span></div>
            <div style={{marginTop:18,marginBottom:6,fontWeight:700,color:ACCENT2}}>
              <FaMapMarkedAlt style={{marginRight:9, color:ACCENT1, verticalAlign:"-4px"}}/>
              Hotspot Details:
            </div>
            {renderHotspotSummary(result?.hotspot_analysis)}
          </motion.div>
        )}
      </motion.div>
      <style>{`
        .spin { animation: spin 0.96s infinite linear;}
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
