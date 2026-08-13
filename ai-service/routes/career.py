from fastapi import APIRouter
from models.schemas import CareerMatchRequest, CareerMatchResponse, RoadmapRequest, RoadmapResponse
from ai.career_matcher import match_career
from ai.roadmap_generator import generate_roadmap

router = APIRouter(prefix="/career", tags=["Career"])


@router.post("/match", response_model=CareerMatchResponse)
async def career_match_route(request: CareerMatchRequest):
    return await match_career(request)


@router.post("/roadmap", response_model=RoadmapResponse)
async def roadmap_route(request: RoadmapRequest):
    return await generate_roadmap(request)
