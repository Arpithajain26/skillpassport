from fastapi import APIRouter
from models.schemas import SkillGapRequest, SkillGapResponse, ProfileSummaryRequest, ProfileSummaryResponse
from ai.skill_gap_analyzer import analyze_skill_gaps
from ai.profile_summary import generate_summary

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.post("/gap-analysis", response_model=SkillGapResponse)
async def skill_gap_route(request: SkillGapRequest):
    return await analyze_skill_gaps(request)


@router.post("/summary", response_model=ProfileSummaryResponse)
async def profile_summary_route(request: ProfileSummaryRequest):
    return await generate_summary(request)
