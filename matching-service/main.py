from fastapi import FastAPI, HTTPException
import numpy as np

from models import MatchRequest, MatchResponse, MatchResult
from embeddings import embed_texts
from faiss_index import FaissIndex
from reranker import rerank
from data import USER_PROFILES

app = FastAPI(title="Matching Service")

# Build index at startup
user_ids = list(USER_PROFILES.keys())
texts = [USER_PROFILES[u] for u in user_ids]

embeddings = embed_texts(texts)
dim = embeddings.shape[1]

faiss_index = FaissIndex(dim)
faiss_index.build(embeddings, user_ids)


@app.post("/match", response_model=MatchResponse)
async def match(req: MatchRequest):
    if req.user_id not in USER_PROFILES:
        raise HTTPException(status_code=404, detail="User not found")

    query_text = USER_PROFILES[req.user_id]
    query_embedding = embed_texts([query_text])

    raw_results = faiss_index.search(query_embedding, req.top_k + 1)

    # Remove self
    raw_results = [
        (uid, score)
        for uid, score in raw_results
        if uid != req.user_id
    ]

    reranked = rerank(raw_results)

    matches = [
        MatchResult(user_id=uid, score=score)
        for uid, score in reranked[: req.top_k]
    ]

    return MatchResponse(matches=matches)
