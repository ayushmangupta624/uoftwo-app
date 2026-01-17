from pydantic import BaseModel
from typing import List


class MatchRequest(BaseModel):
    user_id: str
    top_k: int = 20


class MatchResult(BaseModel):
    user_id: str
    score: float


class MatchResponse(BaseModel):
    matches: List[MatchResult]
