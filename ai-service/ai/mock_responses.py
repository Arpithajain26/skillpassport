"""Realistic mock responses for when no LLM API key is configured."""
from typing import List, Dict, Any
import random


SKILL_LEVELS_BY_EVIDENCE = {
    "project": ["Intermediate", "Advanced"],
    "github_repository": ["Intermediate", "Advanced"],
    "certificate": ["Elementary", "Intermediate"],
    "coursework": ["Elementary", "Intermediate"],
    "internship": ["Intermediate", "Advanced"],
    "hackathon": ["Intermediate", "Advanced"],
    "coding_challenge": ["Intermediate", "Advanced"],
    "assessment": ["Elementary", "Intermediate"],
    "work_sample": ["Advanced", "Expert"],
    "simulation": ["Intermediate", "Advanced"],
}

TECH_SKILL_MAP = {
    "react": {"name": "React", "category": "Frontend"},
    "next.js": {"name": "Next.js", "category": "Frontend"},
    "nextjs": {"name": "Next.js", "category": "Frontend"},
    "vue": {"name": "Vue.js", "category": "Frontend"},
    "angular": {"name": "Angular", "category": "Frontend"},
    "typescript": {"name": "TypeScript", "category": "Language"},
    "javascript": {"name": "JavaScript", "category": "Language"},
    "python": {"name": "Python", "category": "Language"},
    "java": {"name": "Java", "category": "Language"},
    "go": {"name": "Go", "category": "Language"},
    "rust": {"name": "Rust", "category": "Language"},
    "node.js": {"name": "Node.js", "category": "Backend"},
    "nodejs": {"name": "Node.js", "category": "Backend"},
    "express": {"name": "Express.js", "category": "Backend"},
    "fastapi": {"name": "FastAPI", "category": "Backend"},
    "django": {"name": "Django", "category": "Backend"},
    "flask": {"name": "Flask", "category": "Backend"},
    "postgresql": {"name": "PostgreSQL", "category": "Database"},
    "mongodb": {"name": "MongoDB", "category": "Database"},
    "mysql": {"name": "MySQL", "category": "Database"},
    "redis": {"name": "Redis", "category": "Database"},
    "sql": {"name": "SQL", "category": "Database"},
    "docker": {"name": "Docker", "category": "DevOps"},
    "kubernetes": {"name": "Kubernetes", "category": "DevOps"},
    "aws": {"name": "AWS", "category": "Cloud"},
    "gcp": {"name": "GCP", "category": "Cloud"},
    "azure": {"name": "Azure", "category": "Cloud"},
    "machine learning": {"name": "Machine Learning", "category": "AI/ML"},
    "tensorflow": {"name": "TensorFlow", "category": "AI/ML"},
    "pytorch": {"name": "PyTorch", "category": "AI/ML"},
    "nlp": {"name": "NLP", "category": "AI/ML"},
    "git": {"name": "Git", "category": "Tools"},
    "graphql": {"name": "GraphQL", "category": "API"},
    "rest": {"name": "REST API", "category": "API"},
    "tailwind": {"name": "Tailwind CSS", "category": "Frontend"},
    "css": {"name": "CSS", "category": "Frontend"},
    "html": {"name": "HTML", "category": "Frontend"},
}

EXPLANATION_TEMPLATES = {
    "React": "React proficiency demonstrated through component architecture, state management, and modern hooks usage.",
    "Python": "Python skills evidenced by implementation of algorithms, data processing, and clean code structure.",
    "Node.js": "Node.js competency shown through server-side logic, async/await patterns, and API design.",
    "SQL": "SQL skills demonstrated through database schema design, complex queries, and data modeling.",
    "Machine Learning": "ML skills shown through model selection, training pipelines, and evaluation metrics.",
    "default": "Skill demonstrated through practical implementation in this evidence piece.",
}


def get_explanation(skill_name: str) -> str:
    return EXPLANATION_TEMPLATES.get(skill_name, EXPLANATION_TEMPLATES["default"])


