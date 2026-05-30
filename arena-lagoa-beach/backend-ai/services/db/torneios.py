from services.db._client import get, fmt_data, R
from services.db._partidas_helpers import get_equipes_do_usuario


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


async def get_dupla_usuario(token: str, id_usuario: str) -> str:
    # 1. Obtém os IDs das equipes do usuário (função já existente)
    ids_equipe = await get_equipes_do_usuario(token, id_usuario)
    if not ids_equipe:
        return (
            "Você ainda não faz parte de nenhuma equipe. "
            "Para ter uma dupla, inscreva-se em um torneio e forme sua equipe."
        )

    parceiros = []

    for id_equipe in ids_equipe:
        # 2. Busca os detalhes da equipe (já inclui os membros)
        data = await get(f"{R['equipe']}/{id_equipe}", token)
        if not data:
            continue

        # O endpoint GET /api/equipe/:id retorna o objeto diretamente:
        # { id_equipe, nome, membros: [...], completa: bool }
        membros = data.get("membros", [])
        for membro in membros:
            if membro.get("id_usuario") != id_usuario:
                nome = membro.get("nome", "parceiro(a)")
                # Evita duplicatas
                if nome not in parceiros:
                    parceiros.append(nome)
                break  # uma equipe só tem 2 membros

    if not parceiros:
        return "Você ainda não possui dupla em nenhuma equipe."

    if len(parceiros) == 1:
        return f"Sua dupla é {parceiros[0]}."
    else:
        return f"Suas duplas: {', '.join(parceiros)}."