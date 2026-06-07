# Deploy checklist — Nora Voice orb (3 repos)

The post-login **NoraVoice** orb (voice in → Gemini chat → ElevenLabs voice out →
agent cards → dashboard hand-off) spans three repos. The frontend code is
AWS-safe on its own (every call goes through `VITE_API_BASE_URL`), but the voice
loop depends on backend routes, a Python dependency, and several env vars that
are **not** in git. Do all of the below or voice will 404 / 503.

## 1. NORA-FRONTEND (this repo)

- Branch: `noravoice-home` (NoraVoice is the post-login landing view; normal auth).
- **Build-time env** — set BEFORE `npm run build` (Vite bakes env at build time):
  ```
  VITE_API_BASE_URL=https://<aws-backend-host>      # NOT localhost
  ```
  If unset it defaults to `http://localhost:3000` and every call fails on AWS.
- Build + deploy the static output as usual.

## 2. NORA-BACKEND (Node)

- Ships the voice proxy: `POST /api/v1/voice/speak` (auth-gated) → forwards to the
  AI service. Files: `src/modules/voice/voice.routes.ts`, registered in
  `src/routes.ts`; `aiClient.speak()` in `src/services/aiClient.ts`.
- **.env** must have (already used by the rest of the app):
  ```
  AI_SERVICE_URL=http://localhost:8090     # or the AI service's address
  AI_SERVICE_TOKEN=<must match the AI service SERVICE_TOKEN>
  ```
- Restart the backend (pm2) after deploy.

## 3. NORA-AI (Python / FastAPI)

- Ships `POST /ai/voice/speak` (ElevenLabs TTS) and Gemini-backed `/ai/chat`.
  Files: `app/api/routes/voice.py` (registered in `app/main.py`),
  `app/core/config.py`, `app/api/routes/chat.py`, `app/rag/retrieval.py`.
- **New dependency** — now in `pyproject.toml`, but install it in the AWS venv:
  ```
  pip install "elevenlabs>=2.0"
  ```
- **app/.env** must have:
  ```
  SERVICE_TOKEN=<must match NORA-BACKEND AI_SERVICE_TOKEN>
  CHAT_LLM_PROVIDER=gemini
  GEMINI_API_KEY=<your Gemini key>
  GEMINI_CHAT_MODEL=gemini-2.5-flash
  ELEVENLABS_API_KEY=<your ElevenLabs key>
  ELEVENLABS_VOICE_ID=EXAVITQu4vr4xnSDxMaL   # Sarah (free premade). Rachel
                                             # (21m00Tcm4TlvDq8ikWAM) needs a paid plan.
  ```
- Restart the AI service (pm2) after deploy.

### Notes
- **Embeddings/RAG**: the OpenAI embeddings key may be invalid; retrieval is
  written to skip gracefully (logs a warning, returns no context) so chat/voice
  still work. Set a valid `OPENAI_API_KEY` only if you want RAG context.
- **STT** is the browser's built-in SpeechRecognition (Chrome) — no server cost,
  Chrome/Edge only.
- **Scripted demo audio** (`public/demo-audio/*.mp3`) is pre-generated and plays
  instantly for the "introduce yourself" and "take me to the dashboard" prompts;
  any other prompt goes live (Gemini + ElevenLabs).

### Smoke test after deploy
1. Log in → land on the orb.
2. Mic (or type) "introduce yourself" → Nora speaks, agent cards reveal.
3. "take me to the dashboard" → Nora acknowledges, then the IntelligenceMap opens
   with the Analyst / Strategy / Social cards expanded.
