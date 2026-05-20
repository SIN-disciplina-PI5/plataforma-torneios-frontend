from fastapi import APIRouter
from pydantic import BaseModel, Field
from services.grafo import invocar

router = APIRouter()


class ChatRequest(BaseModel):
    pergunta:   str = Field(..., min_length=1, description="Mensagem do usuário")
    session_id: str = Field(..., min_length=1, description="ID único da sessão")


class ChatResponse(BaseModel):
    resposta:   str
    session_id: str


@router.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest):
    resposta = invocar(body.pergunta, body.session_id)
    return ChatResponse(resposta=resposta, session_id=body.session_id)