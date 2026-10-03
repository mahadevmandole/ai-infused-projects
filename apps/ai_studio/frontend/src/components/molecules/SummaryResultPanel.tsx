import {
  Button,
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  Message,
  MessageContent,
  MessageResponse,
} from "@ai-infused-projects/frontend";

interface SummaryResultPanelProps {
  answer?: string;
  onClear: () => void;
}

export function SummaryResultPanel({ answer, onClear }: SummaryResultPanelProps) {
  return (
    <section className="min-h-64 rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Summary</h2>
        <Button onClick={onClear} size="sm" type="button" variant="ghost">
          Clear
        </Button>
      </div>

      <Conversation className="min-h-48">
        <ConversationContent className="gap-4 p-0">
          {answer ? (
            <Message from="assistant">
              <MessageContent>
                <MessageResponse>{answer}</MessageResponse>
              </MessageContent>
            </Message>
          ) : (
            <p className="text-sm text-muted-foreground">The summary response will appear here.</p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    </section>
  );
}
