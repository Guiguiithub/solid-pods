from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import json

from api import NeuralSearcher

app = FastAPI()

# Create a neural searcher instance
neural_searcher = NeuralSearcher(collection_name="steamVideoGames")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.get("/api/search")
def search_startup(q: str):
    return {"result": neural_searcher.search(text=q)}


@app.get("/api/getall")
def all_startup():
    try:
        data = neural_searcher.get_all_data()
        return {"result": data}
    except Exception as e:
        return {"error": str(e)}

@app.options("/api/getall")
def options_getall(response: Response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

@app.post("/api/recommend")
def recommend(request: dict):
    try:
        rawLike = request.get("likeIds")
        rawDislike = request.get("dislikeIds")

        liked_ids = json.loads(rawLike)
        disliked_ids = json.loads(rawDislike)

        result = neural_searcher.recommend(positif=liked_ids, negitif=disliked_ids)
        return {"result": result}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/research")
def search_id(request: dict):
    try:
        rawLike = request.get("search")

        liked_ids = json.loads(rawLike)
        print(liked_ids)
        data = neural_searcher.search_id(liked_ids)
        return {"result": data}
    except Exception as e:
        return {"error": e}

@app.post("/api/look")
def look_id(request: str):
    try:
        print(request)
        data = neural_searcher.look_id(request)
        print(data)
        return {"result": data}
    except Exception as e:
        return {"error": e}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
