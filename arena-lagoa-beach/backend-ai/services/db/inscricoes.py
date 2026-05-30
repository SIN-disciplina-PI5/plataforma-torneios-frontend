from services.db._client import get, fmt_data, R


async def get_inscricoes_do_usuario(token: str, id_usuario: str) -> str:
    usuario_data = await get(f"{R['usuario']}/{id_usuario}", token)
    nome         = "você"
    if usuario_data:
        u    = usuario_data.get("data", usuario_data)
        nome = u.get("nome", "você")

    torneios_data = await get(R["torneio"], token)
    if not torneios_data:
        return "Não foi possível buscar suas inscrições no momento."

    torneios    = torneios_data.get("data", torneios_data if isinstance(torneios_data, list) else [])
    inscrito_em = []

    for t in torneios:
        id_torneio = t.get("id_torneio")
        if not id_torneio:
            continue

        insc_data  = await get(f"{R['inscricao']}/torneio/{id_torneio}", token)
        if not insc_data:
            continue

        inscricoes = insc_data if isinstance(insc_data, list) else insc_data.get("data", [])

        for insc in inscricoes:
            if insc.get("id_usuario") == id_usuario:
                inscrito_em.append(
                    f"- {t.get('nome','?')} | Categoria: {t.get('categoria')} | "
                    f"Início: {fmt_data(t.get('data_inicio'))} | Status: {insc.get('status','')}"
                )
                break

    if not inscrito_em:
        return f"{nome} não está inscrito em nenhum torneio no momento."

    return f"Torneios em que {nome} está inscrito:\n" + "\n".join(inscrito_em)