import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerServiceWorker } from "./registerSW";

// Register service worker for PWA capabilities
registerServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
