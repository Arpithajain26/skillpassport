"""Generates personalized learning roadmaps."""
import json
from models.schemas import RoadmapRequest, RoadmapResponse, RoadmapWeek
from ai.mock_responses import ROLE_REQUIRED_SKILLS
from config import settings


async def generate_roadmap(request: RoadmapRequest) -> RoadmapResponse:
    if settings.use_mock:
        return _mock_roadmap(request)
    return await _llm_roadmap(request)


def _mock_roadmap(request: RoadmapRequest) -> RoadmapResponse:
    gaps = request.skill_gaps[:4]  # Focus on top 4 gaps
    weeks = []
    duration = max(4, min(request.duration_weeks or 12, 16))
    
    gap_skills = [g.get("skill", "Core Skills") for g in gaps]
    
    weekly_plans = [
        {"title": f"Foundation: {gap_skills[0] if gap_skills else 'Core Concepts'}",
         "tasks": ["Complete beginner tutorials", "Read official documentation", "Build a simple proof-of-concept", "Join relevant communities"],
         "resources": ["Official documentation", "YouTube tutorials", "FreeCodeCamp"]},
        {"title": f"Deep Dive: {gap_skills[0] if gap_skills else 'Applied Practice'}",
         "tasks": ["Build a small project", "Solve practice problems", "Review best practices", "Get code reviewed"],
         "resources": ["Udemy/Coursera courses", "GitHub examples", "Dev.to articles"]},
        {"title": f"Advanced: {gap_skills[1] if len(gap_skills) > 1 else 'Integration'}",
         "tasks": ["Integrate with existing projects", "Study advanced patterns", "Build portfolio project", "Document your learning"],
         "resources": ["Advanced tutorials", "Real-world open source", "Technical books"]},
        {"title": "Portfolio & Real-World Application",
         "tasks": ["Build a capstone project", "Add to GitHub portfolio", "Write technical documentation", "Share with community"],
         "resources": ["Project ideas", "GitHub", "Dev.to"]},
    ]
    
    weeks_per_phase = max(1, duration // len(weekly_plans))
    week_num = 1
    
    for i, plan in enumerate(weekly_plans):
        end_week = week_num + weeks_per_phase - 1
        if i == len(weekly_plans) - 1:
            end_week = duration
        skills_targeted = [gap_skills[i % len(gap_skills)]] if gap_skills else ["General Development"]
        weeks.append(RoadmapWeek(
            week=week_num,
            title=f"Week {week_num}-{end_week}: {plan['title']}",
            description=f"Focus on building {skills_targeted[0]} skills through hands-on practice.",
            tasks=plan["tasks"],
            skills_targeted=skills_targeted,
            resources=plan["resources"],
        ))
        week_num = end_week + 1

    return RoadmapResponse(
        title=f"{request.target_role} Readiness Roadmap",
        total_duration_weeks=duration,
        overview=(
            f"This {duration}-week roadmap is designed to take you from your current skill level to {request.target_role} readiness. "
            f"Based on your profile, the key areas to focus on are: {', '.join(gap_skills[:3]) if gap_skills else 'building depth in core skills'}."
        ),
        weeks=weeks,
        milestones=[
            f"Week {duration // 4}: Complete first {gap_skills[0] if gap_skills else 'skill'} project",
            f"Week {duration // 2}: Portfolio halfway complete",
            f"Week {3 * duration // 4}: Apply for junior positions",
            f"Week {duration}: Full portfolio ready, active job search",
        ],
    )


async def _llm_roadmap(request: RoadmapRequest) -> RoadmapResponse:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=settings.openai_api_key, base_url=settings.openai_base_url)
    prompt = f"""Create a {request.duration_weeks}-week learning roadmap for {request.target_role}.
Current skills: {json.dumps(request.current_skills)}
Skill gaps: {json.dumps(request.skill_gaps)}
Return JSON: title, total_duration_weeks, overview, weeks (list), milestones."""
    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.5,
    )
    data = json.loads(response.choices[0].message.content)
    return RoadmapResponse(
        title=data.get("title", ""),
        total_duration_weeks=data.get("total_duration_weeks", 12),
        overview=data.get("overview", ""),
        weeks=[RoadmapWeek(**w) for w in data.get("weeks", [])],
        milestones=data.get("milestones", []),
    )
