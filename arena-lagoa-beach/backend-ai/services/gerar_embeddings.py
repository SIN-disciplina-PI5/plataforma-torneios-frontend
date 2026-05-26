import os
import faiss
import numpy as np
import pickle
from sentence_transformers import SentenceTransformer
from pypdf import PdfReader
from services.processamento import processar_texto


def construir_banco_vetorial(pasta_arquivos: str = "base_conhecimento") -> None:
    print("Iniciando a geração de embeddings...")

    modelo = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    # Cada item agora é um dict com texto + metadados
    todos_os_chunks: list[dict] = []
    arquivos_processados = 0
    arquivos_com_erro = 0

    if not os.path.exists(pasta_arquivos):
        os.makedirs(pasta_arquivos)
        print(f"Pasta '{pasta_arquivos}' criada. Adicione arquivos e rode novamente.")
        return

    for arquivo in os.listdir(pasta_arquivos):
        caminho = os.path.join(pasta_arquivos, arquivo)
        chunks_do_arquivo: list[dict] = []

        # ── TXT ──
        if arquivo.endswith(".txt"):
            try:
                with open(caminho, 'r', encoding='utf-8') as f:
                    texto = f.read()
                print(f"Lido TXT: {arquivo}")

                for chunk in processar_texto(texto):
                    chunks_do_arquivo.append({
                        "texto":   chunk,
                        "arquivo": arquivo,
                        "pagina":  None,        # TXT não tem página
                    })

            except Exception as e:
                print(f"Erro ao ler TXT {arquivo}: {e}")
                arquivos_com_erro += 1
                continue

        # ── PDF ──
        elif arquivo.endswith(".pdf"):
            try:
                reader = PdfReader(caminho)
                texto_total = ""
                paginas_com_erro = 0

                for num_pagina, page in enumerate(reader.pages, start=1):
                    try:
                        texto_pagina = page.extract_text() or ""
                        if texto_pagina.strip():
                            # Gera chunks por página pra preservar metadado de página
                            for chunk in processar_texto(texto_pagina):
                                chunks_do_arquivo.append({
                                    "texto":   chunk,
                                    "arquivo": arquivo,
                                    "pagina":  num_pagina,
                                })
                    except Exception:
                        paginas_com_erro += 1
                        continue

                if paginas_com_erro:
                    print(f"  Aviso: {paginas_com_erro} página(s) com erro ignoradas em {arquivo}")

                if not chunks_do_arquivo:
                    print(f"PDF sem texto extraível: {arquivo}")
                    continue

                print(f"Lido PDF: {arquivo} ({len(chunks_do_arquivo)} chunks gerados)")

            except Exception as e:
                print(f"Erro ao ler PDF {arquivo}: {e}")
                arquivos_com_erro += 1
                continue

        else:
            # Formato não suportado — ignora silenciosamente
            continue

        if chunks_do_arquivo:
            todos_os_chunks.extend(chunks_do_arquivo)
            arquivos_processados += 1
            print(f"  -> {len(chunks_do_arquivo)} chunks de '{arquivo}'")

    # ── Resumo ──
    print(f"\nResumo: {arquivos_processados} arquivo(s) processado(s), "
          f"{arquivos_com_erro} com erro")

    if not todos_os_chunks:
        print("Nenhum chunk gerado. Verifique os arquivos na pasta.")
        return

    # ── Embeddings ──
    print(f"Total de chunks: {len(todos_os_chunks)}")
    print("Gerando embeddings...")

    textos = [item["texto"] for item in todos_os_chunks]
    embeddings = modelo.encode(textos, show_progress_bar=True)
    embeddings_np = np.array(embeddings).astype('float32')

    # Normalização L2 → permite usar IndexFlatIP como cosine similarity
    faiss.normalize_L2(embeddings_np)

    # ── Índice FAISS (Inner Product ≈ Cosine após normalização) ──
    print("Criando índice FAISS (IndexFlatIP)...")
    dimension = embeddings_np.shape[1]
    index = faiss.IndexFlatIP(dimension)
    index.add(embeddings_np)

    # ── Persistência ───
    print("Salvando arquivos...")
    faiss.write_index(index, "faiss.index")
    with open("metadata.pkl", "wb") as f:
        pickle.dump(todos_os_chunks, f)

    print(f"\nConcluído! faiss.index e metadata.pkl salvos "
          f"com {len(todos_os_chunks)} chunks.")


if __name__ == "__main__":
    construir_banco_vetorial()