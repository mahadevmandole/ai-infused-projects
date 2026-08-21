import { createRoot } from "react-dom/client";
import { applyTheme, clientATheme } from "@ai-infused-projects/frontend";
import "@ai-infused-projects/frontend/styles.css";

import { App } from "./components/templates/App";
import "./styles.scss";

applyTheme(clientATheme);

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
