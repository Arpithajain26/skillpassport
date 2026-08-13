"""Analyzes skill gaps between current skills and target role requirements."""
import json
from models.schemas import SkillGapRequest, SkillGapResponse, SkillGapItem
from ai.mock_responses import ROLE_REQUIRED_SKILLS
from config import settings

LEVEL_ORDER = ["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"]


def level_to_int(level: str) -> int:
    try:
        return LEVEL_ORDER.index(level)
    except ValueError:
        return 2


async def analyze_skill_gaps(request: SkillGapRequest) -> SkillGapResponse:
    if settings.use_mock:
        return _mock_skill_gaps(request)
    return await _llm_skill_gaps(request)


def _mock_skill_gaps(request: SkillGapRequest) -> SkillGapResponse:
    # Find closest matching role
    target_role = request.target_role
    required = None
    for role_key in ROLE_REQUIRED_SKILLS:
        if role_key.lower() in target_role.lower() or target_role.lower() in role_key.lower():
            required = ROLE_REQUIRED_SKILLS[role_key]
            break
    if not required:
        required = ROLE_REQUIRED_SKILLS.get("Full Stack Developer", [])

    user_skill_names = {s["name"].lower(): s for s in request.current_skills}
    gaps = []
    matched = []

    for req in required:
        skill_lower = req["skill"].lower()
        user_skill = user_skill_names.get(skill_lower)
        if user_skill:
            user_level = level_to_int(user_skill.get("proficiencyLevel", "Beginner"))
            req_level = level_to_int(req["level"])
            if user_level >= req_level:
                matched.append(req["skill"])
            else:
                gap_score = (req_level - user_level) * 25
                gaps.append(SkillGapItem(
                    skill=req["skill"],
                    current_level=user_skill.get("proficiencyLevel"),
                    required_level=req["level"],
                    gap_score=min(100, gap_score),
                    priority=req["priority"],
                    resources=["Online courses", "Practice projects", "Documentation"],
                ))
        else:
            gaps.append(SkillGapItem(
                skill=req["skill"],
                current_level=None,
                required_level=req["level"],
                gap_score=75,
                priority=req["priority"],
                resources=["Beginner tutorials", "Official documentation", "Practice projects"],
            ))

    total = len(required)
    match_pct = int((len(matched) / total) * 100) if total > 0 else 0
    critical_gaps = [g.skill for g in gaps if g.priority == "Critical"]

    return SkillGapResponse(
        gaps=gaps,
        match_percentage=match_pct,
        analysis_summary=(
            f"You match {match_pct}% of the required skills for {request.target_role}. "
            f"Your strongest areas are {', '.join(matched[:3]) if matched else 'still developing'}. "
            f"Focus on {', '.join(critical_gaps[:2]) if critical_gaps else 'building breadth'} to close critical gaps."
        ),
        top_strengths=matched[:4],
        critical_gaps=critical_gaps[:4],
    )


async def _llm_skill_gaps(request: SkillGapRequest) -> SkillGapResponse:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=settings.openai_api_key, base_url=settings.openai_base_url)
    prompt = f"""Analyze the skill gap for someone targeting {request.target_role}.
Current skills: {json.dumps(request.current_skills)}
Return JSON with: gaps (list of skill gap objects), match_percentage, analysis_summary, top_strengths, critical_gaps."""
    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    data = json.loads(response.choices[0].message.content)
    return SkillGapResponse(
        gaps=[SkillGapItem(**g) for g in data.get("gaps", [])],
        match_percentage=data.get("match_percentage", 50),
        analysis_summary=data.get("analysis_summary", ""),
        top_strengths=data.get("top_strengths", []),
        critical_gaps=data.get("critical_gaps", []),
    )
