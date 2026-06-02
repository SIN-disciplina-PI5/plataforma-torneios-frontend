import pickle

import faiss
import numpy as np
from sentence_transformers import CrossEncoder, SentenceTransformer


class RAG:
    THRESHOLD_PADRAO = 0.5
    CANDIDATOS_PADRAO = 10
    TOP_K_RERANKER = 3

    def __init__(
        self,
        index_path: str = "faiss.index",
        metadata_path: str = "metadata.pkl",
        embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2",
        reranker_model: str = "BAAI/bge-reranker-base",
    ) -> None:
        self.index = faiss.read_index(index_path)

        with open(metadata_path, "rb") as f:
            self.chunks: list[dict] = pickle.load(f)

        self.modelo = SentenceTransformer(embedding_model)
        self.reranker = self._carregar_reranker(reranker_model)

        print(f"RAG carregado - {len(self.chunks)} chunks indexados.")
        if self.reranker:
            print(f"Re-ranker carregado - {reranker_model}")

    def _carregar_reranker(self, reranker_model: str) -> CrossEncoder | None:
        try:
            return CrossEncoder(reranker_model)
        except Exception as exc:
            print(f"Re-ranker indisponivel ({reranker_model}): {exc}")
            print("Continuando com ordenacao vetorial como fallback.")
            return None

    def _gerar_embedding(self, texto: str) -> np.ndarray:
        embedding = self.modelo.encode([texto])
        vetor = np.array(embedding).astype("float32")
        faiss.normalize_L2(vetor)
        return vetor

    def _rerank(
        self,
        query: str,
        resultados: list[dict],
        top_k: int = TOP_K_RERANKER,
    ) -> list[dict]:
        if not resultados:
            return []

        if not self.reranker:
            return [
                {**item, "rerank_score": None}
                for item in resultados[:top_k]
            ]

        pares = [(query, item["texto"]) for item in resultados]
        rerank_scores = self.reranker.predict(pares)

        rerankeados = []
        for item, rerank_score in zip(resultados, rerank_scores):
            rerankeados.append({
                **item,
                "rerank_score": round(float(rerank_score), 4),
            })

        rerankeados.sort(key=lambda item: item["rerank_score"], reverse=True)
        return rerankeados[:top_k]

    def busca(
        self,
        query: str,
        k: int = CANDIDATOS_PADRAO,
        threshold: float = THRESHOLD_PADRAO,
        top_k: int = TOP_K_RERANKER,
    ) -> list[dict]:
        """
        Busca candidatos no FAISS, reordena com CrossEncoder e retorna top 3.

        Retorna lista de dicts com:
            - texto: conteudo do chunk
            - score: cosine similarity vetorial
            - rerank_score: score do re-ranker cross-encoder
            - arquivo: nome do arquivo de origem
            - pagina: numero da pagina (None para TXT)
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
                "texto": chunk["texto"],
                "score": round(float(score), 4),
                "arquivo": chunk.get("arquivo", "desconhecido"),
                "pagina": chunk.get("pagina"),
            })

        resultados.sort(key=lambda item: item["score"], reverse=True)
        return self._rerank(query, resultados, top_k=top_k)

    def retrieve(self, query: str, k: int = CANDIDATOS_PADRAO) -> list[dict]:
        """Alias usado pelo LangGraph - retorna ate 3 chunks apos re-ranking."""
        return self.busca(query, k=k, top_k=self.TOP_K_RERANKER)
