import json
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
import numpy as np

#set the qdrant client
qdrant_client = QdrantClient("http://localhost:6333", timeout=60)

# create a collection (or delete and create a new one if already existed)
qdrant_client.recreate_collection(
    collection_name="steamVideoGames",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

# Load all vectors into memory, numpy array works as iterable for itself.
vectors = np.load("./steam_games.npy")

with open("../Data/RawData/final_data_new.json") as fd:
    # Read the entire JSON content from the file
    payload = json.load(fd)

batch_size = 256
start_index = 0

while start_index < len(vectors):
    try:
        end_index = min(start_index + batch_size, len(vectors))
        qdrant_client.upload_collection(
            collection_name="steamVideoGames",
            vectors=vectors[start_index:end_index],
            payload=payload[start_index:end_index],
            ids=None,  # Vector ids will be assigned automatically
            batch_size=batch_size,  # How many rows will be added each upload
        )
        start_index = end_index
    except Exception as e:
        print(f"Batch upload failed: {e}. Skipping to next batch.")
        start_index = end_index

print("All vectors uploaded successfully.")

