#!/usr/bin/env bash

set -e

create_structure() {

    local APP_NAME="$1"
    local APP_DIR="apps/$APP_NAME"
    local PY_PACKAGE_NAME="${APP_NAME//-/_}"

    log_info "Creating project structure..."

    # Root
    create_dir "$APP_DIR"

    create_dir "$APP_DIR/backend"
    create_dir "$APP_DIR/frontend"
    create_dir "$APP_DIR/ai"

    create_dir "$APP_DIR/configs"
    create_dir "$APP_DIR/data"
    create_dir "$APP_DIR/docker"
    create_dir "$APP_DIR/tests"
    create_dir "$APP_DIR/scripts"
    create_dir "$APP_DIR/docs"

    # Backend
    create_dir "$APP_DIR/backend/app"
    create_dir "$APP_DIR/backend/app/api"
    create_dir "$APP_DIR/backend/app/core"
    create_dir "$APP_DIR/backend/app/services"
    create_dir "$APP_DIR/backend/api"
    create_dir "$APP_DIR/backend/core"
    create_dir "$APP_DIR/backend/db"
    create_dir "$APP_DIR/backend/services"
    create_dir "$APP_DIR/backend/schemas"
    create_dir "$APP_DIR/backend/middleware"
    create_dir "$APP_DIR/backend/utils"

    # AI
    create_dir "$APP_DIR/ai/models"
    create_dir "$APP_DIR/ai/training"
    create_dir "$APP_DIR/ai/inference"
    create_dir "$APP_DIR/ai/evaluation"
    create_dir "$APP_DIR/ai/prompts"
    create_dir "$APP_DIR/ai/agents"
    create_dir "$APP_DIR/ai/vectorstores"
    create_dir "$APP_DIR/ai/embeddings"
    create_dir "$APP_DIR/ai/datasets"
    create_dir "$APP_DIR/ai/utils"
    create_dir "$APP_DIR/ai/rag"

    # Root files
    write_project_files "$APP_NAME" "$APP_DIR" "$PY_PACKAGE_NAME"

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
    local PY_PACKAGE_NAME="$3"

    write_file "$APP_DIR/README.md" "# $APP_NAME

Runnable AI project boilerplate with a FastAPI backend, shared AI package, and React + TypeScript + SCSS frontend.

## Run

\`\`\`bash
uv sync
pnpm install
uv run uvicorn apps.$PY_PACKAGE_NAME.backend.app.main:app --reload --port 8000
pnpm --filter @apps/$APP_NAME-frontend dev
\`\`\`

The frontend dev server proxies \`/api\` to \`http://localhost:8000\`.
"

    write_file "$APP_DIR/.env.example" "APP_NAME=$APP_NAME
API_HOST=0.0.0.0
API_PORT=8000
"

    write_file "$APPS_DIR/__init__.py" ""
    write_file "$APP_DIR/__init__.py" ""
    write_file "$APP_DIR/backend/__init__.py" ""

    write_file "$APP_DIR/backend/README.md" "# Backend

FastAPI app for project-specific HTTP APIs.

\`\`\`bash
uv run uvicorn apps.$PY_PACKAGE_NAME.backend.app.main:app --reload --port 8000
\`\`\`
"

    write_file "$APP_DIR/backend/app/__init__.py" ""
    write_file "$APP_DIR/backend/app/api/__init__.py" ""
    write_file "$APP_DIR/backend/app/core/__init__.py" ""
    write_file "$APP_DIR/backend/app/services/__init__.py" ""
    write_file "$APP_DIR/backend/app/core/config.py" "from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = \"$APP_NAME\"
    api_prefix: str = \"/api\"


settings = Settings()
"

    write_file "$APP_DIR/backend/app/services/ai_service.py" "from apps.$PY_PACKAGE_NAME.ai.agents.simple_agent import SimpleAgent
from apps.$PY_PACKAGE_NAME.ai.rag.simple_rag import SimpleRag


class AiService:
    def __init__(self) -> None:
        self.agent = SimpleAgent()
        self.rag = SimpleRag()

    def answer(self, prompt: str) -> dict[str, str]:
        context = self.rag.retrieve(prompt)
        answer = self.agent.run(prompt=prompt, context=context)
        return {\"answer\": answer, \"context\": context}
"

    write_file "$APP_DIR/backend/app/api/routes.py" "from fastapi import APIRouter
from pydantic import BaseModel

from apps.$PY_PACKAGE_NAME.backend.app.services.ai_service import AiService

router = APIRouter()
ai_service = AiService()


class PromptRequest(BaseModel):
    prompt: str


@router.get(\"/health\")
def health() -> dict[str, str]:
    return {\"status\": \"ok\", \"service\": \"$APP_NAME\"}


@router.post(\"/ask\")
def ask(request: PromptRequest) -> dict[str, str]:
    return ai_service.answer(request.prompt)
"

    write_file "$APP_DIR/backend/app/main.py" "from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apps.$PY_PACKAGE_NAME.backend.app.api.routes import router
from apps.$PY_PACKAGE_NAME.backend.app.core.config import settings

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

    write_file "$APP_DIR/ai/README.md" "# AI

Shared Python code for agents, RAG, prompts, embeddings, vector stores, and evaluation.
The backend imports this package directly and uses the repo-level \`.venv\`.
"

    write_file "$APP_DIR/ai/__init__.py" ""
    write_file "$APP_DIR/ai/agents/__init__.py" ""
    write_file "$APP_DIR/ai/rag/__init__.py" ""
    write_file "$APP_DIR/ai/utils/__init__.py" ""
    write_file "$APP_DIR/ai/agents/simple_agent.py" "class SimpleAgent:
    def run(self, prompt: str, context: str) -> str:
        return f\"Starter answer for '{prompt}'. Retrieved context: {context}\"
"

    write_file "$APP_DIR/ai/rag/simple_rag.py" "class SimpleRag:
    def retrieve(self, query: str) -> str:
        return f\"No vector store configured yet for query: {query}\"
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

    create_dir "$APP_DIR/frontend/public"
    create_dir "$APP_DIR/frontend/src"

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

import { App } from \"./App\";
import \"./styles.scss\";

const root = createRoot(document.getElementById(\"root\") as HTMLElement);
root.render(<App />);
"

    write_file "$APP_DIR/frontend/src/App.tsx" "import { useState } from \"react\";

type AskResponse = {
  answer: string;
  context: string;
};

export function App() {
  const [prompt, setPrompt] = useState(\"What can this starter app do?\");
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function askBackend() {
    setLoading(true);
    try {
      const result = await fetch(\"/api/ask\", {
        method: \"POST\",
        headers: { \"Content-Type\": \"application/json\" },
        body: JSON.stringify({ prompt }),
      });
      setResponse(await result.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className=\"app-shell\">
      <section className=\"workspace\">
        <div className=\"header-row\">
          <div>
            <p className=\"eyebrow\">AI Project Starter</p>
            <h1>$APP_NAME</h1>
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

        <button type=\"button\" onClick={askBackend} disabled={loading || !prompt.trim()}>
          {loading ? \"Asking...\" : \"Ask backend\"}
        </button>

        {response ? (
          <div className=\"result-panel\">
            <h2>Answer</h2>
            <p>{response.answer}</p>
            <h2>Retrieved context</h2>
            <p>{response.context}</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
"

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

    write_file "$APP_DIR/tests/test_health.py" "from fastapi.testclient import TestClient

from apps.$PY_PACKAGE_NAME.backend.app.main import app


def test_health() -> None:
    response = TestClient(app).get(\"/api/health\")

    assert response.status_code == 200
    assert response.json()[\"status\"] == \"ok\"
"
}
