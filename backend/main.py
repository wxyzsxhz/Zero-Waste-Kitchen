from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routes.signup import router as signup_router
from routes.ingredients import router as ingredient_router
from routes.history import router as history_router

app = FastAPI()

# Include your signup router
app.include_router(signup_router)
app.include_router(ingredient_router)
app.include_router(history_router)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # <-- your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
