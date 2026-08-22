import type { ComponentType } from "react";

import { ModelBattlePage } from "../screens/ModelBattlePage";
import { SummarizerPage } from "../screens/SummarizerPage";

export interface AppRoute {
  element: ComponentType;
  label: string;
  path: string;
}

export const appRoutes: AppRoute[] = [
  {
    element: SummarizerPage,
    label: "Summerizer",
    path: "/summarizer",
  },
  {
    element: ModelBattlePage,
    label: "Model Battle",
    path: "/model-battle",
  },
];

export const defaultRoute = appRoutes[0].path;
