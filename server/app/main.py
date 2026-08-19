from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth import router as auth_router
from app.routes.projects import router as projects_router
from app.routes.skills import router as skills_router
from app.routes.certificates import router as certificates_router

app = FastAPI(
    title="Portfolio API",
    description="Backend for Ash's personal portfolio with admin panel",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(projects_router, prefix="/api/projects", tags=["Projects"])
app.include_router(skills_router, prefix="/api/skills", tags=["Skills"])
app.include_router(certificates_router, prefix="/api/certificates", tags=["Certificates"])


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "Portfolio API is running"}
