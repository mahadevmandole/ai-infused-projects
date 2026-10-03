import { useEffect, useState, type ComponentProps } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  Message,
  MessageContent,
  MessageResponse,
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ai-infused-projects/frontend";

import { StatusPill } from "../atoms";

export interface BattleModelOption {
  label: string;
  value: string;
}

export type BattlePromptStatus = ComponentProps<typeof PromptInputSubmit>["status"];

interface BattleModelCardProps {
  answer?: string;
  disabled?: boolean;
  error?: string;
  model: string;
  models: BattleModelOption[];
  onModelChange: (model: string) => void;
  onSubmit: (prompt: string) => void | Promise<void>;
  onVote: () => void;
  prompt?: string;
  showPromptInput?: boolean;
  sideLabel: string;
  status: BattlePromptStatus;
  voteCount: number;
  voted: boolean;
}

export function BattleModelCard({
  answer,
  disabled,
  error,
  model,
  models,
  onModelChange,
  onSubmit,
  onVote,
  prompt,
  showPromptInput = true,
  sideLabel,
  status,
  voteCount,
  voted,
}: BattleModelCardProps) {
  const selectedModel = models.find((item) => item.value === model);
  const hasResult = Boolean(answer || error);
  const [isAlertVisible, setIsAlertVisible] = useState(Boolean(error));

  useEffect(() => {
    if (!error) {
      setIsAlertVisible(false);
      return;
    }

    setIsAlertVisible(true);
    const timeoutId = window.setTimeout(() => setIsAlertVisible(false), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [error]);

  return (
    <section className="grid gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{sideLabel}</p>
          <p className="text-xs text-muted-foreground">{selectedModel?.label ?? model}</p>
        </div>
        <StatusPill tone={status === "submitted" ? "warning" : voted ? "success" : "idle"}>
          {status === "submitted" ? "Thinking" : voted ? "Voted" : `${voteCount} votes`}
        </StatusPill>
      </div>

      <Select onValueChange={onModelChange} value={model}>
        <SelectTrigger aria-label={`${sideLabel} model`}>
          <SelectValue placeholder="Choose free tier model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showPromptInput ? (
        <PromptInput
          onSubmit={({ text }) => {
            const trimmed = text.trim();
            if (!trimmed || disabled) {
              return;
            }
            return onSubmit(trimmed);
          }}
        >
          <PromptInputBody>
            <PromptInputTextarea
              disabled={disabled}
              placeholder={`Prompt ${selectedModel?.label ?? "this model"}...`}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <span className="text-xs text-muted-foreground">Enter to send</span>
            </PromptInputTools>
            <PromptInputSubmit disabled={disabled} status={status} />
          </PromptInputFooter>
        </PromptInput>
      ) : null}

      <div className="grid min-h-56 gap-3 rounded-md border border-border bg-background">
        <div>
          <p className="border-b border-border px-3 py-2 text-xs font-medium uppercase text-muted-foreground">
            Response
          </p>
          {prompt ? <p className="line-clamp-2 px-3 pt-3 text-xs text-muted-foreground">{prompt}</p> : null}
        </div>

        <Conversation className="min-h-36">
          <ConversationContent className="gap-4 p-3 pt-0">
            {answer ? (
              <Message from="assistant">
                <MessageContent>
                  <MessageResponse>{answer}</MessageResponse>
                </MessageContent>
              </Message>
            ) : null}
            {error && isAlertVisible ? (
              <Alert className="relative" variant="destructive">
                <AlertTitle className="pr-7">Error</AlertTitle>
                <AlertDescription className="pr-7">{error}</AlertDescription>
                <Button
                  aria-label="Dismiss error"
                  className="absolute right-2 top-2 h-6 w-6 p-0 text-current"
                  onClick={() => setIsAlertVisible(false)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  ×
                </Button>
              </Alert>
            ) : null}
            {!hasResult ? <p className="text-sm text-muted-foreground">The response will appear here after you send a prompt.</p> : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <Button disabled={!hasResult || Boolean(voted)} onClick={onVote} type="button" variant={voted ? "secondary" : "outline"}>
        {voted ? "Vote recorded" : "Vote for this response"}
      </Button>
    </section>
  );
}
