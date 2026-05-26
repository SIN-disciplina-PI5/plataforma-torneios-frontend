import jwt as pyjwt
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field
from services.grafo import invocar

router = APIRouter()


class ChatRequest(BaseModel):
    pergunta:   str = Field(..., min_length=1)
    session_id: str = Field(..., min_length=1)


class ChatResponse(BaseModel):
    resposta:   str
    session_id: str


@router.post("/chat", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    authorization: str = Header(..., description="Bearer <JWT>"),
):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")

    token = authorization.removeprefix("Bearer ").strip()

    # Decodifica sem verificar assinatura — validação é responsabilidade do backend Node
    # Só precisamos do id_usuario para montar as queries
    try:
        payload = pyjwt.decode(token, options={"verify_signature": False})
        id_usuario = payload.get("id")
        if not id_usuario:
            raise HTTPException(status_code=401, detail="Token sem id de usuário")
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    resposta = await invocar(
        pergunta=body.pergunta,
        session_id=body.session_id,
        token=token,
        id_usuario=id_usuario,
    )

    return ChatResponse(resposta=resposta, session_id=body.session_id)