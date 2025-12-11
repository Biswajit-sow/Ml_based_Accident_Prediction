import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaMapMarkedAlt,
  FaMapPin,
  FaSearchLocation,
  FaGlobe,
  FaSatellite,
  FaTimesCircle,
  FaExclamationCircle,
  FaSync,
  FaRegClock
} from "react-icons/fa";

const ACCENT1 = "#00c9a7"; // teal
const ACCENT2 = "#7f53ac"; // violet
const ACCENT3 = "#3f51b5"; // blue
const ACCENT4 = "#f84070"; // pink

const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  background: "#24292f",
  color: "#e0e0e0",
  border: `2px solid ${ACCENT1}44`,
  borderRadius: "9px",
  fontSize: "1.03rem",
  marginBottom: "11px",
  fontWeight: 500,
  transition: "border 0.22s, box-shadow 0.23s"
};

export default function HotspotAnalysis() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("500");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mapUrl, setMapUrl] = useState("");
  const [showMap, setShowMap] = useState(false);

  // Backend URL
  const BASE_URL = "http://127.0.0.1:5000";

  // 🔍 Analyze Hotspot Risk (Text Info)
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

  // 🗺️ Generate and Show Hotspot Map
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

  return (
    <div style={{maxWidth:700,margin:"48px auto",padding:0,background:"linear-gradient(128deg,#1a2233 0%,#232850 100%)",borderRadius:30,boxShadow:'0 8px 32px #23285070'}}>
      <motion.div
        initial={{ opacity: 0, y: 38 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        style={{padding:"36px 28px"}}
      >
        <div style={{textAlign:"center",marginBottom:10}}>
          <span style={{fontSize:"2.2rem",color:ACCENT1,marginRight:10,verticalAlign:"-8px"}}>
            <FaMapMarkedAlt />
          </span>
          <span style={{fontSize:"1.49rem",fontWeight:700,letterSpacing:"2px",color:ACCENT2}}>Accident Hotspot Analysis</span>
        </div>
        <div style={{textAlign:"center",fontSize:"1.08rem",color:"#e0eaff",marginBottom:"1.7em"}}>
          Enter coordinates to <span style={{color:ACCENT1,fontWeight:500}}>analyze accident-prone areas</span> and generate hotspot maps in your vicinity.
        </div>

        {/* Inputs */}
        <motion.div style={{
          display:"flex",gap:20,justifyContent:"center",flexWrap:"wrap",marginBottom:"14px"
        }}>
          <motion.div whileFocus={{scale:1.08}}>
            <label style={{color:ACCENT1,fontWeight:600,marginBottom:4,display:"block"}}>
              <FaMapPin style={{marginRight:6,verticalAlign:"-3px"}}/>
              Latitude
            </label>
            <input
              type="number"
              style={inputStyle}
              placeholder="e.g., 19.0760"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
            />
          </motion.div>
          <motion.div whileFocus={{scale:1.08}}>
            <label style={{color:ACCENT2,fontWeight:600,marginBottom:4,display:"block"}}>
              <FaSearchLocation style={{marginRight:6,verticalAlign:"-3px"}}/>
              Longitude
            </label>
            <input
              type="number"
              style={inputStyle}
              placeholder="e.g., 72.8777"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
            />
          </motion.div>
          <motion.div whileFocus={{scale:1.07}}>
            <label style={{color:ACCENT4,fontWeight:600,marginBottom:4,display:"block"}}>
              <FaGlobe style={{marginRight:6,verticalAlign:"-3px"}}/>
              Radius (km)
            </label>
            <input
              type="number"
              style={inputStyle}
              placeholder="Radius"
              value={radius}
              onChange={e => setRadius(e.target.value)}
            />
          </motion.div>
        </motion.div>

        {/* Buttons */}
        <div style={{textAlign:"center",marginBottom:"0.7em"}}>
          <motion.button
            whileHover={{scale:1.07,background:`linear-gradient(90deg,${ACCENT1} 30%,${ACCENT2} 100%)`,color:"#fff"}}
            whileTap={{scale:0.98}}
            style={{
              background: `linear-gradient(90deg,${ACCENT1} 20%,${ACCENT4} 100%)`,
              color: "#fff",
              fontWeight: 700,
              borderRadius: "2em",
              border: "none",
              padding: "0.7em 2em",
              fontSize: "1.11em",
              marginRight: "18px",
              cursor: "pointer",
              letterSpacing:'1px',
              boxShadow: `0 4px 16px ${ACCENT1}44`
            }}
            onClick={handleHotspotAnalysis}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSync className="spin" style={{marginRight:7}}/>
                Analyzing...
              </>
            ) : (
              <>
                <FaSatellite style={{marginRight:7}}/>
                Analyze Hotspots
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{scale:1.06,background:`linear-gradient(90deg,${ACCENT2} 30%,${ACCENT1} 100%)`,color:"#fff"}}
            whileTap={{scale:0.98}}
            style={{
              background: `linear-gradient(90deg,${ACCENT2} 30%,${ACCENT1} 100%)`,
              color: "#fff",
              fontWeight: 700,
              borderRadius: "2em",
              border: "none",
              padding: "0.7em 2em",
              fontSize: "1.11em",
              cursor: "pointer",
              letterSpacing:'1px',
              boxShadow: `0 4px 16px ${ACCENT2}44`
            }}
            onClick={handleGenerateMap}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSync className="spin" style={{marginRight:7}}/>
                Generating...
              </>
            ) : (
              <>
                <FaMapMarkedAlt style={{marginRight:7}}/>
                Generate Map
              </>
            )}
          </motion.button>
        </div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            style={{
              background:'linear-gradient(120deg,#222847 80%,#00c9a71b 100%)',
              color:'#e0eaff',
              borderRadius:'1.15em',
              boxShadow:`0 4px 20px #00c9a736`,
              margin:"2.5em auto 0 auto",
              padding:"34px 24px 18px 24px",
              maxWidth:520
            }}
          >
            <div style={{textAlign:"center",fontSize:"1.27em",fontWeight:700,marginBottom:5}}>
              <FaSatellite style={{color:ACCENT4,marginRight:8}}/>
              Hotspot Analysis Result
            </div>
            <hr style={{margin:"12px 0",opacity:0.2}} />
            <div style={{marginBottom:10}}>
              <FaMapPin style={{color:ACCENT1,marginRight:8}}/>
              <b>Latitude:</b> <span style={{color:ACCENT1}}>{result.location?.latitude}</span>
            </div>
            <div style={{marginBottom:10}}>
              <FaSearchLocation style={{color:ACCENT2,marginRight:8}}/>
              <b>Longitude:</b> <span style={{color:ACCENT2}}>{result.location?.longitude}</span>
            </div>
            <div style={{marginBottom:10}}>
              <FaGlobe style={{color:ACCENT4,marginRight:8}}/>
              <b>Search Radius:</b> <span style={{color:ACCENT4,fontWeight:600}}>{result.search_radius_km} km</span>
            </div>
            <div style={{marginBottom:10}}>
              <FaExclamationCircle style={{color:ACCENT3,marginRight:8}}/>
              <b>Status:</b> <span style={{color:ACCENT3}}>{result.status}</span>
            </div>
            <div style={{marginBottom:9}}>
              <FaRegClock style={{color:"#7f53ac",marginRight:8}}/>
              <b>Timestamp:</b> <span style={{color:"#7f53ac"}}>{result.timestamp}</span>
            </div>
            <div style={{marginTop:18,marginBottom:7,fontWeight:700}}>
              <FaMapMarkedAlt style={{color:ACCENT2,marginRight:8}}/>
              Hotspot Details:
            </div>
            <motion.pre
              initial={{scale:0.97,opacity:0}}
              animate={{scale:1,opacity:1}}
              transition={{duration:0.6}}
              style={{
                background:'#191f2c',
                color:'#43f7b2',
                padding:'14px',
                borderRadius:8,
                fontSize:'0.99em',
                boxShadow:`0 1px 7px ${ACCENT1}14`
              }}>
              {JSON.stringify(result.hotspot_analysis, null, 2)}
            </motion.pre>
          </motion.div>
        )}

        {/* Interactive Map */}
        {showMap && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            style={{marginTop:"2.2em"}}
          >
            <div style={{textAlign:"center",fontWeight:700,fontSize:"1.17em",marginBottom:10}}>
              <FaMapMarkedAlt style={{color:ACCENT2,marginRight:8}}/>
              Interactive Hotspot Map
            </div>
            <iframe
              src={mapUrl}
              title="Hotspot Map"
              width="100%"
              height="500px"
              style={{ border: "2px solid #232850", borderRadius: "16px",boxShadow:"0 2px 18px #23294a77" }}
            ></iframe>
          </motion.div>
        )}
      </motion.div>
      {/* Extra spin animation for the loader icon */}
      <style>{`
        .spin { animation: spin 0.9s infinite linear;}
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
