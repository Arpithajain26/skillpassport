from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum


class ProficiencyLevel(str, Enum):
    BEGINNER = "Beginner"
    ELEMENTARY = "Elementary"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    EXPERT = "Expert"


class SkillExtraction(BaseModel):
    name: str
    level: ProficiencyLevel
    confidence: int = Field(ge=0, le=100)
    explanation: str


class EvidenceAnalysisRequest(BaseModel):
    title: str
    description: str
    type: str
    technologies: Optional[List[str]] = []
    url: Optional[str] = None
    existing_skills: Optional[List[str]] = []


class EvidenceAnalysisResponse(BaseModel):
    skills: List[SkillExtraction]
    overall_quality: int = Field(ge=0, le=100)
    summary: str
    recommendations: List[str]


class SkillGapRequest(BaseModel):
    current_skills: List[Dict[str, Any]]
    target_role: str
    target_industry: Optional[str] = None


class SkillGapItem(BaseModel):
    skill: str
    current_level: Optional[str] = None
    required_level: str
    gap_score: int = Field(ge=0, le=100)
    priority: str
    resources: List[str]


class SkillGapResponse(BaseModel):
    gaps: List[SkillGapItem]
    match_percentage: int = Field(ge=0, le=100)
    analysis_summary: str
    top_strengths: List[str]
    critical_gaps: List[str]


class CareerMatchRequest(BaseModel):
    user_skills: List[Dict[str, Any]]
    target_role: str
    evidence_count: Optional[int] = 0


class CareerMatchResponse(BaseModel):
    match_percentage: int = Field(ge=0, le=100)
    matching_skills: List[str]
    missing_skills: List[str]
    partial_skills: List[str]
    assessment: str
    next_steps: List[str]


class RoadmapRequest(BaseModel):
    current_skills: List[Dict[str, Any]]
    target_role: str
    skill_gaps: List[Dict[str, Any]]
    available_hours_per_week: Optional[int] = 10
    duration_weeks: Optional[int] = 12


class RoadmapWeek(BaseModel):
    week: int
    title: str
    description: str
    tasks: List[str]
    skills_targeted: List[str]
    resources: List[str]


class RoadmapResponse(BaseModel):
    title: str
    total_duration_weeks: int
    overview: str
    weeks: List[RoadmapWeek]
    milestones: List[str]


class ProfileSummaryRequest(BaseModel):
    name: str
    skills: List[Dict[str, Any]]
    projects_count: int
    certificates_count: int
    internships_count: int
    assessments_count: int
    target_role: Optional[str] = None
    bio: Optional[str] = None


class ProfileSummaryResponse(BaseModel):
    summary: str
    headline: str
    key_strengths: List[str]


class AssessmentQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: int
    explanation: str


class AssessmentGenerateRequest(BaseModel):
    skill: str
    current_level: str
    question_count: Optional[int] = 5


class AssessmentGenerateResponse(BaseModel):
    skill: str
    level: str
    questions: List[AssessmentQuestion]
    time_limit_minutes: int


class AssessmentSubmitRequest(BaseModel):
    skill: str
    questions: List[AssessmentQuestion]
    user_answers: List[int]
    current_confidence: Optional[int] = 50


class AssessmentSubmitResponse(BaseModel):
    score: int
    correct_count: int
    total_questions: int
    level_achieved: str
    new_confidence: int
    feedback: str
    question_feedback: List[Dict[str, Any]]
