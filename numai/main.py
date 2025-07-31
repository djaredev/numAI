from importlib.resources import files
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from numai.modai.model import load_model, transform, predict
from typing import List

model = load_model()
transfor = transform()


class X(BaseModel):
    image: List[int]


app = FastAPI()

app.mount("/static", StaticFiles(directory=files("numai") / "static"), name="static")  # type: ignore


@app.get("/", response_class=HTMLResponse)
async def root():
    html_path = files("numai") / "html/index.html"
    return FileResponse(html_path, status_code=200)  # type: ignore


@app.post("/numai")
async def numai(X: X):
    y = predict(model, transfor, X.image)
    return {"predict": y}
