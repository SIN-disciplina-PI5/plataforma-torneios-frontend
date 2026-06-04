from typing import TypedDict
from langgraph.graph import StateGraph, END
from dotenv import load_dotenv
from rag.rags import RAG
from models.llm import montar_prompt_e_chamar_llm
from services.classificador import classificar_intencao, extrair_intencao_banco
from services.database_service import (
    get_proxima_partida,
    get_todas_partidas_usuario,
    get_partidas_hoje,
    get_partidas_semana,
    get_partidas_por_torneio,
    get_inscricoes_do_usuario,
    get_todos_torneios,
    get_dupla_usuario,
    get_duplas_com_torneios,
    get_minhas_duplas_resumido,
    get_ranking_geral,
    get_ranking_usuario,
    get_ranking_por_posicao,
)

load_dotenv()
rag = RAG()

_historicos: dict[str, list[dict]] = {}
MAX_HISTORICO = 20


class EstadoChatbot(TypedDict):
    pergunta:      str
    token:         str
    id_usuario:    str
    chunks:        list[dict]
    contexto:      str
    historico_txt: str
    resposta:      str
    historico:     list[dict]
    intencao:      str


def classificar(estado: EstadoChatbot) -> dict:
    return {"intencao": classificar_intencao(estado["pergunta"])}


def recuperar_contexto(estado: EstadoChatbot) -> dict:
    chunks = rag.retrieve(estado["pergunta"])
    chunks_validos = [c for c in chunks if len(c["texto"].strip()) >= 20]
    return {"chunks": chunks_validos}


async def buscar_banco(estado: EstadoChatbot) -> dict:
    token      = estado["token"]
    id_usuario = estado["id_usuario"]
    pergunta   = estado["pergunta"]
    consulta   = extrair_intencao_banco(pergunta)

    if consulta == "proxima_partida":
        dados = await get_proxima_partida(token, id_usuario)

    elif consulta == "todas_partidas":
        dados = await get_todas_partidas_usuario(token, id_usuario)

    elif consulta == "partidas_hoje":
        dados = await get_partidas_hoje(token, id_usuario)

    elif consulta == "partidas_semana":
        dados = await get_partidas_semana(token, id_usuario)

    elif consulta == "partidas_por_torneio":
        texto  = pergunta.lower()
        partes = texto.split("torneio")
        nome   = partes[-1].strip().strip("?.,!") if len(partes) > 1 else ""
        dados  = await get_partidas_por_torneio(token, id_usuario, nome) if nome \
                 else await get_todas_partidas_usuario(token, id_usuario)

    elif consulta == "torneios_inscritos":
        dados = await get_inscricoes_do_usuario(token, id_usuario)

    elif consulta == "todos_torneios":
        dados = await get_todos_torneios(token)

    # ── Duplas ──────────────────────────────────────────────────────────────
    elif consulta == "dupla":
        dados = await get_dupla_usuario(token, id_usuario)

    elif consulta == "duplas_resumo":
        dados = await get_minhas_duplas_resumido(token, id_usuario)

    elif consulta == "duplas_detalhes":
        duplas = await get_duplas_com_torneios(token, id_usuario)
        if not duplas:
            dados = "Você não está em nenhuma equipe no momento."
        else:
            linhas = []
            for d in duplas:
                parceiro = d["parceiro"] or "sem parceiro ainda"
                linhas.append(
                    f"• Equipe: {d['equipe']} | Parceiro: {parceiro} | "
                    f"Torneio: {d['torneio']} ({d['categoria']})"
                )
            dados = "Suas duplas e torneios:\n" + "\n".join(linhas)
    # ────────────────────────────────────────────────────────────────────────

    # ── Ranking ─────────────────────────────────────────────────────────────
    elif consulta == "ranking_usuario":
        dados = await get_ranking_usuario(token, id_usuario)

    elif consulta == "ranking_posicao":
        # Tenta extrair o número da posição da pergunta (ex: "quem está em 3º?")
        import re
        match = re.search(r"\b(\d+)\b", pergunta)
        posicao = int(match.group(1)) if match else 1
        dados = await get_ranking_por_posicao(token, posicao)

    elif consulta == "ranking_geral":
        # Tenta extrair limite da pergunta (ex: "top 5", "top 20")
        import re
        match = re.search(r"\b(?:top\s*)?(\d+)\b", pergunta.lower())
        limite = int(match.group(1)) if match and int(match.group(1)) <= 100 else 10
        dados = await get_ranking_geral(token, limite)
    # ────────────────────────────────────────────────────────────────────────

    else:
        dados = await get_todos_torneios(token)

    return {"contexto": dados, "chunks": []}


def montar_prompt(estado: EstadoChatbot) -> dict:
    historico_txt = "\n".join(
        f"{m['role']}: {m['content']}"
        for m in estado.get("historico", [])[-6:]
    )

    if estado["intencao"] == "rag" and estado["chunks"]:
        partes = [
            f"[Fonte: {c['arquivo']}{', página ' + str(c['pagina']) if c.get('pagina') else ''}]\n{c['texto']}"
            for c in estado["chunks"]
        ]
        contexto = "\n\n".join(partes)
    else:
        contexto = estado.get("contexto", "")

    return {"contexto": contexto, "historico_txt": historico_txt}


def chamar_llm(estado: EstadoChatbot) -> dict:
    resposta = montar_prompt_e_chamar_llm(
        estado["contexto"],
        estado["pergunta"],
        estado["historico_txt"],
    )
    return {"resposta": resposta}


def rotear(estado: EstadoChatbot) -> str:
    return "buscar_banco" if estado["intencao"] == "banco" else "recuperar_contexto"


grafo = StateGraph(EstadoChatbot)
grafo.add_node("classificar",        classificar)
grafo.add_node("recuperar_contexto", recuperar_contexto)
grafo.add_node("buscar_banco",       buscar_banco)
grafo.add_node("montar_prompt",      montar_prompt)
grafo.add_node("chamar_llm",         chamar_llm)

grafo.set_entry_point("classificar")
grafo.add_conditional_edges("classificar", rotear, {
    "recuperar_contexto": "recuperar_contexto",
    "buscar_banco":       "buscar_banco",
})
grafo.add_edge("recuperar_contexto", "montar_prompt")
grafo.add_edge("buscar_banco",       "montar_prompt")
grafo.add_edge("montar_prompt",      "chamar_llm")
grafo.add_edge("chamar_llm",         END)

chatbot = grafo.compile()


async def invocar(pergunta: str, session_id: str, token: str, id_usuario: str) -> str:
    if session_id not in _historicos:
        _historicos[session_id] = []

    resultado = await chatbot.ainvoke({
        "pergunta":      pergunta,
        "token":         token,
        "id_usuario":    id_usuario,
        "chunks":        [],
        "contexto":      "",
        "historico_txt": "",
        "resposta":      "",
        "historico":     list(_historicos[session_id]),
        "intencao":      "",
    })

    resposta = resultado["resposta"]
    _historicos[session_id].extend([
        {"role": "user",      "content": pergunta},
        {"role": "assistant", "content": resposta},
    ])
    if len(_historicos[session_id]) > MAX_HISTORICO:
        _historicos[session_id] = _historicos[session_id][-MAX_HISTORICO:]

    return resposta