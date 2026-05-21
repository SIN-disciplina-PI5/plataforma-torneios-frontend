from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from services.grafo import chatbot
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PerguntaRequest(BaseModel):
    pergunta: str

@app.get("/")
def health():
    return {"message": "Api rodando"}

@app.post("/api/chat")
def chat(request: PerguntaRequest):
    resultado = chatbot.invoke({
        "pergunta":      request.pergunta,
        "chunks":        [],
        "contexto":      "",        
        "historico_txt": "",       
        "resposta":      "",
        "historico":     []
    })
    return {"resposta": resultado["resposta"]}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)