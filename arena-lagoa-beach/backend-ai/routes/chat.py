from fastapi import APIRouter

router = APIRouter()

@router.post("/chat")
async def chat():
    return {
        "response": "Olá, eu sou a IA da Arena!"
    }