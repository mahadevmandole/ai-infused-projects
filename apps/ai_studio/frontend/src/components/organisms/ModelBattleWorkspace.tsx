import { useEffect, useState } from "react";

import { askBattleModels } from "../../api/battle";
import { useAvailableModels } from "../../api/useAvailableModels";
import { useVotes } from "../../api/useVotes";
import { BattleModelCard, type BattlePromptStatus } from "../molecules";

type LaneKey = "left" | "right";

interface BattleLaneState {
  answer?: string;
  error?: string;
  model: string;
  prompt?: string;
  status: BattlePromptStatus;
  votes: number;
}

const initialLaneState: Record<LaneKey, BattleLaneState> = {
  left: {
    model: "openai:gpt-4o-mini",
    status: "ready",
    votes: 0,
  },
  right: {
    model: "groq:llama-3.3-70b-versatile",
    status: "ready",
    votes: 0,
  },
};

export function ModelBattleWorkspace() {
  const [lanes, setLanes] = useState(initialLaneState);
  const [sharedPrompt, setSharedPrompt] = useState("");
  const [votedLane, setVotedLane] = useState<LaneKey | null>(null);
  const { availableModels } = useAvailableModels();
  const { castVote, voteTotals } = useVotes();

  useEffect(() => {
    if (!availableModels.length) {
      return;
    }

    const defaultLeftModel = availableModels[0]?.value ?? initialLaneState.left.model;
    const defaultRightModel = availableModels[1]?.value ?? availableModels[0]?.value ?? initialLaneState.right.model;

    setLanes((current) => ({
      left: {
        ...current.left,
        model: availableModels.some((model) => model.value === current.left.model)
          ? current.left.model
          : defaultLeftModel,
        votes: voteTotals[current.left.model] ?? current.left.votes,
      },
      right: {
        ...current.right,
        model: availableModels.some((model) => model.value === current.right.model)
          ? current.right.model
          : defaultRightModel,
        votes: voteTotals[current.right.model] ?? current.right.votes,
      },
    }));
  }, [availableModels, voteTotals]);

  useEffect(() => {
    setLanes((current) => ({
      left: { ...current.left, votes: voteTotals[current.left.model] ?? current.left.votes },
      right: { ...current.right, votes: voteTotals[current.right.model] ?? current.right.votes },
    }));
  }, [voteTotals]);

  const updateLane = (lane: LaneKey, nextState: Partial<BattleLaneState>) => {
    setLanes((current) => ({
      ...current,
      [lane]: {
        ...current[lane],
        ...nextState,
      },
    }));
  };

  const submitSharedPrompt = async () => {
    const trimmedPrompt = sharedPrompt.trim();
    if (!trimmedPrompt) {
      return;
    }

    const leftModel = lanes.left.model;
    const rightModel = lanes.right.model;

    setLanes((current) => ({
      left: {
        ...current.left,
        answer: undefined,
        error: undefined,
        prompt: trimmedPrompt,
        status: "submitted",
      },
      right: {
        ...current.right,
        answer: undefined,
        error: undefined,
        prompt: trimmedPrompt,
        status: "submitted",
      },
    }));

    try {
      const response = await askBattleModels(trimmedPrompt, [leftModel, rightModel]);
      const leftError = response.errors?.[leftModel];
      const rightError = response.errors?.[rightModel];

      setLanes((current) => ({
        left: {
          ...current.left,
          answer: leftError ? undefined : response.answers[leftModel] ?? "No answer returned.",
          error: leftError,
          prompt: trimmedPrompt,
          status: "ready",
        },
        right: {
          ...current.right,
          answer: rightError ? undefined : response.answers[rightModel] ?? "No answer returned.",
          error: rightError,
          prompt: trimmedPrompt,
          status: "ready",
        },
      }));
      setSharedPrompt(trimmedPrompt);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Model request failed.";
      setLanes((current) => ({
        left: { ...current.left, error: message, status: "error" },
        right: { ...current.right, error: message, status: "error" },
      }));
    }
  };

  const voteForLane = async (lane: LaneKey) => {
    if (votedLane) {
      return;
    }

    const selectedModel = lanes[lane].model;
    setVotedLane(lane);

    try {
      const response = await castVote(selectedModel);
      setLanes((current) => ({
        ...current,
        [lane]: {
          ...current[lane],
          votes: response.all_votes[current[lane].model] ?? 0,
        },
      }));
    } catch (error) {
      setVotedLane(null);
      const message = error instanceof Error ? error.message : "Vote could not be saved.";
      setLanes((current) => ({
        ...current,
        [lane]: {
          ...current[lane],
          error: message,
        },
      }));
    }
  };

  const isSubmitting = lanes.left.status === "submitted" || lanes.right.status === "submitted";

  return (
    <div className="grid gap-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <label className="mb-2 block text-sm font-medium">Business question</label>
        <textarea
          className="min-h-28 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 placeholder:text-muted-foreground"
          disabled={isSubmitting}
          onChange={(event) => setSharedPrompt(event.target.value)}
          placeholder="Ask both AI providers the same business question..."
          value={sharedPrompt}
        />
        <div className="mt-3 flex justify-end">
          <button
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting || !sharedPrompt.trim()}
            onClick={submitSharedPrompt}
            type="button"
          >
            {isSubmitting ? "Generating results..." : "Run comparison"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BattleModelCard
          answer={lanes.left.answer}
          disabled={lanes.left.status === "submitted"}
          error={lanes.left.error}
          model={lanes.left.model}
          models={availableModels}
          onModelChange={(model) => updateLane("left", { model, votes: voteTotals[model] ?? 0 })}
          onSubmit={() => undefined}
          onVote={() => voteForLane("left")}
          prompt={lanes.left.prompt}
          showPromptInput={false}
          sideLabel="Option A"
          status={lanes.left.status}
          voteCount={lanes.left.votes}
          voted={votedLane === "left"}
        />
        <BattleModelCard
          answer={lanes.right.answer}
          disabled={lanes.right.status === "submitted"}
          error={lanes.right.error}
          model={lanes.right.model}
          models={availableModels}
          onModelChange={(model) => updateLane("right", { model, votes: voteTotals[model] ?? 0 })}
          onSubmit={() => undefined}
          onVote={() => voteForLane("right")}
          prompt={lanes.right.prompt}
          showPromptInput={false}
          sideLabel="Option B"
          status={lanes.right.status}
          voteCount={lanes.right.votes}
          voted={votedLane === "right"}
        />
      </div>
    </div>
  );
}
