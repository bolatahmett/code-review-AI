import React, { useState } from "react";

function App() {
  const [folderPath, setFolderPath] = useState("");
  const [diff, setDiff] = useState("");
  const [reviews, setReviews] = useState({
    architecture: "",
    security: "",
    productOwner: "",
    devops: "",
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [useLocalOllama, setUseLocalOllama] = useState(true);
  const [openAiApiKey, setOpenAiApiKey] = useState("");

  const handleRunReview = async () => {
    setStatus("Running review...");
    setLoading(true);

    try {
      let data;

      if (useLocalOllama) {
        const response = await fetch("http://localhost:5000/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folderPath, provider: "ollama" }),
        });
        if (!response.ok) throw new Error("Local Ollama servisine bağlanılamadı.");
        data = await response.json();
      } else {
        if (!openAiApiKey) {
          throw new Error("OpenAI API anahtarı girilmemiş.");
        }

        const response = await fetch("http://localhost:5000/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folderPath,
            provider: "openai",
            apiKey: openAiApiKey,
          }),
        });
        if (!response.ok) throw new Error("OpenAI ile bağlantı başarısız.");
        data = await response.json();
      }

      setDiff(data.diff);
      setReviews(data.reviews);
      setStatus("Review complete.");
    } catch (error) {
      setStatus("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "30px auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
        padding: "20px",
        backgroundColor: "#fafafa",
        borderRadius: 8,
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 30, color: "#2c3e50" }}>
        Code Review App
      </h1>

      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 20 }}>
          <input
            type="radio"
            name="provider"
            checked={useLocalOllama}
            onChange={() => setUseLocalOllama(true)}
            style={{ marginRight: 8 }}
          />
          Local Ollama Kullan
        </label>

        <label>
          <input
            type="radio"
            name="provider"
            checked={!useLocalOllama}
            onChange={() => setUseLocalOllama(false)}
            style={{ marginRight: 8 }}
          />
          OpenAI Kullan
        </label>
      </div>

      {!useLocalOllama && (
        <div style={{ marginBottom: 15 }}>
          <label>
            OpenAI API Anahtarı:
            <input
              type="password"
              value={openAiApiKey}
              onChange={(e) => setOpenAiApiKey(e.target.value)}
              placeholder="sk-..."
              style={{
                marginLeft: 10,
                padding: "8px 12px",
                borderRadius: 5,
                border: "1px solid #ccc",
                width: "100%",
                maxWidth: 400,
                marginTop: 5,
              }}
            />
          </label>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 25,
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          value={folderPath}
          onChange={(e) => setFolderPath(e.target.value)}
          placeholder="C:/path/to/your/project"
          style={{
            flex: 1,
            padding: "10px 15px",
            fontSize: 16,
            borderRadius: 5,
            border: "1.5px solid #ddd",
            minWidth: 250,
          }}
        />

        <button
          onClick={handleRunReview}
          disabled={!folderPath || loading || (!useLocalOllama && !openAiApiKey)}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            backgroundColor: loading ? "#95a5a6" : "#3498db",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 3px 6px rgba(52,152,219,0.5)",
          }}
        >
          {loading ? "Running..." : "Run Review"}
        </button>
      </div>

      <section style={{ marginBottom: 30 }}>
        <h2 style={{ borderBottom: "2px solid #3498db", paddingBottom: 5 }}>
          Git Diff
        </h2>
        <pre
          style={{
            backgroundColor: "#1e1e1e",
            color: "#d4d4d4",
            padding: 15,
            borderRadius: 6,
            maxHeight: 300,
            overflowY: "auto",
            fontFamily: "'Source Code Pro', monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {diff || "Diff output will appear here..."}
        </pre>
      </section>

      <section>
        <h2 style={{ borderBottom: "2px solid #3498db", paddingBottom: 5 }}>
          Review Comments
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
            marginTop: 15,
          }}
        >
          {["architecture", "security", "productOwner", "devops"].map((key) => (
            <div
              key={key}
              style={{
                backgroundColor: "white",
                padding: 15,
                borderRadius: 6,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <strong style={{ fontSize: 16, color: "#2c3e50" }}>
                {key === "productOwner" ? "Product Owner" : key.charAt(0).toUpperCase() + key.slice(1)}
              </strong>
              <div
                style={{ marginTop: 8, fontSize: 14, color: "#555" }}
                dangerouslySetInnerHTML={{
                  __html: reviews[key] || "<em>Yorum yok</em>",
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <div
        style={{
          marginTop: 30,
          fontStyle: "italic",
          color: status.startsWith("Error") ? "#e74c3c" : "#777",
          textAlign: "center",
          minHeight: 20,
          fontWeight: "500",
        }}
      >
        {status}
      </div>
    </div>
  );
}

export default App;
