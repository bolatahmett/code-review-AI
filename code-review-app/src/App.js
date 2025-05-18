import React, { useState } from "react";
import "./App.css";

function App() {
  const [folderPath, setFolderPath] = useState("");
  const [reviews, setReviews] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRunReview = async () => {
    setStatus("Running review...");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderPath }),
      });

      if (!response.ok) throw new Error("Failed to get review");

      const data = await response.json();
      setReviews({
        architecture: data.architecture_review,
        security: data.security_review,
        product: data.product_owner_review,
      });
      setStatus("Review complete.");
    } catch (error) {
      setStatus("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Code Review Tool</h1>
      <input
        type="text"
        placeholder="Enter folder path"
        value={folderPath}
        onChange={(e) => setFolderPath(e.target.value)}
      />
      <button onClick={handleRunReview}>Run Review</button>

      {loading && <div className="spinner" />}

      <p>{status}</p>

      {reviews && (
        <div className="reviews">
          <h2>Architecture Review</h2>
          <pre>{reviews.architecture}</pre>

          <h2>Security Review</h2>
          <pre>{reviews.security}</pre>

          <h2>Product Owner Review</h2>
          <pre>{reviews.product}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
