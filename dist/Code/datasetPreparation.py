from sentence_transformers import SentenceTransformer
import numpy as np
import json
import pandas as pd

# prepare the encoding for the vectors
model = SentenceTransformer(
    "all-MiniLM-L6-v2", device="cpu"
)

# Read JSON data into a DataFrame
with open("../Data/RawData/final_data_new.json", "r") as f:
    data = json.load(f)

# Convert JSON data into DataFrame
df = pd.json_normalize(data)
"""
lt = pd.read_json("../Data/RawData/final_data_new.json")
lt['name'].fillna('', inplace=True)
lt['publisher'].fillna('', inplace=True)
texts = lt['name'] + ' ' + lt['publisher']
vectors = model.encode(
    texts.tolist(),
    show_progress_bar=True
)
np.save("steam_games.npy", vectors, allow_pickle=False)
"""
# Check if 'name' column exists before processing
if 'name' in df.columns:
    # Drop rows with missing 'name' attribute
    df = df.dropna(subset=['name'])

    # Encode names using SentenceTransformer
    vectors = model.encode(df['name'].tolist(), show_progress_bar=True)

    # Save encoded vectors
    np.save("steam_games.npy", vectors, allow_pickle=False)
    
