import os
from typing import TypedDict
from langgraph.graph import StateGraph, END
from dotenv import load_dotenv
from rag.rags import RAG
from models.llm import montar_prompt_e_chamar_llm

load_dotenv()
rag = RAG()

# ── Histórico por sessão ──────────────────────────────────────────────────────
# Chave: session_id (str)  →  Valor: lista de mensagens [{role, content}]
# Em produção real isso viria de um banco/Redis, mas para o TCC
# um dicionário em memória já demonstra o conceito corretamente.
_historicos: dict[str, list[dict]] = {}

MAX_HISTORICO = 20  # máximo de mensagens mantidas por sessão


# ── Estado do grafo ───────────────────────────────────────────────────────────
# IMPORTANTE: session_id é removido do estado interno do LangGraph.
# O LangGraph faz merge parcial dos campos retornados por cada nó, o que
# pode descartar campos "não alterados" em algumas versões — causando KeyError.
# A solução é manter session_id fora do estado e gerenciá-lo em invocar().

class EstadoChatbot(TypedDict):
    pergunta:      str
    chunks:        list[dict]  # cada chunk: {"texto", "arquivo", "pagina", "score"}
    contexto:      str
    historico_txt: str
    resposta:      str
    historico:     list[dict]


# ── Nós do grafo ──────────────────────────────────────────────────────────────

def recuperar_contexto(estado: EstadoChatbot) -> dict:
    chunks = rag.retrieve(estado["pergunta"])
    chunks_validos = [c for c in chunks if len(c["texto"].strip()) >= 20]
    return {"chunks": chunks_validos}


def montar_prompt(estado: EstadoChatbot) -> dict:
    historico_txt = "\n".join(
        f"{m['role']}: {m['content']}"
        for m in estado.get("historico", [])[-6:]
    )

    partes_contexto = []
    for chunk in estado["chunks"]:
        fonte = chunk["arquivo"]
        if chunk.get("pagina"):
            fonte += f", página {chunk['pagina']}"
        partes_contexto.append(f"[Fonte: {fonte}]\n{chunk['texto']}")

    contexto = "\n\n".join(partes_contexto) if partes_contexto else ""

    return {"contexto": contexto, "historico_txt": historico_txt}


def chamar_llm(estado: EstadoChatbot) -> dict:
    resposta = montar_prompt_e_chamar_llm(
        estado["contexto"],
        estado["pergunta"],
        estado["historico_txt"],
    )
    return {"resposta": resposta}


# ── Montagem do grafo ─────────────────────────────────────────────────────────

grafo = StateGraph(EstadoChatbot)

grafo.add_node("recuperar_contexto", recuperar_contexto)
grafo.add_node("montar_prompt",      montar_prompt)
grafo.add_node("chamar_llm",         chamar_llm)

grafo.set_entry_point("recuperar_contexto")
grafo.add_edge("recuperar_contexto", "montar_prompt")
grafo.add_edge("montar_prompt",      "chamar_llm")
grafo.add_edge("chamar_llm",         END)

chatbot = grafo.compile()


# ── Função pública ────────────────────────────────────────────────────────────

def invocar(pergunta: str, session_id: str) -> str:
    """
    Parâmetros
    ----------
    pergunta   : mensagem do usuário
    session_id : identificador único da sessão/usuário
    """
    # Garante que a sessão existe
    if session_id not in _historicos:
        _historicos[session_id] = []

    historico_atual = list(_historicos[session_id])

    resultado = chatbot.invoke({
        "pergunta":      pergunta,
        "chunks":        [],
        "contexto":      "",
        "historico_txt": "",
        "resposta":      "",
        "historico":     historico_atual,
    })

    resposta = resultado["resposta"]

    # Atualiza histórico da sessão após resposta
    _historicos[session_id].extend([
        {"role": "user",      "content": pergunta},
        {"role": "assistant", "content": resposta},
    ])

    # Mantém apenas as últimas MAX_HISTORICO mensagens
    if len(_historicos[session_id]) > MAX_HISTORICO:
        _historicos[session_id] = _historicos[session_id][-MAX_HISTORICO:]

    return resposta