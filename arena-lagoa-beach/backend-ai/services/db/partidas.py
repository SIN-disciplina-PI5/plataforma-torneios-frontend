from datetime import datetime, timezone, timedelta
from services.db._client import fmt_data, fmt_fase, parse_dt
from services.db._partidas_helpers import get_equipes_do_usuario, get_partidas_das_equipes

_SEM_EQUIPE = "Você ainda não faz parte de nenhuma equipe. Para participar de partidas, primeiro inscreva-se em um torneio e depois forme sua dupla."
_SEM_PARTIDAS = "Você não possui partidas cadastradas ainda."


def _nome_torneio(p: dict) -> str:
    if isinstance(p.get("Torneio"), dict):
        return p["Torneio"].get("nome", "?")
    return p.get("torneio", "?") or "?"


async def get_proxima_partida(token: str, id_usuario: str) -> str:
    ids_equipe = await get_equipes_do_usuario(token, id_usuario)
    if not ids_equipe:
        return _SEM_EQUIPE

    partidas = await get_partidas_das_equipes(token, ids_equipe)
    if not partidas:
        return _SEM_PARTIDAS

    agora   = datetime.now(timezone.utc)
    proxima = None
    prox_dt = None

    for p in partidas:
        if p.get("status") not in ("PENDENTE", "EM_ANDAMENTO"):
            continue
        dt = parse_dt(p.get("horario"))
        if dt and dt > agora and (prox_dt is None or dt < prox_dt):
            proxima = p
            prox_dt = dt

    if not proxima:
        return "Você não possui partidas agendadas próximas."

    return (
        f"Sua próxima partida:\n"
        f"Torneio: {_nome_torneio(proxima)}\n"
        f"Fase: {fmt_fase(proxima.get('fase',''))}\n"
        f"Horário: {fmt_data(proxima.get('horario'))}\n"
        f"Status: {proxima.get('status')}"
    )


async def get_todas_partidas_usuario(token: str, id_usuario: str) -> str:
    ids_equipe = await get_equipes_do_usuario(token, id_usuario)
    if not ids_equipe:
        return _SEM_EQUIPE

    partidas = await get_partidas_das_equipes(token, ids_equipe)
    if not partidas:
        return _SEM_PARTIDAS

    partidas.sort(key=lambda p: parse_dt(p.get("horario")) or datetime.max.replace(tzinfo=timezone.utc))

    linhas = [
        f"- {fmt_fase(p.get('fase',''))} | Torneio: {_nome_torneio(p)} | "
        f"Horário: {fmt_data(p.get('horario'))} | Status: {p.get('status')} | "
        f"Placar: {p.get('placar') or '—'}"
        for p in partidas
    ]
    return f"Suas partidas ({len(partidas)} no total):\n" + "\n".join(linhas)


async def get_partidas_hoje(token: str, id_usuario: str) -> str:
    ids_equipe = await get_equipes_do_usuario(token, id_usuario)
    if not ids_equipe:
        return _SEM_EQUIPE

    partidas = await get_partidas_das_equipes(token, ids_equipe)

    agora  = datetime.now(timezone.utc)
    inicio = agora.replace(hour=0, minute=0, second=0, microsecond=0)
    fim    = inicio + timedelta(days=1)

    hoje = sorted(
        [p for p in partidas if (dt := parse_dt(p.get("horario"))) and inicio <= dt < fim],
        key=lambda p: parse_dt(p.get("horario")),
    )

    if not hoje:
        return "Você não tem partidas agendadas para hoje."

    linhas = [
        f"- {fmt_data(p.get('horario'))} | {fmt_fase(p.get('fase',''))} | "
        f"Torneio: {_nome_torneio(p)} | Status: {p.get('status')}"
        for p in hoje
    ]
    return f"Suas partidas de hoje ({len(hoje)}):\n" + "\n".join(linhas)


async def get_partidas_semana(token: str, id_usuario: str) -> str:
    ids_equipe = await get_equipes_do_usuario(token, id_usuario)
    if not ids_equipe:
        return _SEM_EQUIPE

    partidas = await get_partidas_das_equipes(token, ids_equipe)

    agora  = datetime.now(timezone.utc)
    fim    = agora + timedelta(days=7)

    semana = sorted(
        [p for p in partidas if (dt := parse_dt(p.get("horario"))) and agora <= dt <= fim],
        key=lambda p: parse_dt(p.get("horario")),
    )

    if not semana:
        return "Você não tem partidas agendadas para esta semana."

    linhas = [
        f"- {fmt_data(p.get('horario'))} | {fmt_fase(p.get('fase',''))} | "
        f"Torneio: {_nome_torneio(p)} | Status: {p.get('status')}"
        for p in semana
    ]
    return f"Suas partidas nos próximos 7 dias ({len(semana)}):\n" + "\n".join(linhas)


async def get_partidas_por_torneio(token: str, id_usuario: str, nome_torneio: str) -> str:
    ids_equipe = await get_equipes_do_usuario(token, id_usuario)
    if not ids_equipe:
        return _SEM_EQUIPE

    partidas = await get_partidas_das_equipes(token, ids_equipe)

    filtradas = sorted(
        [p for p in partidas if nome_torneio.lower() in (_nome_torneio(p) or "").lower()],
        key=lambda p: parse_dt(p.get("horario")) or datetime.max.replace(tzinfo=timezone.utc),
    )

    if not filtradas:
        return f"Nenhuma partida encontrada para o torneio '{nome_torneio}'."

    linhas = [
        f"- {fmt_fase(p.get('fase',''))} | Horário: {fmt_data(p.get('horario'))} | "
        f"Status: {p.get('status')} | Placar: {p.get('placar') or '—'}"
        for p in filtradas
    ]
    return f"Suas partidas no torneio '{nome_torneio}' ({len(filtradas)}):\n" + "\n".join(linhas)