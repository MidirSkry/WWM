import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WWMCalculator from "./wwm-calculator.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WWMCalculator />
  </StrictMode>
);
