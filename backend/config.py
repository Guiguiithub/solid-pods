import os

CODE_DIR = os.path.dirname(__file__)
ROOT_DIR = os.path.dirname(CODE_DIR)
DATA_DIR = os.path.join(ROOT_DIR, "vector-database")
STATIC_DIR = os.path.join(ROOT_DIR, "static")

QDRANT_URL = os.environ.get("QDRANT_URL", "http://localhost:6333/")

COLLECTION_NAME = os.environ.get("COLLECTION_NAME", "steamVideoGames")
VECTOR_FIELD_NAME = "fast-bge-small-en"
TEXT_FIELD_NAME = "name"
