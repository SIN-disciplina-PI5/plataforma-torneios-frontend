from services.db._client import get, R
from services.db._partidas_helpers import get_equipes_do_usuario


async def get_dupla_usuario(token: str, id_usuario: str) -> str:
    ids_equipe = await get_equipes_do_usuario(token, id_usuario)
    if not ids_equipe:
        return (
            "Você ainda não faz parte de nenhuma equipe. "
            "Para ter uma dupla, inscreva-se em um torneio e forme sua equipe."
        )

    parceiros = []

    for id_equipe in ids_equipe:
        data = await get(f"{R['equipe']}/{id_equipe}", token)
        if not data:
            continue

        membros = data.get("membros", [])
        for membro in membros:
            if membro.get("id_usuario") != id_usuario:
                nome = membro.get("nome", "parceiro(a)")
                if nome not in parceiros:
                    parceiros.append(nome)
                break

    if not parceiros:
        return "Você ainda não possui dupla em nenhuma equipe."

    if len(parceiros) == 1:
        return f"Sua dupla é {parceiros[0]}."

    return f"Suas duplas: {', '.join(parceiros)}."