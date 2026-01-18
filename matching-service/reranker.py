#plug in llm later 
def rerank(
    base_results: list[tuple[str, float]],
    boost_same_keywords: bool = True,
) -> list[tuple[str, float]]:
    reranked = []

    for user_id, score in base_results:
        bonus = 0.0

        # Placeholder heuristic
        if boost_same_keywords:
            if "cs" in user_id.lower():
                bonus += 0.05

        reranked.append((user_id, score + bonus))

    reranked.sort(key=lambda x: x[1], reverse=True)
    return reranked
