import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaExclamationCircle,
  FaCheckCircle,
  FaArrowLeft,
  FaRedoAlt,
  FaChartBar
} from "react-icons/fa";

// Color palette
const ACCENT1 = "#00c9a7"; // teal (low)
const ACCENT2 = "#ffc107"; // yellow (medium)
const ACCENT3 = "#f84070"; // red (high)
const CARD_BG = "linear-gradient(130deg, #23294a 0%, #232850 90%)";
const HEADER_GRAD = "linear-gradient(90deg, #00c9a7 60%, #7f53ac 100%)";

function getRiskDetails(risk_level, probability) {
  if (risk_level === "HIGH") {
    return {
      color: ACCENT3,
      label: "HIGH RISK",
      message: (
        <span>
          <span style={{ color: ACCENT3, fontWeight: "bold" }}>High Risk:</span> There is a significant likelihood of a severe or fatal accident (<strong>{(probability * 100).toFixed(2)}%</strong>). Please consider postponing travel or taking extreme precautions!
        </span>
      ),
      icon: (
        <FaExclamationTriangle
          style={{
            color: ACCENT3,
            fontSize: "2.4rem",
            marginBottom: 4,
            filter: "drop-shadow(0 2px 16px #f8407040)"
          }}
        />
      )
    };
  }
  if (risk_level === "MEDIUM") {
    return {
      color: ACCENT2,
      label: "MEDIUM RISK",
      message: (
        <span>
          <span style={{ color: ACCENT2, fontWeight: "bold" }}>Medium Risk:</span> There is a moderate possibility of a serious accident (<strong>{(probability * 100).toFixed(2)}%</strong>). Please exercise caution and stay alert.
        </span>
      ),
      icon: (
        <FaExclamationCircle
          style={{
            color: ACCENT2,
            fontSize: "2.4rem",
            marginBottom: 4,
            filter: "drop-shadow(0 2px 16px #ffc10740)"
          }}
        />
      )
    };
  }
  return {
    color: ACCENT1,
    label: "LOW RISK",
    message: (
      <span>
        <span style={{ color: ACCENT1, fontWeight: "bold" }}>Low Risk:</span> Conditions are generally safe with a low likelihood (<strong>{(probability * 100).toFixed(2)}%</strong>) of a severe accident.
      </span>
    ),
    icon: (
      <FaCheckCircle
        style={{
          color: ACCENT1,
          fontSize: "2.4rem",
          marginBottom: 4,
          filter: "drop-shadow(0 2px 16px #00c9a740)"
        }}
      />
    )
  };
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  if (!result || !result.prediction_summary) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(115deg,#23292f 20%,#232850 100%)"
        }}
      >
        <div
          style={{
            maxWidth: 440,
            background: "linear-gradient(120deg,#23294a 80%, #7f53ac30 100%)",
            borderRadius: "1.7rem",
            boxShadow: "0 6px 38px #0004",
            padding: "2.7rem 2.2rem",
            textAlign: "center"
          }}
        >
          <div
            style={{
              fontSize: "1.39rem",
              fontWeight: 700,
              color: ACCENT3,
              marginBottom: 8
            }}
          >
            <FaExclamationCircle
              style={{
                marginRight: 7,
                color: ACCENT2,
                fontSize: 32,
                verticalAlign: "middle"
              }}
            />
            No prediction data found.
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
            onClick={() => navigate("/")}
          >
            <FaArrowLeft style={{ marginRight: 7, marginBottom: 2 }} />
            Go Back to Prediction
          </button>
        </div>
      </div>
    );
  }

  const { ml_risk_level, ml_probability } = result.prediction_summary;
  const riskDetails = getRiskDetails(ml_risk_level, ml_probability);
  const input_summary = result.input_summary || {};

  // Now, input_summary contains your input fields.
  // You can add/remove/rename the mapping below to reflect your expected inputs
  const inputFields = [
    { label: "Date & Time", value: input_summary.time },
    { label: "Weather", value: input_summary.weather },
    { label: "Location", value: input_summary.location },
    { label: "Driver Experience", value: input_summary.driver_experience },
    { label: "State", value: input_summary.state },
    { label: "City", value: input_summary.city },
    { label: "Road Type", value: input_summary.road_type },
    { label: "Road Condition", value: input_summary.road_condition },
    { label: "Vehicle Type", value: input_summary.vehicle_type },
    { label: "Driver Age", value: input_summary.driver_age },
    { label: "Speed", value: input_summary.driver_speed_habit },
    { label: "Alcohol", value: input_summary.alcohol_flag === 1 ? "Yes" : "No" }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(115deg,#23292f 20%,#232850 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start"
      }}
    >
      <div
        style={{
          maxWidth: 700,
          width: "100%",
          margin: "0 auto",
          marginTop: "46px"
        }}
      >
        <div
          style={{
            borderRadius: "1.5rem",
            background: CARD_BG,
            boxShadow: "0 12px 32px 0 rgba(0,153,255,0.10)",
            position: "relative",
            animation: "fadein .8s cubic-bezier(0.5,0,0.1,1)",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div
            style={{
              background: HEADER_GRAD,
              borderTopLeftRadius: "1.5rem",
              borderTopRightRadius: "1.5rem",
              fontWeight: "700",
              fontSize: "1.7rem",
              letterSpacing: "1px",
              textAlign: "center",
              padding: "1.12rem 0",
              color: "#fff",
              boxShadow: "0 1px 12px #00ffaa22"
            }}
          >
            <FaChartBar
              style={{
                marginRight: 11,
                verticalAlign: -4,
                fontSize: "1.8rem",
                filter: "drop-shadow(0 0 8px #00ffaa)"
              }}
            />
            Prediction Result
          </div>
          <div style={{ padding: "2.3rem 1.9rem 2.1rem 1.9rem" }}>
            {/* Icon and badge */}
            <div style={{ textAlign: "center", marginBottom: "1.3rem" }}>
              {riskDetails.icon}
              <span
                style={{
                  background: `linear-gradient(95deg, #232850 30%, ${riskDetails.color} 90%)`,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.12rem",
                  padding: "0.45em 1.3em",
                  borderRadius: "1em",
                  marginLeft: "10px",
                  letterSpacing: "1px",
                  boxShadow: `0 2px 12px ${riskDetails.color}30`
                }}
              >
                {riskDetails.label}
              </span>
            </div>
            {/* Summary message */}
            <div
              style={{
                marginBottom: "1.8em",
                fontSize: "1.08em",
                textAlign: "center",
                color: riskDetails.color,
                fontWeight: 600
              }}
            >
              {riskDetails.message}
            </div>
            {/* Input summary grid */}
            <div
              style={{
                margin: "auto",
                marginBottom: "0.5rem",
                background: "#14172d",
                borderRadius: 14,
                color: "#e0eaff",
                fontWeight: 500,
                fontSize: "1.07em",
                padding: "1.1em 1.27em 1.3em 1.27em",
                boxShadow: "0 1px 12px #00c9a755",
                maxWidth: 540,
                minWidth: 240
              }}
            >
              <div style={{
                marginBottom: 10,
                color: riskDetails.color,
                fontWeight: "bold",
                fontSize: "1.15em"
              }}>
                Prediction Inputs:
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.4em 1.1em"
                }}
              >
                {inputFields
                  .filter(f => f.value !== undefined && f.value !== "")
                  .map((f, i) => (
                    <div key={i} style={{ marginBottom: 5 }}>
                      <strong style={{
                        color: "#a4b7ee",
                        display: "inline-block",
                        minWidth: 120
                      }}>{f.label}:</strong>{" "}
                      <span style={{
                        color: "#fff",
                        fontWeight: 600,
                        letterSpacing: "0.5px"
                      }}>
                        {f.value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            {/* Try again button */}
            <div style={{ textAlign: "center", marginTop: "1.7em" }}>
              <button
                style={{
                  background: `linear-gradient(87deg,${riskDetails.color} 60%,#00ffaa 100%)`,
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "2em",
                  border: "none",
                  padding: "0.7em 2.5em",
                  fontSize: "1.13em",
                  boxShadow: `0 2px 12px 0 ${riskDetails.color}33`,
                  cursor: "pointer",
                  letterSpacing: "1px"
                }}
                onClick={() => navigate("/")}
              >
                <FaRedoAlt style={{ marginRight: 8, marginBottom: 2 }} />
                Try Another Prediction
              </button>
            </div>
          </div>
        </div>
        {/* Custom fade-in animation keyframes */}
        <style>
          {`
            @keyframes fadein {
              from { opacity:0; transform: translateY(45px);}
              to { opacity:1; transform: none;}
            }
          `}
        </style>
      </div>
    </div>
  );
}
