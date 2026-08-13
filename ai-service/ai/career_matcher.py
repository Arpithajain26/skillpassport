"""Matches user skills to career roles."""
import json
from models.schemas import CareerMatchRequest, CareerMatchResponse
from ai.mock_responses import ROLE_REQUIRED_SKILLS
from config import settings


async def match_career(request: CareerMatchRequest) -> CareerMatchResponse:
    if settings.use_mock:
        return _mock_career_match(request)
    return await _llm_career_match(request)


def _mock_career_match(request: CareerMatchRequest) -> CareerMatchResponse:
    target = request.target_role
    required = None
    for role_key in ROLE_REQUIRED_SKILLS:
        if role_key.lower() in target.lower() or target.lower() in role_key.lower():
            required = ROLE_REQUIRED_SKILLS[role_key]
            break
    if not required:
        required = ROLE_REQUIRED_SKILLS.get("Full Stack Developer", [])

    user_skill_names = {s["name"].lower() for s in request.user_skills}
    required_names = [r["skill"] for r in required]
    matching = [r for r in required_names if r.lower() in user_skill_names]
    missing = [r for r in required_names if r.lower() not in user_skill_names]
    partial = []

    match_pct = min(98, int((len(matching) / max(len(required_names), 1)) * 100))
    evidence_bonus = min(10, request.evidence_count // 2) if request.evidence_count else 0
    match_pct = min(98, match_pct + evidence_bonus)

    return CareerMatchResponse(
        match_percentage=match_pct,
        matching_skills=matching,
        missing_skills=missing[:5],
        partial_skills=partial,
        assessment=(
            f"You have a strong foundation for {target}. "
            f"Your skills in {', '.join(matching[:3])} are particularly relevant. "
            f"Strengthening {', '.join(missing[:2]) if missing else 'deployment skills'} would significantly improve your match."
        ),
        next_steps=[
            f"Add a project demonstrating {missing[0]}" if missing else "Add more complex projects",
            "Get a relevant certification",
            "Contribute to open-source projects",
            "Build your portfolio with real-world applications",
        ],
    )


async def _llm_career_match(request: CareerMatchRequest) -> CareerMatchResponse:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=settings.openai_api_key, base_url=settings.openai_base_url)
    prompt = f"""Analyze career match for {request.target_role}.
User skills: {json.dumps(request.user_skills)}
Return JSON: match_percentage, matching_skills, missing_skills, partial_skills, assessment, next_steps."""
    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    data = json.loads(response.choices[0].message.content)
    return CareerMatchResponse(**data)
