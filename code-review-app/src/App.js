import React, { useState } from "react";
function App() {
  const [folderPath, setFolderPath] = useState("");
  const [diff, setDiff] = useState("");
  const [reviews, setReviews] = useState({
    architecture: "",
    security: "",
    productOwner: ""
  });
  const [userFeedback, setUserFeedback] = useState("");
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
      setDiff(data.diff);
      setReviews(data.reviews);
      setStatus("Review complete.");
      setLoading(false);
    } catch (error) {
      setStatus("Error: " + error.message);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Code Review App</h1>

      <div>
        <label>
          Folder Path:{" "}
          <input
            type="text"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            style={{ width: 300 }}
            placeholder="C:/path/to/your/project"
          />
        </label>
        <button onClick={handleRunReview} style={{ marginLeft: 10 }} disabled={!folderPath || loading}>
          Run Review
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Git Diff</h3>
        <pre style={{ backgroundColor: "#f0f0f0", padding: 10 }}>
          {diff || "Diff output will appear here..."}
        </pre>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Review Comments</h3>
        <div>
          <strong>Architecture:</strong>
          <p>{reviews.architecture || "-"}</p>
        </div>
        <div>
          <strong>Security:</strong>
          <p>{reviews.security || "-"}</p>
        </div>
        <div>
          <strong>Product Owner:</strong>
          <p>{reviews.productOwner || "-"}</p>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>User Feedback</h3>
        <textarea
          rows={4}
          cols={50}
          value={userFeedback}
          onChange={(e) => setUserFeedback(e.target.value)}
          placeholder="Your comments..."
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => alert("Feedback submitted!")}
          disabled={!userFeedback.trim()}
        >
          Submit Feedback
        </button>
      </div>

      <div style={{ marginTop: 10, fontStyle: "italic", color: "gray" }}>
        {status}
      </div>
    </div>
  );
}

export default App;
