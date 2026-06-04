from services.db._client import get, R


async def get_equipes_do_usuario(token: str, id_usuario: str) -> list[str]:
    # 1. Busca todos os torneios
    torneios_data = await get(R["torneio"], token)
    if not torneios_data:
        return []

    torneios = torneios_data if isinstance(torneios_data, list) \
               else torneios_data.get("data", [])

    ids_equipe = []

    # 2. Para cada torneio, busca equipes e verifica se o usuário é membro
    for torneio in torneios:
        id_torneio = torneio.get("id_torneio") or torneio.get("id")
        if not id_torneio:
            continue

        equipes_data = await get(f"{R['equipe']}?id_torneio={id_torneio}", token)
        if not equipes_data:
            continue

        equipes = equipes_data if isinstance(equipes_data, list) \
                  else equipes_data.get("data", [])

        for equipe in equipes:
            membros = equipe.get("membros", [])
            for membro in membros:
                uid = membro.get("id_usuario") or membro.get("id")
                # FIX 1: comparar como string para evitar falha int vs str
                if str(uid) == str(id_usuario):
                    # FIX 2: fallback para "id" quando "id_equipe" não existir
                    id_eq = equipe.get("id_equipe") or equipe.get("id")
                    if id_eq:
                        ids_equipe.append(id_eq)
                    break

    return ids_equipe


async def get_partidas_das_equipes(token: str, ids_equipe: list[str]) -> list[dict]:
    """
    Caminho: equipe → /partida-usuarios?id_equipe=X → /partidas/:id
    Retorna lista de dicts com dados completos de cada partida (sem duplicatas).
    """
    partidas   = []
    ids_vistos = set()

    for id_equipe in ids_equipe:
        vinculos_data = await get(f"{R['partida_usuario']}?id_equipe={id_equipe}", token)
        if not vinculos_data:
            continue

        vinculos = vinculos_data if isinstance(vinculos_data, list) \
                   else vinculos_data.get("data", [])

        for v in vinculos:
            id_partida = v.get("id_partida") or (v.get("partida") or {}).get("id")
            if not id_partida or id_partida in ids_vistos:
                continue
            ids_vistos.add(id_partida)

            p_data = await get(f"{R['partida']}/{id_partida}", token)
            if not p_data:
                continue

            p               = p_data.get("data", p_data)
            p["_id_equipe"] = id_equipe
            partidas.append(p)

    return partidas