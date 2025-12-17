import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary";

console.log("🚀 LionLink starting...");

try {
  const rootElement = document.getElementById("root");
  console.log("Root element:", rootElement);

  if (!rootElement) {
    throw new Error("Root element not found!");
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  console.log("✅ React mounted successfully");
} catch (error) {
  console.error("❌ Fatal error during mount:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: system-ui;">
      <h1 style="color: red;">App Failed to Load</h1>
      <p>${error}</p>
      <p style="font-size: 12px; color: #666;">Check the browser console for details</p>
    </div>
  `;
}