# services/classificador.py

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
    # ranking
    "meu ranking", "minha posição", "minha posicao",
    "minha pontuação", "minha pontuacao", "meus pontos",
    "minha patente", "quantos pontos tenho",
    "ranking geral", "ranking dos jogadores", "top jogadores",
    "melhores jogadores", "quem está em primeiro", "quem ta em primeiro",
    "classificação", "classificacao", "tabela de pontos",
    "quem lidera", "líder do ranking", "lider do ranking",
    "posição no ranking", "posicao no ranking",
    # ranking — novos
    "top 10", "top 5", "top 3", "top 20", "top 50",
    "acima de mim", "à minha frente", "a minha frente",
    "quem está antes", "quem esta antes",
    "quem está acima", "quem esta acima",
    "quem está na frente", "quem esta na frente",
]

_FRASES_BANCO = [
    "qual a minha", "quais são os meus", "quais são as minhas",
    "quando é minha", "qual o horário",
    "me mostre meus", "me mostre minhas",
    "em quais", "em qual",
    "posso me inscrever", "posso participar",
    "quantas partidas",
    # ranking
    "qual é meu ranking", "qual e meu ranking",
    "onde estou no ranking", "como estou no ranking",
    "qual minha posição", "qual minha posicao",
    "quem está na posição", "quem esta na posicao",
    "me mostre o ranking", "me mostra o ranking",
    # ranking — novos
    "qual é o top", "qual e o top",
    "quem está acima", "quem esta acima",
    "quem está à minha", "quem esta a minha",
    "quem está na frente", "quem esta na frente",
]

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

_FRASES_DUPLAS = [
    "minha dupla", "meu parceiro", "minha parceira",
    "quem joga comigo", "minha equipe", "quem é meu parceiro",
    "quem é minha", "minhas duplas", "minhas equipes",
    "quais duplas", "quais são minhas duplas",
]

_FRASES_RANKING_USUARIO = [
    "meu ranking", "minha posição", "minha posicao",
    "minha pontuação", "minha pontuacao", "meus pontos",
    "minha patente", "quantos pontos tenho",
    "onde estou no ranking", "como estou no ranking",
    "qual minha posição", "qual minha posicao",
    "qual é meu ranking", "qual e meu ranking",
    "posição no ranking", "posicao no ranking",
]

_FRASES_RANKING_GERAL = [
    "ranking geral", "ranking dos jogadores", "top jogadores",
    "melhores jogadores", "classificação geral", "classificacao geral",
    "tabela de pontos", "quem lidera", "líder do ranking", "lider do ranking",
    "me mostre o ranking", "me mostra o ranking",
    "quem está em primeiro", "quem ta em primeiro",
    # novos
    "top 10", "top 5", "top 3", "top 20", "top 50",
    "qual é o top", "qual e o top",
    "acima de mim", "à minha frente", "a minha frente",
    "quem está antes", "quem esta antes",
    "quem está acima", "quem esta acima",
    "quem está na frente", "quem esta na frente",
]

_FRASES_RANKING_POSICAO = [
    "quem está na posição", "quem esta na posicao",
    "quem está em", "quem ocupa",
    "primeiro lugar", "segundo lugar", "terceiro lugar",
]


def extrair_intencao_banco(pergunta: str) -> str:
    texto = pergunta.lower()

    # Duplas (prioridade alta)
    if any(p in texto for p in _FRASES_DUPLAS):
        return "dupla"

    # Ranking do usuário (prioridade antes do geral)
    if any(p in texto for p in _FRASES_RANKING_USUARIO):
        return "ranking_usuario"

    # Ranking por posição específica
    if any(p in texto for p in _FRASES_RANKING_POSICAO):
        return "ranking_posicao"

    # Ranking geral — inclui top N e "quem está acima de mim"
    if any(p in texto for p in _FRASES_RANKING_GERAL):
        import re
        match = re.search(r"\b(?:top\s*)?(\d+)\b", texto)
        limite = int(match.group(1)) if match and int(match.group(1)) <= 100 else 10
        # Guarda o limite no texto não é possível, mas o grafo.py já extrai da pergunta
        return "ranking_geral"

    # Partidas
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

    # Torneios
    if any(p in texto for p in _FRASES_INSCRITOS):
        return "torneios_inscritos"

    if any(p in texto for p in _FRASES_DISPONIVEIS):
        return "todos_torneios"

    return "desconhecido"