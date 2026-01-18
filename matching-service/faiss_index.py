import faiss
import numpy as np
from typing import List, Tuple


class FaissIndex:
    def __init__(self, dim: int):
        self.index = faiss.IndexFlatIP(dim)
        self.user_ids: list[str] = []

    def build(self, embeddings: np.ndarray, user_ids: list[str]):
        self.index.add(embeddings)
        self.user_ids = user_ids

    def search(self, query_embedding: np.ndarray, k: int) -> List[Tuple[str, float]]:
        scores, indices = self.index.search(query_embedding, k)
        results = []
        for idx, score in zip(indices[0], scores[0]):
            if idx == -1:
                continue
            results.append((self.user_ids[idx], float(score)))
        return results
