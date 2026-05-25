import os

from groq import Groq
from dotenv import load_dotenv

from prompts.prompt import SYSTEM_PROMPT

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MAX_CONTEXT = 2000


def montar_prompt_e_chamar_llm(
    contexto: str, pergunta: str, historico_txt: str = ""
) -> str:

    contexto = (contexto or "").strip()

    if len(contexto) > MAX_CONTEXT:
        contexto = contexto[:MAX_CONTEXT] + "..."

    tem_contexto = bool(contexto)

    contexto_formatado = (
        f"Contexto disponível:\n{contexto}"
        if tem_contexto
        else "Nenhum contexto recuperado da base."
    )

    user_prompt = f"""
Histórico da conversa:
{historico_txt or "Nenhum"}

{contexto_formatado}

Pergunta:
{pergunta}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
            max_tokens=500,
        )

        content = response.choices[0].message.content

        if not content:
            return "Não consegui gerar uma resposta."

        return content.strip()

    except Exception as e:
        print(f"Erro ao chamar LLM: {e}")
        return "Erro interno ao gerar resposta."