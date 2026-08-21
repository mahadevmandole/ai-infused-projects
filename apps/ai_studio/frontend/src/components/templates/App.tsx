import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  Message,
  MessageContent,
  MessageResponse,
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@ai-infused-projects/frontend";

import { useAsk } from "../../api/useAsk";

export function App() {
  const [prompt, setPrompt] = useState("What can this starter app do?");
  const { askBackend, response, loading } = useAsk();

  return (
    <main className="grid min-h-screen place-items-center bg-background p-8 text-foreground">
      <section className="grid w-full max-w-3xl gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mb-1.5 text-xs font-bold uppercase text-accent-foreground">AI Project Starter</p>
            <h1 className="text-3xl font-bold tracking-normal">Demo App</h1>
            <p className="text-sm text-muted-foreground">Webpack + React + TypeScript + Tailwind + shadcn/ui + Radix + AI Elements</p>
          </div>
          <span className="whitespace-nowrap rounded-full border border-border bg-accent px-3 py-2 text-sm text-accent-foreground">
            FastAPI + React
          </span>
        </div>

        <Conversation className="min-h-80 rounded-lg border border-border bg-card text-card-foreground">
          <ConversationContent>
            <Message from="assistant">
              <MessageContent>
                <MessageResponse>
                  {"Ask the backend a question and the answer will appear in this shared AI Elements surface."}
                </MessageResponse>
              </MessageContent>
            </Message>

            {response ? (
              <Message from="assistant">
                <MessageContent>
                  <MessageResponse>
                    {[
                      "## Answer",
                      response.answer,
                      "## Model",
                      `${response.provider} / ${response.model}`,
                      "## Retrieved context",
                      response.context,
                    ].join("\n\n")}
                  </MessageResponse>
                </MessageContent>
              </Message>
            ) : null}
          </ConversationContent>
        </Conversation>

        <PromptInput
          onSubmit={(message, event) => {
            event.preventDefault();
            void askBackend(message.text);
          }}
        >
          <PromptInputBody>
            <PromptInputTextarea
              aria-label="Prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask anything..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputSubmit disabled={loading || !prompt.trim()} status={loading ? "submitted" : "ready"}>
              {loading ? "Asking..." : "Ask"}
            </PromptInputSubmit>
          </PromptInputFooter>
        </PromptInput>
      </section>
    </main>
  );
}
