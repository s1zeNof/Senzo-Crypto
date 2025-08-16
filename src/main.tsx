// src/main.tsx
import { Buffer } from 'buffer'; // <-- ДОДАЙТЕ ЦЕЙ РЯДОК
window.Buffer = Buffer; // <-- І ЦЕЙ РЯДОК

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)