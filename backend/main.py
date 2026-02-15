from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routes.signup import router as signup_router
from routes.ingredients import router as ingredient_router
from routes.history import router as history_router
from routes.share import router as share_router
# ADD THIS IMPORT
from routes.forgot_password import router as forgot_password_router

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # <-- your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your routers
app.include_router(signup_router)
app.include_router(ingredient_router)
app.include_router(history_router)
app.include_router(share_router)
# ADD THIS NEW ROUTER with prefix
app.include_router(forgot_password_router, prefix="/auth", tags=["auth"])

# Optional: Add a root endpoint to test if API is running
@app.get("/")
async def root():
    return {"message": "Zero-Waste Kitchen API is running"}

# Optional: Add a health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}