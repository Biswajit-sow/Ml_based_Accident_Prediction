import React from "react";
import { FaCheckCircle, FaExclamationTriangle, FaExclamationOctagon, FaHeartbeat } from "react-icons/fa";

// Accent colors
const RISK_COLORS = {
  LOW: { color: "#31c36c", shadow: "#1ed27c30", bg: "linear-gradient(90deg,#d9fff0,#bbf6df 100%)" },
  MEDIUM: { color: "#f5ae34", shadow: "#f5ae3430", bg: "linear-gradient(90deg,#fff4d2,#ffe6a1 100%)" },
  HIGH: { color: "#e75151", shadow: "#e7515136", bg: "linear-gradient(90deg,#ffdada,#fbb9b9 100%)" }
};

const ICONS = {
  LOW: <FaCheckCircle style={{color: RISK_COLORS.LOW.color, fontSize:"2.05em", marginRight:12, filter:`drop-shadow(0 2px 8px ${RISK_COLORS.LOW.shadow})`}} />,
  MEDIUM: <FaExclamationTriangle style={{color: RISK_COLORS.MEDIUM.color, fontSize:"2.05em", marginRight:12, filter:`drop-shadow(0 2px 8px ${RISK_COLORS.MEDIUM.shadow})`}} />,
  HIGH: <FaExclamationOctagon style={{color: RISK_COLORS.HIGH.color, fontSize:"2.05em", marginRight:12, filter:`drop-shadow(0 2px 8px ${RISK_COLORS.HIGH.shadow})`}} />
};

function ResultCard({ data }) {
  // Defensive destructuring for backend structure
  const prediction = data.prediction_summary || {};
  const risk = data.combined_risk || {};
  const input_summary = data.input_summary || {};

  // Use correct field keys from backend response!
  const severity = prediction.severity || "Unknown";
  const probability = prediction.ml_probability ?? 0;
  const risk_level = prediction.ml_risk_level || "LOW";
  const recommendation = risk.ml_recommendation || "No recommendation";
  const rc = RISK_COLORS[risk_level] || RISK_COLORS.LOW;
  const icon = ICONS[risk_level] || ICONS.LOW;

  return (
    <div style={{
      borderRadius:"1.1em",
      overflow:"hidden",
      marginTop:"1.5em",
      boxShadow:`0 4px 18px ${rc.shadow}`,
      background:rc.bg,
      transition:'box-shadow 0.23s'
    }}
    className="fade-in-anim"
    >
      <div style={{
        background: `linear-gradient(90deg, ${rc.color} 15%, #26274f 100%)`,
        color: "#fff",
        fontWeight: 700,
        fontSize: "1.22rem",
        letterSpacing: "1px",
        padding: "0.69em 1em",
        display: "flex",
        alignItems: "center",
        borderTopLeftRadius:"1.1em",
        borderTopRightRadius:"1.1em"
      }}>
        <FaHeartbeat style={{fontSize:"1.3em", marginRight:8, color:rc.bg, filter:`drop-shadow(0 0 6px ${rc.color}90)`}} />
        Risk Level:
        <span
          style={{
            background: "#fff1",
            color: "#fff",
            fontWeight:"700",
            fontSize:"1.08rem",
            marginLeft:"12px",
            borderRadius:"1.5em",
            padding:"0.33em 1.15em"
          }}
        >
          {risk_level} ({severity})
        </span>
      </div>
      <div style={{
        padding:"2.2em 1.5em 1.4em 1.5em",
        fontSize: "1.09rem"
      }}>
        <div style={{
          display: "flex", alignItems: "center", marginBottom:"0.8em"
        }}>
          {icon}
          <span style={{fontWeight:650, color: rc.color, fontSize:"1.22em"}}>
            {risk_level} RISK
          </span>
        </div>
        <div style={{marginBottom:"0.3em"}}>
          <strong>Probability:</strong>{" "}
          <span style={{color: rc.color, fontWeight:700, fontSize:"1.1em"}}>
            {(probability * 100).toFixed(2)}%
          </span>
        </div>
        <div style={{marginBottom:"0.8em"}}>
          <strong>Recommendation:</strong> <span style={{color:"#222",fontWeight:500}}>{recommendation}</span>
        </div>
        <hr style={{margin:"1em 0", opacity:0.15}} />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.4em 1.4em"}}>
          <div>
            <strong>Time:</strong> <span style={{color:"#222c",fontWeight:500}}>{input_summary.time}</span>
          </div>
          <div>
            <strong>Weather:</strong> <span style={{color:"#222c",fontWeight:500}}>{input_summary.weather}</span>
          </div>
          <div>
            <strong>Location:</strong> <span style={{color:"#222c",fontWeight:500}}>{input_summary.location}</span>
          </div>
          <div>
            <strong>Driver Experience:</strong> <span style={{color:"#222c",fontWeight:500}}>{input_summary.driver_experience}</span>
          </div>
        </div>
      </div>
      <style>
        {`
          .fade-in-anim {
            animation:fadein .8s cubic-bezier(.3,.6,.4,1);
          }
          @keyframes fadein {
            from { opacity:0; transform:translateY(30px);}
            to { opacity:1; transform:none;}
          }
        `}
      </style>
    </div>
  );
}

export default ResultCard;
