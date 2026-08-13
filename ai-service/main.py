from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings
from routes.evidence import router as evidence_router
from routes.skills import router as skills_router
from routes.career import router as career_router
from routes.assessment import router as assessment_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    mode = "MOCK (no LLM key)" if settings.use_mock else f"REAL ({settings.openai_model})"
    print(f"\n[AI Service] SkillPassport AI Service starting in {mode} mode")
    yield
    print("\n[AI Service] AI Service shutting down")


app = FastAPI(
    title="SkillPassport AI Service",
    description="AI-powered skill analysis, career matching, and roadmap generation",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(evidence_router, prefix="/api")
app.include_router(skills_router, prefix="/api")
app.include_router(career_router, prefix="/api")
app.include_router(assessment_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "service": "SkillPassport AI Service",
        "version": "1.0.0",
        "mode": "mock" if settings.use_mock else "real",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok", "mock_mode": settings.use_mock}
