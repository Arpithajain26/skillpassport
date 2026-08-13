"""Analyzes evidence to extract and score skills."""
import json
from typing import Optional
from models.schemas import EvidenceAnalysisRequest, EvidenceAnalysisResponse, SkillExtraction
from ai.mock_responses import extract_skills_from_text
from config import settings


EVIDENCE_ANALYSIS_PROMPT = """You are an expert skill assessor for a professional identity platform.
Analyze the following evidence and extract the skills demonstrated.

Evidence:
- Title: {title}
- Type: {type}
- Description: {description}
- Technologies mentioned: {technologies}
- URL: {url}

Return a JSON response with this exact structure:
{{
  "skills": [
    {{
      "name": "skill name",
      "level": "Beginner|Elementary|Intermediate|Advanced|Expert",
      "confidence": 85,
      "explanation": "Why this skill is demonstrated at this level"
    }}
  ],
  "overall_quality": 80,
  "summary": "Brief summary of what this evidence demonstrates",
  "recommendations": ["Suggestion 1", "Suggestion 2"]
}}

Be specific, realistic, and evidence-based. Do not inflate confidence scores.
"""


async def analyze_evidence(
    request: EvidenceAnalysisRequest,
) -> EvidenceAnalysisResponse:
    if settings.use_mock:
        return _mock_analyze_evidence(request)
    return await _llm_analyze_evidence(request)


def _mock_analyze_evidence(request: EvidenceAnalysisRequest) -> EvidenceAnalysisResponse:
    full_text = f"{request.title} {request.description} {' '.join(request.technologies or [])}"
    raw_skills = extract_skills_from_text(full_text, request.type.lower().replace(' ', '_'))

    if not raw_skills:
        raw_skills = [
            {
                "name": "Problem Solving",
                "level": "Intermediate",
                "confidence": 70,
                "explanation": "Evidence demonstrates structured problem-solving approach.",
            }
        ]

    skills = [SkillExtraction(**s) for s in raw_skills]
    return EvidenceAnalysisResponse(
        skills=skills,
        overall_quality=min(95, max(60, sum(s.confidence for s in skills) // len(skills))),
        summary=f"This {request.type.lower()} demonstrates practical experience with {', '.join(s.name for s in skills[:3])}.",
        recommendations=[
            "Add a live demo link to increase evidence quality",
            "Include specific metrics or outcomes in the description",
            "Consider writing a technical blog post about this project",
        ],
    )


async def _llm_analyze_evidence(request: EvidenceAnalysisRequest) -> EvidenceAnalysisResponse:
    from openai import AsyncOpenAI

    client = AsyncOpenAI(
        api_key=settings.openai_api_key,
        base_url=settings.openai_base_url,
    )
    prompt = EVIDENCE_ANALYSIS_PROMPT.format(
        title=request.title,
        type=request.type,
        description=request.description,
        technologies=", ".join(request.technologies or []),
        url=request.url or "Not provided",
    )
    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    data = json.loads(response.choices[0].message.content)
    return EvidenceAnalysisResponse(
        skills=[SkillExtraction(**s) for s in data.get("skills", [])],
        overall_quality=data.get("overall_quality", 75),
        summary=data.get("summary", ""),
        recommendations=data.get("recommendations", []),
    )
