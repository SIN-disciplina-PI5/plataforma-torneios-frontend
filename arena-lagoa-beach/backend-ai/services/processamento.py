import re

def limpar_texto(texto: str) -> str:
    texto = re.sub(r'\s+', ' ', texto)
    return texto.strip()


def chunk_texto(texto: str, tamanho: int = 500, overlap: int = 100) -> list[str]:
    palavras = texto.split()
    chunks = []

    i = 0
    while i < len(palavras):
        chunk = " ".join(palavras[i:i + tamanho])
        if chunk.strip():
            chunks.append(chunk)
        i += tamanho - overlap

    return chunks


def processar_texto(texto: str) -> list[str]:
    texto_limpo = limpar_texto(texto)
    chunks = chunk_texto(texto_limpo)
    return chunks