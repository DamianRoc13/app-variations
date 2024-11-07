from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from typing import List
import math  # Agregamos la librería math estándar de Python

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VariationInput(BaseModel):
    n: int
    r: int

class DataInput(BaseModel):
    values: List[float]
    parameter: float

@app.get("/")
async def read_root():
    return {"message": "API de Cálculos Matemáticos"}

@app.post("/calculate/variation")
async def calculate_variation(input: VariationInput):
    try:
        n = input.n
        r = input.r
        if n < r:
            raise HTTPException(status_code=400, detail="n debe ser mayor o igual a r")
        
        # Calcular variación usando math.factorial
        variation = math.factorial(n) // math.factorial(n - r)
        return {"result": variation}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/calculate/standard-deviation")
async def calculate_std(input: DataInput):
    try:
        values = np.array(input.values)
        std = np.std(values)
        mean = np.mean(values)
        return {
            "standard_deviation": float(std),
            "mean": float(mean)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/calculate/variance")
async def calculate_variance(input: DataInput):
    try:
        values = np.array(input.values)
        variance = np.var(values)
        return {"variance": float(variance)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Agregar un nuevo endpoint para permutaciones
@app.post("/calculate/permutation")
async def calculate_permutation(input: DataInput):
    try:
        n = len(input.values)
        permutation = math.factorial(n)
        return {"permutation": permutation}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))