def extract_skills_from_text(text: str, evidence_type: str) -> List[Dict[str, Any]]:
    """Extract skills from description text using keyword matching."""
    text_lower = text.lower()
    found_skills = []
    seen = set()

    for keyword, skill_info in TECH_SKILL_MAP.items():
        if keyword in text_lower and skill_info["name"] not in seen:
            seen.add(skill_info["name"])
            levels = SKILL_LEVELS_BY_EVIDENCE.get(evidence_type, ["Intermediate"])
            level = random.choice(levels)
            confidence = random.randint(72, 94)
            found_skills.append({
                "name": skill_info["name"],
                "level": level,
                "confidence": confidence,
                "explanation": get_explanation(skill_info["name"]),
            })

    return found_skills[:8]  # cap at 8 skills


ROLE_REQUIRED_SKILLS = {
    "Full Stack Developer": [
        {"skill": "React", "level": "Intermediate", "priority": "Critical"},
        {"skill": "Node.js", "level": "Intermediate", "priority": "Critical"},
        {"skill": "SQL", "level": "Intermediate", "priority": "High"},
        {"skill": "TypeScript", "level": "Intermediate", "priority": "High"},
        {"skill": "Docker", "level": "Beginner", "priority": "Medium"},
        {"skill": "AWS", "level": "Beginner", "priority": "Medium"},
        {"skill": "Git", "level": "Intermediate", "priority": "High"},
        {"skill": "REST API", "level": "Intermediate", "priority": "High"},
    ],
    "Data Scientist": [
        {"skill": "Python", "level": "Advanced", "priority": "Critical"},
        {"skill": "Machine Learning", "level": "Intermediate", "priority": "Critical"},
        {"skill": "SQL", "level": "Intermediate", "priority": "High"},
        {"skill": "TensorFlow", "level": "Intermediate", "priority": "High"},
        {"skill": "Statistics", "level": "Advanced", "priority": "Critical"},
        {"skill": "Data Visualization", "level": "Intermediate", "priority": "Medium"},
    ],
    "ML Engineer": [
        {"skill": "Python", "level": "Advanced", "priority": "Critical"},
        {"skill": "Machine Learning", "level": "Advanced", "priority": "Critical"},
        {"skill": "PyTorch", "level": "Intermediate", "priority": "High"},
        {"skill": "Docker", "level": "Intermediate", "priority": "High"},
        {"skill": "Kubernetes", "level": "Beginner", "priority": "Medium"},
        {"skill": "MLOps", "level": "Intermediate", "priority": "High"},
        {"skill": "AWS", "level": "Intermediate", "priority": "Medium"},
    ],
    "Backend Developer": [
        {"skill": "Node.js", "level": "Advanced", "priority": "Critical"},
        {"skill": "Python", "level": "Intermediate", "priority": "High"},
        {"skill": "PostgreSQL", "level": "Intermediate", "priority": "High"},
        {"skill": "REST API", "level": "Advanced", "priority": "Critical"},
        {"skill": "Docker", "level": "Intermediate", "priority": "High"},
        {"skill": "Redis", "level": "Beginner", "priority": "Medium"},
        {"skill": "AWS", "level": "Intermediate", "priority": "Medium"},
    ],
    "Frontend Developer": [
        {"skill": "React", "level": "Advanced", "priority": "Critical"},
        {"skill": "TypeScript", "level": "Intermediate", "priority": "High"},
        {"skill": "CSS", "level": "Advanced", "priority": "High"},
        {"skill": "Next.js", "level": "Intermediate", "priority": "High"},
        {"skill": "GraphQL", "level": "Beginner", "priority": "Medium"},
        {"skill": "Performance Optimization", "level": "Intermediate", "priority": "Medium"},
    ],
    "DevOps Engineer": [
        {"skill": "Docker", "level": "Advanced", "priority": "Critical"},
        {"skill": "Kubernetes", "level": "Intermediate", "priority": "Critical"},
        {"skill": "AWS", "level": "Advanced", "priority": "Critical"},
        {"skill": "CI/CD", "level": "Intermediate", "priority": "High"},
        {"skill": "Linux", "level": "Advanced", "priority": "High"},
        {"skill": "Terraform", "level": "Intermediate", "priority": "High"},
        {"skill": "Python", "level": "Intermediate", "priority": "Medium"},
    ],
}
