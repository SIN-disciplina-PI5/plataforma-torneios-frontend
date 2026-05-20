from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Arena AI rodando"
    }


@app.post("/chat")
async def chat(request: Request):

    body = await request.json()

    messages = body.get("messages", [])

    ultima_mensagem = messages[-1]

    texto_usuario = ""

    for part in ultima_mensagem.get("parts", []):
        if part.get("type") == "text":
            texto_usuario = part.get("text", "")

    resposta = f"🏐 Você perguntou: {texto_usuario}"

    return {
        "messages": [
            {
                "id": "assistant-response",
                "role": "assistant",
                "parts": [
                    {
                        "type": "text",
                        "text": resposta
                    }
                ]
            }
        ]
    }