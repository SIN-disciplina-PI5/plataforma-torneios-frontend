 _PALAVRAS_BANCO = [
    "minha partida", "minhas partidas", "próxima partida", "proxima partida",
    "quando jogo", "que horas", "horário", "horario",
    "meu jogo", "meus jogos", "partidas hoje", "partidas amanhã",
    "partidas da semana", "partidas na semana", "partidas dessa semana",
    "partidas no torneio", "partidas do torneio",
    "estou inscrito", "minha inscrição", "minhas inscrições",
    "inscricao", "inscrição", "inscrito",
    "quais torneios", "que torneios", "em que torneio",
    "torneios", "torneio",
    "minha dupla", "meu parceiro", "minha parceira", "minha equipe",
    "quem é minha", "quem joga comigo", "meu parceiro",
    "resultado", "placar", "fase", "semifinal", "final",
]

_FRASES_BANCO = [
    "qual a minha", "quais são os meus", "quais são as minhas",
    "quando é minha", "qual o horário",
    "me mostre meus", "me mostre minhas",
    "em quais", "em qual",
    "posso me inscrever", "posso participar",
    "quantas partidas",
]


def classificar_intencao(pergunta: str) -> str:
    texto = pergunta.lower()
    for frase in _FRASES_BANCO:
        if frase in texto:
            return "banco"
    for palavra in _PALAVRAS_BANCO:
        if palavra in texto:
            return "banco"
    return "rag"


_FRASES_INSCRITOS = [
    "estou inscrito", "estou participando",
    "torneios que estou", "meus torneios",
    "quais torneios estou", "em que torneio estou",
    "em quais torneios estou", "que torneios estou",
    "minhas inscrições", "minha inscrição",
]

_FRASES_DISPONIVEIS = [
    "posso me inscrever", "posso participar",
    "torneios disponíveis", "todos os torneios",
    "quais torneios há", "quais torneios tem",
    "quais torneios existem", "me mostre os torneios",
]


def extrair_intencao_banco(pergunta: str) -> str:
    texto = pergunta.lower()

    # Dupla / equipe
    if any(p in texto for p in [
        "minha dupla", "meu parceiro", "minha parceira",
        "quem joga comigo", "minha equipe", "quem é meu parceiro",
    ]):
        return "dupla"

    # Partidas hoje
    if any(p in texto for p in [
        "partidas hoje", "jogo hoje", "jogar hoje",
        "partida hoje", "hoje tenho",
    ]):
        return "partidas_hoje"

    # Partidas na semana
    if any(p in texto for p in [
        "partidas da semana", "partidas na semana", "semana",
        "essa semana", "próxima semana", "proxima semana",
        "nos próximos dias", "nos proximos dias",
    ]):
        return "partidas_semana"

    # Partidas por torneio
    if any(p in texto for p in [
        "partidas no torneio", "partidas do torneio",
        "no torneio", "do torneio",
    ]):
        return "partidas_por_torneio"

    # Próxima partida
    if any(p in texto for p in [
        "próxima partida", "proxima partida",
        "quando jogo", "que horas", "horário", "horario",
        "próximo jogo", "proximo jogo", "próxima partida",
    ]):
        return "proxima_partida"

    # Todas as partidas
    if any(p in texto for p in [
        "minhas partidas", "meus jogos", "todas as partidas",
        "partidas que tenho", "quantas partidas", "todas partidas",
    ]):
        return "todas_partidas"

    # Inscrições
    if any(p in texto for p in _FRASES_INSCRITOS):
        return "torneios_inscritos"

    # Torneios disponíveis
    if any(p in texto for p in _FRASES_DISPONIVEIS):
        return "todos_torneios"

    # Fallback torneio genérico
    if "torneio" in texto:
        return "todos_torneios"

    return "desconhecido"