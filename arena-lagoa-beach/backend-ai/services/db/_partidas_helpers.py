_partidas_helpers
from services.db._client import get, R

async def get_equipes_do_usuario(token: str, id_usuario: str) -> list[str]:
    data = await get(R["equipe_usuario"], token)
    if not data:
        return []
    vinculos = data if isinstance(data, list) else data.get("data", [])
    return [v["id_equipe"] for v in vinculos if v.get("id_usuario") == id_usuario]


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

            p              = p_data.get("data", p_data)
            p["_id_equipe"] = id_equipe
            partidas.append(p)

    return partidas