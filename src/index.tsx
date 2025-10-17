import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Register all Bs* controls globally
import "./globals/globalControls";

import { BsToastProvider } from "./components/controls/basecontrol/BsToast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BsToastProvider>
      <App />
    </BsToastProvider>
  </React.StrictMode>
);
