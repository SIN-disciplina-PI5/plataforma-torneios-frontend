from services.db._client import get, fmt_data, R


async def get_todos_torneios(token: str) -> str:
    data = await get(R["torneio"], token)
    if not data:
        return "Não foi possível buscar os torneios no momento."

    torneios = data.get("data", data if isinstance(data, list) else [])
    if not torneios:
        return "Nenhum torneio encontrado."

    linhas = []
    for t in torneios:
        status = "Ativo" if t.get("status") else "Encerrado"
        linhas.append(
            f"- {t.get('nome','?')} | Categoria: {t.get('categoria')} | "
            f"Vagas: {t.get('vagas')} | Status: {status} | "
            f"Período: {fmt_data(t.get('data_inicio'))} a {fmt_data(t.get('data_fim'))}"
        )
    return "Torneios disponíveis:\n" + "\n".join(linhas)


async def get_torneio_por_id(token: str, id_torneio: str) -> str:
    data = await get(f"{R['torneio']}/{id_torneio}", token)
    if not data:
        return "Torneio não encontrado."

    t      = data.get("data", data)
    status = "Ativo" if t.get("status") else "Encerrado"
    return (
        f"Torneio: {t.get('nome')}\n"
        f"Categoria: {t.get('categoria')} | Vagas: {t.get('vagas')} | Status: {status}\n"
        f"Início: {fmt_data(t.get('data_inicio'))} | Fim: {fmt_data(t.get('data_fim'))}"
    )