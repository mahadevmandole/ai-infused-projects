import { useState } from "react";

import { buildApiUrl } from "../../utils/config";
import { BattleModelCard, type BattleModelOption, type BattlePromptStatus } from "../molecules";

const modelOptions: BattleModelOption[] = [
  { label: "Mock Model", value: "mock:mock-model" },
  { label: "OpenAI GPT-4o Mini", value: "openai:gpt-4o-mini" },
  { label: "Gemini 3.8 Flash", value: "gemini:gemini-3.8-flash" },
  { label: "Groq Llama 3.3 70B Versatile", value: "groq:llama-3.3-70b-versatile" },
];

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
    model: "mock:mock-model",
    status: "ready",
    votes: 0,
  },
  right: {
    model: "gemini:gemini-3.8-flash",
    status: "ready",
    votes: 0,
  },
};

async function askBattleModels(prompt: string, models: string[]) {
  const result = await fetch(buildApiUrl("/api/battle"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ models, prompt }),
  });

  if (!result.ok) {
    const detail = await result.text();
    throw new Error(detail || "Model request failed.");
  }

  return (await result.json()) as { answers: Record<string, string> };
}

export function ModelBattleWorkspace() {
  const [lanes, setLanes] = useState(initialLaneState);
  const [sharedPrompt, setSharedPrompt] = useState("");
  const [votedLane, setVotedLane] = useState<LaneKey | null>(null);

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

      setLanes((current) => ({
        left: {
          ...current.left,
          answer: response.answers[leftModel] ?? "No answer returned.",
          prompt: trimmedPrompt,
          status: "ready",
        },
        right: {
          ...current.right,
          answer: response.answers[rightModel] ?? "No answer returned.",
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

  const voteForLane = (lane: LaneKey) => {
    if (votedLane) {
      return;
    }

    setVotedLane(lane);
    setLanes((current) => ({
      ...current,
      [lane]: {
        ...current[lane],
        votes: current[lane].votes + 1,
      },
    }));
  };

  const isSubmitting = lanes.left.status === "submitted" || lanes.right.status === "submitted";

  return (
    <div className="grid gap-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <label className="mb-2 block text-sm font-medium">Shared prompt</label>
        <textarea
          className="min-h-28 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-0 placeholder:text-muted-foreground"
          disabled={isSubmitting}
          onChange={(event) => setSharedPrompt(event.target.value)}
          placeholder="Ask both models the same question..."
          value={sharedPrompt}
        />
        <div className="mt-3 flex justify-end">
          <button
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting || !sharedPrompt.trim()}
            onClick={submitSharedPrompt}
            type="button"
          >
            {isSubmitting ? "Sending..." : "Compare answers"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BattleModelCard
          answer={lanes.left.answer}
          disabled={lanes.left.status === "submitted"}
          error={lanes.left.error}
          model={lanes.left.model}
          models={modelOptions}
          onModelChange={(model) => updateLane("left", { model })}
          onSubmit={() => undefined}
          onVote={() => voteForLane("left")}
          prompt={lanes.left.prompt}
          showPromptInput={false}
          sideLabel="Model A"
          status={lanes.left.status}
          voteCount={lanes.left.votes}
          voted={votedLane === "left"}
        />
        <BattleModelCard
          answer={lanes.right.answer}
          disabled={lanes.right.status === "submitted"}
          error={lanes.right.error}
          model={lanes.right.model}
          models={modelOptions}
          onModelChange={(model) => updateLane("right", { model })}
          onSubmit={() => undefined}
          onVote={() => voteForLane("right")}
          prompt={lanes.right.prompt}
          showPromptInput={false}
          sideLabel="Model B"
          status={lanes.right.status}
          voteCount={lanes.right.votes}
          voted={votedLane === "right"}
        />
      </div>
    </div>
  );
}
