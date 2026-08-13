"""Generates AI profile summaries."""
import json
from models.schemas import ProfileSummaryRequest, ProfileSummaryResponse
from config import settings


async def generate_summary(request: ProfileSummaryRequest) -> ProfileSummaryResponse:
    if settings.use_mock:
        return _mock_summary(request)
    return await _llm_summary(request)


def _mock_summary(request: ProfileSummaryRequest) -> ProfileSummaryResponse:
    top_skills = [s["name"] for s in request.skills[:3]] if request.skills else ["various technologies"]
    skill_str = ", ".join(top_skills)
    evidence_parts = []
    if request.projects_count:
        evidence_parts.append(f"{request.projects_count} project{'s' if request.projects_count > 1 else ''}")
    if request.certificates_count:
        evidence_parts.append(f"{request.certificates_count} certificate{'s' if request.certificates_count > 1 else ''}")
    if request.internships_count:
        evidence_parts.append(f"{request.internships_count} internship{'s' if request.internships_count > 1 else ''}")
    if request.assessments_count:
        evidence_parts.append(f"{request.assessments_count} assessment{'s' if request.assessments_count > 1 else ''}")
    
    evidence_str = " and ".join(evidence_parts[:3]) if evidence_parts else "multiple projects"
    target_str = f" targeting {request.target_role}" if request.target_role else ""
    
    summary = (
        f"{request.name} is a skilled developer with demonstrated expertise in {skill_str}, "
        f"supported by {evidence_str}." + (f" Currently{target_str}." if target_str else "")
    )
    headline = f"{top_skills[0] if top_skills else 'Software'} Developer | {top_skills[1] if len(top_skills) > 1 else 'Full Stack'} | {request.target_role or 'Open to Opportunities'}"
    
    return ProfileSummaryResponse(
        summary=summary,
        headline=headline,
        key_strengths=top_skills[:4] + (["Problem Solving", "Collaboration"] if len(top_skills) < 4 else []),
    )


async def _llm_summary(request: ProfileSummaryRequest) -> ProfileSummaryResponse:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=settings.openai_api_key, base_url=settings.openai_base_url)
    prompt = f"""Generate a professional summary for {request.name}.
Skills: {json.dumps(request.skills)}
Evidence: {request.projects_count} projects, {request.certificates_count} certificates, {request.internships_count} internships
Target role: {request.target_role or 'Not specified'}
Return JSON: summary, headline, key_strengths."""
    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.7,
    )
    data = json.loads(response.choices[0].message.content)
    return ProfileSummaryResponse(**data)
