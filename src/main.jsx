import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tailwind.css";
import "./styles/main.css";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { PricingProvider } from "./context/SubscriptionPricing";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <PricingProvider>
        <App />
      </PricingProvider>
    </ThemeProvider>
  </StrictMode>
);
