import faiss
import numpy as np
import pickle
from sentence_transformers import SentenceTransformer

class RAG:
    
    THRESHOLD_PADRAO = 0.5

    def _init_(
        self,
        index_path: str = "faiss.index",
        metadata_path: str = "metadata.pkl",
    ) -> None:
        self.index = faiss.read_index(index_path)

        with open(metadata_path, "rb") as f:
            # lista de dicts
            self.chunks: list[dict] = pickle.load(f)

        self.modelo = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        print(f"RAG carregado — {len(self.chunks)} chunks indexados.")

    def _gerar_embedding(self, texto: str) -> np.ndarray:
        embedding = self.modelo.encode([texto])
        vetor = np.array(embedding).astype("float32")
        # Normalização L2 obrigatória para usar IndexFlatIP como cosine
        faiss.normalize_L2(vetor)
        return vetor

    def busca(
        self,
        query: str,
        k: int = 5,
        threshold: float = THRESHOLD_PADRAO,
    ) -> list[dict]:
        """
        Retorna lista de dicts com:
            - texto   : conteúdo do chunk
            - score   : cosine similarity (0 a 1, quanto maior melhor)
            - arquivo : nome do arquivo de origem
            - pagina  : número da página (None para TXT)
        """
        query_vector = self._gerar_embedding(query)
        scores, indices = self.index.search(query_vector, k)

        resultados = []
        for score, i in zip(scores[0], indices[0]):
            if i < 0 or i >= len(self.chunks):
                continue
            if score < threshold:
                continue

            chunk = self.chunks[i]
            resultados.append({
                "texto":   chunk["texto"],
                "score":   round(float(score), 4),
                "arquivo": chunk.get("arquivo", "desconhecido"),
                "pagina":  chunk.get("pagina"),
            })

        # Ordena do mais relevante para o menos (score decrescente)
        resultados.sort(key=lambda x: x["score"], reverse=True)
        return resultados

    #grafo.py ──────────────────────────────────────────

    def retrieve(self, query: str, k: int = 5) -> list[dict]:
        """Alias usado pelo LangGraph — retorna mesma estrutura que busca()."""
        return self.busca(query, k)