from services.db._client import get, R


async def _torneios_dict(token: str) -> dict:
    data = await get(R["torneio"], token)
    if not data:
        return {}
    lista = data if isinstance(data, list) else data.get("data", [])
    return {
        str(t.get("id_torneio") or t.get("id")): {
            "nome": t.get("nome", "?"),
            "categoria": t.get("categoria", "?"),
            "status": t.get("status"),
        }
        for t in lista
        if t.get("id_torneio") or t.get("id")
    }


async def _equipes_do_usuario(token: str, id_usuario: str) -> list:
    data = await get(R["equipe"], token)
    if not data:
        return []
    equipes = data if isinstance(data, list) else data.get("data", [])

    minhas = []
    for equipe in equipes:
        for membro in equipe.get("membros", []):
            uid = membro.get("id_usuario") or membro.get("id")
            if uid and str(uid) == str(id_usuario):
                minhas.append(equipe)
                break
    return minhas


async def get_dupla_usuario(token: str, id_usuario: str) -> str:
    try:
        minhas_equipes = await _equipes_do_usuario(token, id_usuario)

        if not minhas_equipes:
            return (
                "Você ainda não faz parte de nenhuma equipe. "
                "Para ter uma dupla, inscreva-se em um torneio e forme sua equipe."
            )

        torneios = await _torneios_dict(token)
        duplas = _montar_duplas(minhas_equipes, torneios, id_usuario)

        if len(duplas) == 1:
            return _formatar_dupla_unica(duplas[0])

        return _formatar_multiplas_duplas(duplas)

    except Exception as e:
        print(f"[ERRO] get_dupla_usuario: {e}")
        return "Ocorreu um erro ao buscar sua dupla. Tente novamente mais tarde."


async def get_duplas_com_torneios(token: str, id_usuario: str) -> list[dict]:
    """
    Retorna:
    [
      {
        "equipe":    "Nome da Equipe",
        "parceiro":  "Nome do Parceiro" | None,
        "completa":  True | False,
        "torneio":   "Nome do Torneio",
        "categoria": "Categoria",
        "status":    True | False,
        "id_torneio": 1,
      },
      ...
    ]
    """
    try:
        minhas_equipes = await _equipes_do_usuario(token, id_usuario)
        torneios = await _torneios_dict(token)
        return _montar_duplas(minhas_equipes, torneios, id_usuario)
    except Exception as e:
        print(f"[ERRO] get_duplas_com_torneios: {e}")
        return []


async def get_minhas_duplas_resumido(token: str, id_usuario: str) -> str:
    """
    Exemplo de retorno:
    "Você tem 2 dupla(s) ativa(s):
     • Equipe Alpha — Parceiro: João — Torneio: Copa Verão (Misto)
     • Equipe Beta  — Aguardando parceiro — Torneio: Open Lagoa (Masculino)"
    """
    try:
        duplas = await get_duplas_com_torneios(token, id_usuario)

        if not duplas:
            return "Você ainda não está em nenhuma equipe."

        linhas = [f"Você tem {len(duplas)} dupla(s) ativa(s):\n"]
        for d in duplas:
            parceiro = (
                f"Parceiro: {d['parceiro']}" if d["parceiro"] else "Aguardando parceiro"
            )
            linhas.append(
                f"• **{d['equipe']}** — {parceiro} — "
                f"Torneio: {d['torneio']} ({d['categoria']})"
            )
        return "\n".join(linhas)

    except Exception as e:
        print(f"[ERRO] get_minhas_duplas_resumido: {e}")
        return "Não foi possível buscar suas duplas no momento."


def _montar_duplas(equipes: list, torneios: dict, id_usuario: str) -> list[dict]:
    resultado = []
    for eq in equipes:
        membros = eq.get("membros", [])
        id_torneio = str(eq.get("id_torneio") or "")
        t_info = torneios.get(
            id_torneio, {"nome": "?", "categoria": "?", "status": None}
        )

        parceiro = next(
            (
                m.get("nome") or m.get("usuario_nome") or "parceiro(a)"
                for m in membros
                if str(m.get("id_usuario") or m.get("id")) != str(id_usuario)
            ),
            None,
        )

        resultado.append(
            {
                "equipe": eq.get("nome") or f"Equipe {eq.get('id_equipe')}",
                "parceiro": parceiro,
                "completa": len(membros) == 2,
                "torneio": t_info["nome"],
                "categoria": t_info["categoria"],
                "status": t_info.get("status"),
                "id_torneio": eq.get("id_torneio"),
            }
        )
    return resultado


def _formatar_dupla_unica(d: dict) -> str:
    if d["parceiro"]:
        return (
            f"Sua dupla é **{d['parceiro']}** no torneio "
            f"**{d['torneio']}** ({d['categoria']}).\n"
            f"📋 Equipe: {d['equipe']}"
        )
    return (
        f"Você está na equipe **{d['equipe']}** do torneio "
        f"**{d['torneio']}** ({d['categoria']}), "
        "mas ainda não tem parceiro definido."
    )


def _formatar_multiplas_duplas(duplas: list[dict]) -> str:
    linhas = [f"Você está em {len(duplas)} dupla(s):\n"]
    for d in duplas:
        parceiro = (
            f"Parceiro: {d['parceiro']}" if d["parceiro"] else "Aguardando parceiro"
        )
        linhas.append(
            f"🏆 **{d['torneio']}** ({d['categoria']})\n"
            f"   👥 {d['equipe']} — {parceiro}\n"
        )
    return "\n".join(linhas).strip()
