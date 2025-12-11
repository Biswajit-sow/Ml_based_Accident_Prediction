import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaRedoAlt,
  FaMapMarkerAlt,
  FaExclamationCircle,
  FaMapMarkedAlt,
  FaArrowLeft,
  FaMap
} from "react-icons/fa";
import { motion } from "framer-motion";

// Accent colors
const ACCENT1 = "#00c9a7"; // teal
const ACCENT2 = "#7f53ac"; // violet
const ACCENT3 = "#f84070"; // pink/red

// Risk color helper
function getRiskStyle(risk) {
  if (risk === "HIGH") return { color: ACCENT3, fontWeight: 700 };
  if (risk === "MEDIUM") return { color: "#ffc107", fontWeight: 700 };
  return { color: ACCENT1, fontWeight: 700 };
}

export default function HotspotResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  if (!result) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", background: "linear-gradient(115deg,#23292f 20%,#232850 100%)" }}>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          style={{
            maxWidth: 440,
            margin: "auto",
            background: "linear-gradient(120deg,#23294a 80%, #7f53ac30 100%)",
            borderRadius: "1.7rem",
            boxShadow: "0 6px 38px #0004",
            padding: "2.7rem 2.2rem",
            textAlign: "center"
          }}>
          <div style={{ fontSize: "1.35rem", fontWeight: 700, color: ACCENT3, marginBottom: 10 }}>
            <FaExclamationCircle style={{ marginRight: 8, color: "#ffc107", fontSize: 30, verticalAlign: "middle" }} />
            No hotspot data found.
          </div>
          <button
            style={{
              marginTop: "1.5em",
              padding: "12px 40px",
              background: "linear-gradient(87deg,#0099FF 50%,#6666FF 100%)",
              border: "none",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.07em",
              borderRadius: "28px",
              letterSpacing: "1px",
              cursor: "pointer",
              boxShadow: "0 3px 16px #0099ff30"
            }}
            onClick={() => navigate("/map")}
          >
            <FaArrowLeft style={{ marginRight: 7, marginBottom: 2 }} />
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  const { nearby_hotspots, map_image_url } = result;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(115deg,#23292f 18%,#232850 100%)", paddingTop: "40px" }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        style={{
          maxWidth: 820,
          margin: "auto",
          borderRadius: "1.5rem",
          background: "linear-gradient(130deg,#23294a 0%,#232850 90%)",
          boxShadow: "0 12px 38px 0 rgba(0,153,255,0.10)",
          overflow: "hidden"
        }}>
        <div
          style={{
            background: "linear-gradient(87deg,#00c9a7 60%,#7f53ac 100%)",
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
            fontWeight: "700",
            fontSize: "1.7rem",
            textAlign: "center",
            color: "#fff",
            letterSpacing: "1.2px",
            boxShadow: "0 1px 12px #00ffaa22",
            padding: "1.15rem 0"
          }}>
          <FaMapMarkedAlt style={{ marginRight: 14, fontSize: "1.5em", verticalAlign: "-3px" }} />
          Hotspot Analysis Result
        </div>

        <div style={{ padding: "2.5rem 2.22rem", textAlign: "center" }}>
          {map_image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              style={{ marginBottom: "1.5em" }}>
              <img
                src={`data:image/png;base64,${map_image_url}`}
                alt="Hotspot Map"
                style={{ borderRadius: "1rem", maxHeight: "400px", boxShadow: "0 2px 26px #0099ff19", width: "100%", maxWidth: 700 }}
              />
            </motion.div>
          )}

          <div style={{ fontWeight: 700, fontSize: "1.21em", color: ACCENT2, marginTop: map_image_url ? '2.1em' : 0, marginBottom: "0.8em", letterSpacing:"1px" }}>
            <FaMap style={{marginRight:8, color:ACCENT2, verticalAlign:"-3px"}}/>
            Nearby Accident Hotspots
          </div>
          <div style={{marginBottom:"1.4em", color:"#a2b0ea", fontSize:"1em"}}>
            (within specified radius)
          </div>

          {nearby_hotspots && nearby_hotspots.length > 0 ? (
            <motion.div style={{maxWidth:650,margin:"auto"}}>
              {nearby_hotspots.map((hotspot, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.01 * index, duration: 0.44, type: "spring" }}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderLeft: `6px solid ${
                      hotspot.risk_level === "HIGH"
                        ? ACCENT3
                        : hotspot.risk_level === "MEDIUM"
                        ? "#ffc107"
                        : ACCENT1
                    }`,
                    borderRadius: "1em",
                    boxShadow: "0 2px 12px #00c9a70a",
                    marginBottom: "1.13em",
                    padding: "1em 1.3em 1em 1.1em",
                    textAlign: "left",
                    fontWeight:500,
                    display:"flex",
                    gap:10,
                    alignItems:"center"
                  }}
                >
                  <span style={{fontSize:"1.32em",verticalAlign:"-3px"}}>
                    <FaMapMarkerAlt color={
                      hotspot.risk_level === "HIGH"
                        ? ACCENT3
                        : hotspot.risk_level === "MEDIUM"
                        ? "#ffc107"
                        : ACCENT1
                    } />
                  </span>
                  <span>
                    <span style={{fontWeight:700, fontSize:"1.09em", letterSpacing:"0.2px"}}>
                      {hotspot.location_name}
                    </span>
                    <span style={{color:"#a0aae4",fontWeight:500}}>
                      {" "}(Region: {hotspot.region})
                    </span>
                    <br />
                    <span style={{color:"#7b828a",fontSize:"0.97em",fontWeight:600}}>
                      Accidents:{" "}
                      <span style={{
                        color:hotspot.risk_level==="HIGH"?ACCENT3:
                              hotspot.risk_level==="MEDIUM"?"#ffc107":ACCENT1,
                        fontWeight:700
                      }}>
                        {hotspot.accident_count}
                      </span>
                      {" "} | Risk:{" "}
                      <span style={getRiskStyle(hotspot.risk_level)}>{hotspot.risk_level}</span>
                    </span>
                  </span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div style={{ color: "#abb6c2", fontWeight: "500", marginTop: "2.1em" }}>
              <FaExclamationTriangle style={{color:"#ffc107",fontSize:22,marginRight:7,verticalAlign:"-3px"}} />
              No major hotspots found in this area.
            </div>
          )}

          <div style={{ marginTop: "2.3em" }}>
            <motion.button
              whileHover={{
                background: "linear-gradient(87deg,#0099FF 60%,#00ffaa 100%)",
                scale:1.04
              }}
              whileTap={{scale:0.96}}
              style={{
                background: "linear-gradient(87deg,#0099FF 60%,#00ffaa 100%)",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "2em",
                padding: "0.7em 2.5em",
                fontSize: "1.13em",
                boxShadow: "0 2px 12px 0 rgba(0,153,255,0.22)",
                border: "none",
                cursor: "pointer",
                letterSpacing: "1px"
              }}
              onClick={() => navigate("/map")}
            >
              <FaRedoAlt style={{ marginRight: 10, marginBottom: 2 }} />
              Try Another Analysis
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
