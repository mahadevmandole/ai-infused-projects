#!/usr/bin/env bash

set -e

create_structure() {

    local APP_NAME="$1"
    local APP_DIR="apps/$APP_NAME"

    log_info "Creating project structure..."

    create_dir "$APP_DIR"
    create_dir "$APP_DIR/backend"
    create_dir "$APP_DIR/backend/app"
    create_dir "$APP_DIR/backend/app/api"
    create_dir "$APP_DIR/backend/app/core"
    create_dir "$APP_DIR/backend/app/ai"
    create_dir "$APP_DIR/backend/app/ai/agents"
    create_dir "$APP_DIR/backend/app/ai/rag"
    create_dir "$APP_DIR/backend/app/ai/services"
    create_dir "$APP_DIR/backend/app/tests"

    create_dir "$APP_DIR/frontend"
    create_dir "$APP_DIR/frontend/public"
    create_dir "$APP_DIR/frontend/src"
    create_dir "$APP_DIR/frontend/src/api"
    create_dir "$APP_DIR/frontend/src/components"
    create_dir "$APP_DIR/frontend/src/components/templates"
    create_dir "$APP_DIR/frontend/src/utils"

    write_project_files "$APP_NAME" "$APP_DIR"

    log_success "Project structure created."
}

write_file() {
    local DEST="$1"
    local CONTENT="$2"

    if [ -f "$DEST" ]; then
        log_warning "Skipped existing file: $DEST"
        return
    fi

    printf "%s" "$CONTENT" >"$DEST"
    log_success "Created file: $DEST"
}

