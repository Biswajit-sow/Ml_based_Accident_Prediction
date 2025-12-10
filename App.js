import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PredictionForm from "./components/PredictionForm";
import HotspotAnalysis from "./components/HotspotAnalysis";
import ResultPage from "./components/ResultPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">AI Traffic Prediction</Link>
          <div>
            <Link className="btn btn-outline-light me-2" to="/">Predict</Link>
            <Link className="btn btn-warning" to="/hotspot-analysis">Hotspot Map</Link>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<PredictionForm />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/hotspot-analysis" element={<HotspotAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App;
