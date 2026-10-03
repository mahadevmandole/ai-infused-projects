import { useCallback, useEffect, useState } from "react";

import type { BattleModelOption } from "../components/molecules";
import { fetchAvailableModels } from "./battle";

export function useAvailableModels() {
  const [availableModels, setAvailableModels] = useState<BattleModelOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadAvailableModels = useCallback(async () => {
    setIsLoading(true);

    try {
      setAvailableModels(await fetchAvailableModels());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAvailableModels();
  }, [loadAvailableModels]);

  return { availableModels, isLoading, loadAvailableModels };
}
