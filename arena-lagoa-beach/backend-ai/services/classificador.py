_PALAVRAS_BANCO = [
    "minha partida", "minhas partidas", "próxima partida", "proxima partida",
    "quando jogo", "que horas", "horário", "horario",
    "meu jogo", "meus jogos", "partidas hoje", "partidas amanhã",
    "partidas da semana", "partidas na semana", "partidas dessa semana",
    "partidas no torneio", "partidas do torneio",
    "estou inscrito", "minha inscrição", "minhas inscrições",
    "inscricao", "inscrição", "inscrito",
    "quais torneios", "que torneios", "em que torneio",
    "próximos torneios", "proximos torneios",
    "minha dupla", "meu parceiro", "minha parceira", "minha equipe",
    "quem é minha", "quem joga comigo", "meu parceiro",
    "resultado", "placar", "fase", "semifinal", "final",
    "minhas duplas", "minhas equipes", "quais duplas",
]

_FRASES_BANCO = [
    "qual a minha", "quais são os meus", "quais são as minhas",
    "quando é minha", "qual o horário",
    "me mostre meus", "me mostre minhas",
    "em quais", "em qual",
    "posso me inscrever", "posso participar",
    "quantas partidas",
]

# Palavras que indicam pergunta GERAL sobre futevôlei — deve ir para RAG
_PALAVRAS_RAG = [
    "onde foi criado", "origem", "história", "como surgiu",
    "altura da rede", "medida", "dimensão", "tamanho",
    "regra", "regras", "como jogar", "como se joga",
    "posso jogar", "onde jogar", "onde praticar",
    "benefício", "vantagem", "saúde",
    "lesão", "lesoes", "prevenção",
    "técnica", "tática", "treino", "treinamento",
    "atleta", "campeão", "campeao", "mundial",
    "o que é futevôlei", "o que e futevolei",
    "futevôlei", "futevolei", "foot volley", "footvolley",
]


def classificar_intencao(pergunta: str) -> str:
    texto = pergunta.lower()

    # Se for claramente RAG, não vai para banco
    for palavra in _PALAVRAS_RAG:
        if palavra in texto:
            return "rag"

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
    "próximos torneios", "proximos torneios",
    "quais torneios", "que torneios",
]

# Frases para duplas
_FRASES_DUPLAS = [
    "minha dupla", "meu parceiro", "minha parceira",
    "quem joga comigo", "minha equipe", "quem é meu parceiro",
    "quem é minha", "minhas duplas", "minhas equipes",
    "quais duplas", "quais são minhas duplas",
]


def extrair_intencao_banco(pergunta: str) -> str:
    texto = pergunta.lower()

    # Detectar duplas (prioridade alta) → agora retorna "dupla"
    if any(p in texto for p in _FRASES_DUPLAS):
        return "dupla"

    if any(p in texto for p in [
        "partidas hoje", "jogo hoje", "jogar hoje",
        "partida hoje", "hoje tenho",
    ]):
        return "partidas_hoje"

    if any(p in texto for p in [
        "partidas da semana", "partidas na semana", "semana",
        "essa semana", "próxima semana", "proxima semana",
        "nos próximos dias", "nos proximos dias",
    ]):
        return "partidas_semana"

    if any(p in texto for p in [
        "partidas no torneio", "partidas do torneio",
        "no torneio", "do torneio",
    ]):
        return "partidas_por_torneio"

    if any(p in texto for p in [
        "próxima partida", "proxima partida",
        "quando jogo", "que horas", "horário", "horario",
        "próximo jogo", "proximo jogo",
    ]):
        return "proxima_partida"

    if any(p in texto for p in [
        "minhas partidas", "meus jogos", "todas as partidas",
        "partidas que tenho", "quantas partidas", "todas partidas",
    ]):
        return "todas_partidas"

    if any(p in texto for p in _FRASES_INSCRITOS):
        return "torneios_inscritos"

    if any(p in texto for p in _FRASES_DISPONIVEIS):
        return "todos_torneios"

    return "desconhecido"