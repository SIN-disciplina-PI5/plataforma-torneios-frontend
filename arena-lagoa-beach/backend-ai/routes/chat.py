import re
import jwt as pyjwt
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, Field
from services.grafo import invocar

router = APIRouter()

PADROES_INJECAO = [
    r"ignore\s+(all\s+|previous\s+|above\s+)?instructions",
    r"you\s+are\s+now",
    r"act\s+as",
    r"forget\s+(everything|all)",
    r"new\s+instruction",
    r"system\s+prompt",
    r"jailbreak",
    r"pretend\s+(you\s+are|to\s+be)",
    r"override\s+(your\s+)?instructions",
    r"disregard\s+(your\s+)?",
    r"ignore\s+your\s+",
    r"você\s+agora\s+é",
    r"esqueça\s+(tudo|suas\s+instruções)",
    r"novas?\s+instruções",
    r"finja\s+(ser|que)",
]

def sanitizar_pergunta(texto: str) -> bool:
    texto_lower = texto.lower()
    for padrao in PADROES_INJECAO:
        if re.search(padrao, texto_lower):
            return False
    return True


class ChatRequest(BaseModel):
    pergunta:   str = Field(..., min_length=1, max_length=500)
    session_id: str = Field(..., min_length=1, max_length=100)


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

    try:
        payload = pyjwt.decode(token, options={"verify_signature": False})
        id_usuario = payload.get("id")
        if not id_usuario:
            raise HTTPException(status_code=401, detail="Token sem id de usuário")
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    # Bloqueia tentativas de prompt injection
    if not sanitizar_pergunta(body.pergunta):
        return ChatResponse(
            resposta="Só posso ajudar com assuntos da Arena Lagoa Beach.",
            session_id=body.session_id,
        )

    resposta = await invocar(
        pergunta=body.pergunta,
        session_id=body.session_id,
        token=token,
        id_usuario=id_usuario,
    )

    return ChatResponse(resposta=resposta, session_id=body.session_id)