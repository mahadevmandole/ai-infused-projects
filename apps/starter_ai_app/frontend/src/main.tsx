import { createRoot } from "react-dom/client";
import { frontendSharedPlaceholder } from "@ai-infused-projects/frontend";

import { App } from "./components/templates/App";
import "./styles.scss";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App sharedText={frontendSharedPlaceholder} />);
