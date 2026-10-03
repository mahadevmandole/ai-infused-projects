import type { FormEvent } from "react";
import { Button, Input } from "@ai-infused-projects/frontend";

interface WebsiteUrlFormProps {
  loading: boolean;
  onBlur: () => void;
  onChange: (value: string) => void;
  onClear: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  showError: boolean;
  urlError: string;
  value: string;
}

export function WebsiteUrlForm({
  loading,
  onBlur,
  onChange,
  onClear,
  onSubmit,
  showError,
  urlError,
  value,
}: WebsiteUrlFormProps) {
  return (
    <form className="grid gap-3 rounded-lg border border-border bg-card p-4" onSubmit={onSubmit}>
      <label className="grid gap-2 text-sm font-medium" htmlFor="website-url">
        Website URL
        <Input
          aria-invalid={showError}
          id="website-url"
          onBlur={onBlur}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://example.com"
          type="url"
          value={value}
        />
      </label>

      {showError ? <p className="text-sm text-destructive">{urlError}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button disabled={loading} type="submit">
          {loading ? "Summarizing..." : "Summarize"}
        </Button>
        <Button onClick={onClear} type="button" variant="outline">
          Clear
        </Button>
      </div>
    </form>
  );
}
