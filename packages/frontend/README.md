# Frontend package

Reusable UI foundation for product React apps and AI React apps.

## Layers

```text
React app
  Product components / AI components
  shadcn/ui / AI elements
  Radix UI
  Tailwind CSS
  Design tokens
  Client themes
```

## What belongs here

- `src/tokens`: base tokens, client themes, and CSS variable helpers.
- `src/components/ui`: shadcn/ui-style source components built on Radix UI and Tailwind classes.
- `src/components/product`: reusable product UI components that can wrap or compose shadcn/ui.
- `src/components/ai-elements`: AI Elements-style source components for chat, messages, and prompt workflows.
- `src/components/ai`: CSS-backed starter AI components for apps that have not enabled Tailwind yet.
- `src/styles.css`: shared CSS variable defaults and starter component styles.
- `src/tailwind-preset.ts`: Tailwind token bridge for shadcn/ui-compatible colors.
- `components.json`: shadcn/ui registry configuration for this package.

## Usage

Import shared CSS once in the app entrypoint:

```ts
import "@ai-infused-projects/frontend/styles.css";
```

Apply a client theme at runtime:

```ts
import { applyTheme, clientATheme } from "@ai-infused-projects/frontend";

applyTheme(clientATheme);
```

Use components from the package:

```tsx
import { Button, PromptBox, ResponsePanel, ShadcnButton } from "@ai-infused-projects/frontend";
```

Use AI Elements-style components when the app has Tailwind enabled:

```tsx
import {
  Conversation,
  ConversationContent,
  Message,
  MessageContent,
  MessageResponse,
  PromptForm,
  PromptInput,
  PromptSubmit,
} from "@ai-infused-projects/frontend";
```

For Tailwind apps, extend the app config with the package preset:

```ts
import frontendPreset from "@ai-infused-projects/frontend/tailwind-preset";

export default {
  presets: [frontendPreset],
  content: ["./src/**/*.{ts,tsx}", "../../packages/frontend/src/**/*.{ts,tsx}"],
};
```
