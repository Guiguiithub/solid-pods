from typing import List
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models.models import Filter
from sentence_transformers import SentenceTransformer


# get the result in a good format
def get_results(hits: list, score: bool):
    seen_name = []
    results = []

    for hit in hits:
        print("here")
        print(hit)
        name = hit.payload["name"]
        if name not in seen_name:
            result = hit.payload
            if score:
                result['score'] = hit.score
            result['ident'] = hit.id
            results.append(result)
            seen_name.append(name)
    return results


class NeuralSearcher:

    def __init__(self, collection_name: str):
        self.collection_name = collection_name
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.qdrant_client = QdrantClient("localhost", port=6333)

    # search for similar games based on input
    def search(self, text: str, filter_: dict = None) -> List[dict]:
        vector = self.model.encode(text).tolist()
        hits = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=vector,
            query_filter=Filter(**filter_) if filter_ else None,
            limit=150,
        )

        return get_results(hits, True)

    # get all data from database
    def get_all_data(self) -> List[dict]:
        # Use an empty string as the query to retrieve all documents
        return self.search(text="", filter_=None)

    # get recommendation based on likes and dislikes
    def recommend(self, positif: list, negitif: list) -> List[dict]:
        hits = self.qdrant_client.recommend(
            collection_name=self.collection_name,
            positive=positif,
            negative=negitif,
            limit=15
        )

        return get_results(hits, True)

    # search a game based on his id
    def search_id(self, text: list) -> List[dict]:
        hits = self.qdrant_client.scroll(
            collection_name=self.collection_name,
            scroll_filter=models.Filter(
                must=[
                    models.HasIdCondition(has_id=text),
                ]
            )
        )

        return get_results(hits[0], False)

    def look_id(self, text: str) -> List[dict]:
        print("here")
        hits = self.qdrant_client.scroll(
            collection_name=self.collection_name,
            scroll_filter=models.Filter(
                must=[
                    models.HasIdCondition(has_id=[text]),
                ]
            )
        )
        print(hits)
        if hits:
            return get_results(hits[0], False)
        else:
            return []