write_project_files() {
    local APP_NAME="$1"
    local APP_DIR="$2"
    local APP_TITLE="${APP_NAME//_/ }"

    write_file "$APPS_DIR/__init__.py" ""
    write_file "$APP_DIR/__init__.py" ""
    write_file "$APP_DIR/backend/__init__.py" ""
    write_file "$APP_DIR/backend/app/__init__.py" ""
    write_file "$APP_DIR/backend/app/api/__init__.py" ""
    write_file "$APP_DIR/backend/app/core/__init__.py" ""
    write_file "$APP_DIR/backend/app/ai/agents/__init__.py" ""
    write_file "$APP_DIR/backend/app/ai/rag/__init__.py" ""
    write_file "$APP_DIR/backend/app/ai/services/__init__.py" ""

    write_file "$APP_DIR/backend/.env.example" "APP_NAME=$APP_NAME
API_HOST=0.0.0.0
API_PORT=8000

# AI provider: mock, openai, groq, or gemini
AI_PROVIDER=mock
AI_TEMPERATURE=0.2
AI_MAX_OUTPUT_TOKENS=800

# OpenAI
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini

# Groq
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile

# Gemini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
"

    write_file "$APP_DIR/backend/README.md" "# Backend

FastAPI app for project-specific HTTP APIs.

Run the backend tests from the package root:

\`\`\`bash
cd apps/$APP_NAME/backend
PYTHONPATH=. uv run pytest app/tests
\`\`\`

Start the backend server:

\`\`\`bash
pnpm dev:app $APP_NAME backend
\`\`\`
"

    write_file "$APP_DIR/backend/app/core/config.py" "import os
from pathlib import Path

from dotenv import load_dotenv

from packages.ai import Settings

APP_DIR = Path(__file__).resolve().parents[2]
load_dotenv(APP_DIR / \".env\")

settings = Settings(
    app_name=os.getenv(\"APP_NAME\", \"$APP_NAME\"),
    ai_provider=os.getenv(\"AI_PROVIDER\", \"mock\").lower(),
    ai_temperature=float(os.getenv(\"AI_TEMPERATURE\", \"0.2\")),
    ai_max_output_tokens=int(os.getenv(\"AI_MAX_OUTPUT_TOKENS\", \"800\")),
    openai_api_key=os.getenv(\"OPENAI_API_KEY\"),
    openai_model=os.getenv(\"OPENAI_MODEL\", \"gpt-4.1-mini\"),
    groq_api_key=os.getenv(\"GROQ_API_KEY\"),
    groq_model=os.getenv(\"GROQ_MODEL\", \"llama-3.3-70b-versatile\"),
    gemini_api_key=os.getenv(\"GEMINI_API_KEY\"),
    gemini_model=os.getenv(\"GEMINI_MODEL\", \"gemini-2.5-flash\"),
)

__all__ = [\"settings\"]
"

    write_file "$APP_DIR/backend/app/ai/__init__.py" "from .agents.simple_agent import SimpleAgent
from .rag.simple_rag import SimpleRag

__all__ = [
    \"SimpleAgent\",
    \"SimpleRag\",
]
"

    write_file "$APP_DIR/backend/app/ai/agents/simple_agent.py" "from packages.ai import ModelClient


class SimpleAgent:
    def __init__(self, model_client: ModelClient) -> None:
        self.model_client = model_client

    def run(self, prompt: str, context: str) -> str:
        return self.model_client.generate(prompt=prompt, context=context)
"

    write_file "$APP_DIR/backend/app/ai/rag/simple_rag.py" "class SimpleRag:
    def retrieve(self, query: str) -> str:
        return f\"No vector store configured yet for query: {query}\"
"

    write_file "$APP_DIR/backend/app/ai/services/ai_service.py" "from packages.ai import build_model_client

from ...core.config import settings
from .. import SimpleAgent, SimpleRag


class AiService:
    def __init__(self) -> None:
        self.model_client = build_model_client(settings.model_config_for_provider())
        self.agent = SimpleAgent(model_client=self.model_client)
        self.rag = SimpleRag()

    def answer(self, prompt: str) -> dict[str, str]:
        context = self.rag.retrieve(prompt)
        answer = self.agent.run(prompt=prompt, context=context)
        return {
            \"answer\": answer,
            \"context\": context,
            \"provider\": settings.ai_provider,
            \"model\": self.model_client.model,
        }
"

    write_file "$APP_DIR/backend/app/api/routes.py" "from fastapi import APIRouter
from pydantic import BaseModel

from ..ai.services.ai_service import AiService

router = APIRouter()
ai_service = AiService()


class PromptRequest(BaseModel):
    prompt: str


class PromptResponse(BaseModel):
    answer: str
    context: str
    provider: str
    model: str


@router.get(\"/health\")
def health() -> dict[str, str]:
    return {\"status\": \"ok\", \"service\": \"$APP_NAME\"}


@router.post(\"/ask\")
def ask(request: PromptRequest) -> PromptResponse:
    return ai_service.answer(request.prompt)
"

    write_file "$APP_DIR/backend/app/main.py" "from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import router
from .core.config import settings

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[\"http://localhost:3000\"],
    allow_credentials=True,
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)

app.include_router(router, prefix=settings.api_prefix)
"

    write_file "$APP_DIR/backend/app/tests/test_health.py" "import importlib
import sys
from pathlib import Path

from app.main import app
from fastapi.testclient import TestClient


def test_health() -> None:
    response = TestClient(app).get(\"/api/health\")

    assert response.status_code == 200
    assert response.json()[\"status\"] == \"ok\"


def test_ask_uses_configured_model_client() -> None:
    response = TestClient(app).post(\"/api/ask\", json={\"prompt\": \"Hello\"})

    assert response.status_code == 200
    body = response.json()
    assert body[\"provider\"] == \"mock\"
    assert body[\"model\"] == \"mock-model\"
    assert \"Starter answer\" in body[\"answer\"]


def test_main_module_imports_when_backend_is_started_from_backend_directory(monkeypatch) -> None:
    backend_dir = Path(__file__).resolve().parents[2]
    monkeypatch.chdir(backend_dir)
    monkeypatch.setattr(sys, \"path\", [str(backend_dir)])

    for module_name in [\"app.main\", \"apps.$APP_NAME.backend.app.main\"]:
        sys.modules.pop(module_name, None)

    imported_main = importlib.import_module(\"app.main\")

    assert imported_main.app is not None
"

    write_file "$APP_DIR/backend/app/tests/test_shared_packages.py" "from app.ai import SimpleAgent, SimpleRag
from app.ai.services.ai_service import AiService

from packages.ai import MockModelClient, ModelConfig


def test_shared_packages_expose_core_components() -> None:
    model = MockModelClient(ModelConfig(provider=\"mock\", model=\"mock-model\"))
    agent = SimpleAgent(model_client=model)
    rag = SimpleRag()

    assert (
        agent.run(prompt=\"hello\", context=\"context\")
        == \"Starter answer for 'hello'. Retrieved context: context\"
    )
    assert rag.retrieve(\"hello\") == \"No vector store configured yet for query: hello\"

    service = AiService()
    response = service.answer(\"hello\")

    assert response[\"provider\"] == \"mock\"
    assert response[\"model\"] == \"mock-model\"
"

    write_file "$APP_DIR/frontend/README.md" "# $APP_NAME

Runnable AI project boilerplate with a FastAPI backend, shared AI package, and React + TypeScript + SCSS frontend.

## Run

\`\`\`bash
pnpm install
pnpm --filter @apps/$APP_NAME-frontend dev
\`\`\`
"

    write_file "$APP_DIR/frontend/package.json" "{
  \"name\": \"@apps/$APP_NAME-frontend\",
  \"private\": true,
  \"version\": \"0.1.0\",
  \"scripts\": {
    \"dev\": \"webpack serve --mode development\",
    \"build\": \"webpack --mode production\",
    \"typecheck\": \"tsc --noEmit\",
    \"lint\": \"eslint src --ext .ts,.tsx\"
  },
  \"dependencies\": {
    \"@ai-infused-projects/frontend\": \"workspace:*\",
    \"@types/react\": \"^18.3.31\",
    \"@types/react-dom\": \"^18.3.7\",
    \"css-loader\": \"^7.1.4\",
    \"html-webpack-plugin\": \"^5.6.7\",
    \"react\": \"^18.3.1\",
    \"react-dom\": \"^18.3.1\",
    \"sass\": \"^1.97.0\",
    \"sass-loader\": \"^16.0.6\",
    \"style-loader\": \"^2.0.0\",
    \"ts-loader\": \"^9.6.2\",
    \"typescript\": \"^5.9.3\",
    \"webpack\": \"^5.109.0\",
    \"webpack-cli\": \"^5.1.4\",
    \"webpack-dev-server\": \"^5.2.6\"
  }
}
"

    write_file "$APP_DIR/frontend/tsconfig.json" "{
  \"compilerOptions\": {
    \"target\": \"ES2020\",
    \"useDefineForClassFields\": true,
    \"lib\": [\"DOM\", \"DOM.Iterable\", \"ES2020\"],
    \"allowJs\": false,
    \"skipLibCheck\": true,
    \"esModuleInterop\": true,
    \"allowSyntheticDefaultImports\": true,
    \"strict\": true,
    \"forceConsistentCasingInFileNames\": true,
    \"module\": \"ESNext\",
    \"moduleResolution\": \"Node\",
    \"resolveJsonModule\": true,
    \"isolatedModules\": false,
    \"jsx\": \"react-jsx\"
  },
  \"include\": [\"src\"]
}
"

    write_file "$APP_DIR/frontend/webpack.config.cjs" "const HtmlWebpackPlugin = require(\"html-webpack-plugin\");
const path = require(\"path\");

module.exports = {
  entry: \"./src/main.tsx\",
  output: {
    path: path.resolve(__dirname, \"dist\"),
    filename: \"bundle.[contenthash].js\",
    clean: true,
    publicPath: \"/\",
  },
  resolve: {
    extensions: [\".tsx\", \".ts\", \".js\"],
  },
  module: {
    rules: [
      {
        test: /\\.tsx?$/,
        use: \"ts-loader\",
        exclude: /node_modules/,
      },
      {
        test: /\\.scss$/,
        use: [\"style-loader\", \"css-loader\", \"sass-loader\"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: \"./public/index.html\",
    }),
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    proxy: [
      {
        context: [\"/api\"],
        target: \"http://localhost:8000\",
      },
    ],
  },
};
"

    write_file "$APP_DIR/frontend/public/index.html" "<!doctype html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>$APP_NAME</title>
  </head>
  <body>
    <div id=\"root\"></div>
  </body>
</html>
"

    write_file "$APP_DIR/frontend/src/main.tsx" "import { createRoot } from \"react-dom/client\";
import { frontendSharedPlaceholder } from \"@ai-infused-projects/frontend\";

import { App } from \"./components/templates/App\";
import \"./styles.scss\";

const root = createRoot(document.getElementById(\"root\") as HTMLElement);
root.render(<App sharedText={frontendSharedPlaceholder} />);
"

    write_file "$APP_DIR/frontend/src/components/templates/App.tsx" "import { useState } from \"react\";

import { useAsk } from \"../../api/useAsk\";

interface AppProps {
  sharedText: string;
}

export function App({ sharedText }: AppProps) {
  const [prompt, setPrompt] = useState(\"What can this starter app do?\");
  const { askBackend, response, loading } = useAsk();

  return (
    <main className=\"app-shell\">
      <section className=\"workspace\">
        <div className=\"header-row\">
          <div>
            <p className=\"eyebrow\">AI Project Starter</p>
            <h1>$APP_TITLE</h1>
            <p className=\"shared-text\">{sharedText}</p>
          </div>
          <span className=\"status-pill\">FastAPI + React</span>
        </div>

        <label htmlFor=\"prompt\">Prompt</label>
        <textarea
          id=\"prompt\"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={5}
        />

        <button type=\"button\" onClick={() => void askBackend(prompt)} disabled={loading || !prompt.trim()}>
          {loading ? \"Asking...\" : \"Ask\"}
        </button>

        {response ? (
          <div className=\"result-panel\">
            <h2>Answer</h2>
            <p>{response.answer}</p>
            <h2>Model</h2>
            <p>
              {response.provider} / {response.model}
            </p>
            <h2>Retrieved context</h2>
            <p>{response.context}</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
"

    write_file "$APP_DIR/frontend/src/api/useAsk.ts" "import { useCallback, useState } from \"react\";

import { buildApiUrl } from \"../utils/config\";

type AskResponse = {
  answer: string;
  context: string;
  provider: string;
  model: string;
};

export function useAsk() {
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const askBackend = useCallback(async (prompt: string) => {
    setLoading(true);
    try {
      const result = await fetch(buildApiUrl(\"/api/ask\"), {
        method: \"POST\",
        headers: { \"Content-Type\": \"application/json\" },
        body: JSON.stringify({ prompt }),
      });
      setResponse(await result.json());
    } finally {
      setLoading(false);
    }
  }, []);

  return { askBackend, response, loading };
}
"

    write_file "$APP_DIR/frontend/src/utils/config.ts" $'export const API_BASE_URL = "http://localhost:8000";

export function buildApiUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
'

    write_file "$APP_DIR/frontend/src/styles.d.ts" "declare module \"*.scss\";
"

    write_file "$APP_DIR/frontend/src/styles.scss" ":root {
  color: #1d2329;
  background: #f5f7f8;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button,
textarea {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px;
}

.workspace {
  width: min(760px, 100%);
  display: grid;
  gap: 16px;
}

.header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #39705f;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  font-size: 2rem;
}

h2 {
  font-size: 0.95rem;
}

.status-pill {
  border: 1px solid #c9d7d1;
  border-radius: 999px;
  padding: 8px 12px;
  color: #31584c;
  background: #eef7f4;
  white-space: nowrap;
}

label {
  font-weight: 700;
}

textarea {
  min-height: 140px;
  resize: vertical;
  border: 1px solid #cfd8dc;
  border-radius: 8px;
  padding: 14px;
  color: #1d2329;
  background: #ffffff;
}

button {
  width: max-content;
  border: 0;
  border-radius: 8px;
  padding: 11px 16px;
  color: #ffffff;
  background: #256f80;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.result-panel {
  display: grid;
  gap: 8px;
  border: 1px solid #d8dee2;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
}
"
}
