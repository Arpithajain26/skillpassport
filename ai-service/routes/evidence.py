from fastapi import APIRouter
from models.schemas import EvidenceAnalysisRequest, EvidenceAnalysisResponse
from ai.evidence_analyzer import analyze_evidence

router = APIRouter(prefix="/evidence", tags=["Evidence"])


@router.post("/analyze", response_model=EvidenceAnalysisResponse)
async def analyze_evidence_route(request: EvidenceAnalysisRequest):
    return await analyze_evidence(request)
