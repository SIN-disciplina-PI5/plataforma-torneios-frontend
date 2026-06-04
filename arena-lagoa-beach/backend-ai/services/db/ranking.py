from services.db._client import get, fmt_data, R

_R_RANKING = "/api/ranking"


async def get_ranking_geral(token: str, limite: int = 10) -> str:
    """Retorna o ranking geral dos jogadores (top N)."""
    data = await get(f"{_R_RANKING}/geral?limite={limite}", token)
    if not data:
        return "Não foi possível buscar o ranking no momento."

    jogadores = data.get("data", [])
    if not jogadores:
        return "Nenhum jogador encontrado no ranking."

    linhas = []
    for j in jogadores:
        usuario = j.get("usuario", {})
        nome    = usuario.get("nome", "Desconhecido")
        patente = usuario.get("patente", "—")
        pontos  = j.get("pontos", 0)
        posicao = j.get("posicao", "—")
        linhas.append(f"{posicao}º {nome} | {patente} | {pontos} pts")

    return f"🏆 Ranking geral (top {limite}):\n" + "\n".join(linhas)


async def get_ranking_usuario(token: str, id_usuario: str) -> str:
    """Retorna a posição e pontuação do usuário no ranking."""
    data = await get(f"{_R_RANKING}/usuario/{id_usuario}", token)
    if not data:
        return "Você ainda não possui ranking. Participe de torneios para pontuar!"

    r       = data.get("data", data)
    usuario = r.get("usuario") or {}
    nome    = usuario.get("nome", "você")
    posicao = r.get("posicao") or "—"
    pontos  = r.get("pontos", 0)
    patente = usuario.get("patente", "—")

    ultima = r.get("ultima_atualizacao")
    txt_ultima = f" | Última atualização: {fmt_data(ultima)}" if ultima else ""

    return (
        f"Ranking de {nome}:\n"
        f"Posição: {posicao}º | Pontos: {pontos} | Patente: {patente}{txt_ultima}"
    )


async def get_ranking_por_posicao(token: str, posicao: int) -> str:
    """Retorna quem está em determinada posição do ranking."""
    data = await get(f"{_R_RANKING}/posicao/{posicao}", token)
    if not data:
        return f"Nenhum jogador encontrado na posição {posicao}."

    r       = data.get("data", data)
    usuario = r.get("usuario") or {}
    nome    = usuario.get("nome", "Desconhecido")
    patente = usuario.get("patente", "—")
    pontos  = r.get("pontos", 0)

    return (
        f"🥇 {posicao}º lugar no ranking:\n"
        f"{nome} | {patente} | {pontos} pts"
    )