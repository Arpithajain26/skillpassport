"""Generates and scores AI assessments."""
import json
from models.schemas import (
    AssessmentGenerateRequest, AssessmentGenerateResponse,
    AssessmentSubmitRequest, AssessmentSubmitResponse,
    AssessmentQuestion,
)
from config import settings


MOCK_QUESTIONS: dict = {
    "Python": {
        "Intermediate": [
            {"id": 1, "question": "What does the `*args` syntax allow in Python functions?",
             "options": ["Pass any number of keyword arguments", "Pass any number of positional arguments", "Unpack a dictionary", "Define default arguments"],
             "correct_answer": 1, "explanation": "*args allows a function to accept any number of positional arguments, stored as a tuple."},
            {"id": 2, "question": "Which of the following is a Python list comprehension?",
             "options": ["[x for x in range(10)]", "{x: x for x in range(10)}", "(x for x in range(10))", "set(x for x in range(10))"],
             "correct_answer": 0, "explanation": "List comprehensions use square brackets to create lists concisely."},
            {"id": 3, "question": "What is the output of `bool([])`?",
             "options": ["True", "False", "None", "Error"],
             "correct_answer": 1, "explanation": "An empty list is falsy in Python."},
            {"id": 4, "question": "Which keyword is used to create a generator function?",
             "options": ["return", "yield", "async", "generate"],
             "correct_answer": 1, "explanation": "The yield keyword makes a function a generator."},
            {"id": 5, "question": "What does `enumerate()` return?",
             "options": ["A list of indices", "A list of values", "An iterator of (index, value) tuples", "A dictionary"],
             "correct_answer": 2, "explanation": "enumerate() returns an iterator of (index, value) tuples."},
        ]
    },
    "React": {
        "Intermediate": [
            {"id": 1, "question": "What hook would you use to run side effects in a functional component?",
             "options": ["useState", "useEffect", "useContext", "useReducer"],
             "correct_answer": 1, "explanation": "useEffect is designed for side effects like data fetching, subscriptions, and DOM mutations."},
            {"id": 2, "question": "Which of the following correctly describes React's virtual DOM?",
             "options": ["A real DOM copy stored in the browser", "A JavaScript representation of the DOM that React syncs with the real DOM", "A server-side rendering technique", "A CSS-in-JS solution"],
             "correct_answer": 1, "explanation": "The virtual DOM is a lightweight JS representation React uses to minimize real DOM operations."},
            {"id": 3, "question": "What is the purpose of the `key` prop in a list?",
             "options": ["Styling list items", "Helping React identify which items changed", "Creating unique IDs", "Sorting the list"],
             "correct_answer": 1, "explanation": "Keys help React reconcile list changes efficiently."},
            {"id": 4, "question": "How do you pass data from a parent to a child component?",
             "options": ["Context API", "Redux", "Props", "State"],
             "correct_answer": 2, "explanation": "Props are the primary way to pass data from parent to child."},
            {"id": 5, "question": "What does `React.memo()` do?",
             "options": ["Memoizes function results", "Prevents re-renders when props haven't changed", "Stores component state", "Creates a reducer"],
             "correct_answer": 1, "explanation": "React.memo is a HOC that prevents re-renders when props are unchanged."},
        ]
    },
}

DEFAULT_QUESTIONS = [
    {"id": 1, "question": "Which principle ensures that a module should have only one reason to change?",
     "options": ["DRY", "SOLID - Single Responsibility", "KISS", "YAGNI"],
     "correct_answer": 1, "explanation": "The Single Responsibility Principle from SOLID design."},
    {"id": 2, "question": "What does Big O notation measure?",
     "options": ["Code quality", "Memory allocation", "Algorithm time/space complexity", "Test coverage"],
     "correct_answer": 2, "explanation": "Big O describes how algorithm performance scales with input size."},
    {"id": 3, "question": "What is the purpose of version control?",
     "options": ["Package management", "Track changes and collaborate on code", "Deploy applications", "Monitor performance"],
     "correct_answer": 1, "explanation": "Version control tracks code changes and enables collaboration."},
    {"id": 4, "question": "What is a REST API?",
     "options": ["A database protocol", "An architectural style for networked applications using HTTP", "A JavaScript framework", "A CSS methodology"],
     "correct_answer": 1, "explanation": "REST (Representational State Transfer) is an architectural style for APIs."},
    {"id": 5, "question": "Which HTTP method is idempotent and used to update a resource?",
     "options": ["POST", "GET", "PUT", "DELETE"],
     "correct_answer": 2, "explanation": "PUT is idempotent and typically used for full resource updates."},
]


async def generate_assessment(request: AssessmentGenerateRequest) -> AssessmentGenerateResponse:
    if settings.use_mock:
        return _mock_generate(request)
    return await _llm_generate(request)


def _mock_generate(request: AssessmentGenerateRequest) -> AssessmentGenerateResponse:
    skill_questions = MOCK_QUESTIONS.get(request.skill, {})
    level_questions = skill_questions.get(request.current_level, [])
    questions_data = level_questions if level_questions else DEFAULT_QUESTIONS
    questions = [AssessmentQuestion(**q) for q in questions_data[:request.question_count or 5]]
    return AssessmentGenerateResponse(
        skill=request.skill,
        level=request.current_level,
        questions=questions,
        time_limit_minutes=10,
    )


def score_assessment(request: AssessmentSubmitRequest) -> AssessmentSubmitResponse:
    correct = 0
    question_feedback = []
    for i, (q, ans) in enumerate(zip(request.questions, request.user_answers)):
        is_correct = ans == q.correct_answer
        if is_correct:
            correct += 1
        question_feedback.append({
            "question_id": q.id,
            "correct": is_correct,
            "user_answer": ans,
            "correct_answer": q.correct_answer,
            "explanation": q.explanation,
        })
    score = int((correct / max(len(request.questions), 1)) * 100)
    current = request.current_confidence or 50
    # Weighted update: 70% old confidence + 30% assessment score
    new_confidence = int(0.7 * current + 0.3 * score)
    level = "Expert" if score >= 90 else "Advanced" if score >= 75 else "Intermediate" if score >= 60 else "Elementary"
    return AssessmentSubmitResponse(
        score=score,
        correct_count=correct,
        total_questions=len(request.questions),
        level_achieved=level,
        new_confidence=new_confidence,
        feedback=(
            f"You scored {score}%. " +
            ("Excellent work!" if score >= 80 else "Good effort!" if score >= 60 else "Keep practicing!")
        ),
        question_feedback=question_feedback,
    )


async def _llm_generate(request: AssessmentGenerateRequest) -> AssessmentGenerateResponse:
    from openai import AsyncOpenAI
    client = AsyncOpenAI(api_key=settings.openai_api_key, base_url=settings.openai_base_url)
    prompt = f"""Generate {request.question_count} multiple-choice questions for {request.skill} at {request.current_level} level.
Return JSON: skill, level, questions (list with id, question, options[4], correct_answer(0-3), explanation), time_limit_minutes."""
    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.7,
    )
    data = json.loads(response.choices[0].message.content)
    return AssessmentGenerateResponse(
        skill=data.get("skill", request.skill),
        level=data.get("level", request.current_level),
        questions=[AssessmentQuestion(**q) for q in data.get("questions", [])],
        time_limit_minutes=data.get("time_limit_minutes", 10),
    )
