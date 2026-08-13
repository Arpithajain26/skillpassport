from fastapi import APIRouter
from models.schemas import (
    AssessmentGenerateRequest, AssessmentGenerateResponse,
    AssessmentSubmitRequest, AssessmentSubmitResponse,
)
from ai.assessment_generator import generate_assessment, score_assessment

router = APIRouter(prefix="/assessment", tags=["Assessment"])


@router.post("/generate", response_model=AssessmentGenerateResponse)
async def generate_assessment_route(request: AssessmentGenerateRequest):
    return await generate_assessment(request)


@router.post("/submit", response_model=AssessmentSubmitResponse)
async def submit_assessment_route(request: AssessmentSubmitRequest):
    return score_assessment(request)
