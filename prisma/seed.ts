import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SkillPassport database...");

  // Clean existing data
  await prisma.aiProfileSummary.deleteMany();
  await prisma.gitHubRepo.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.learningRoadmap.deleteMany();
  await prisma.skillGap.deleteMany();
  await prisma.careerGoal.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.project.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ============================================================
  // Create skill catalog
  // ============================================================
  const skills = await Promise.all([
    prisma.skill.create({ data: { name: "Python", category: "Language", description: "High-level, general-purpose programming language" } }),
    prisma.skill.create({ data: { name: "JavaScript", category: "Language", description: "The language of the web" } }),
    prisma.skill.create({ data: { name: "TypeScript", category: "Language", description: "JavaScript with static typing" } }),
    prisma.skill.create({ data: { name: "Java", category: "Language", description: "Object-oriented programming language" } }),
    prisma.skill.create({ data: { name: "Go", category: "Language", description: "Statically typed compiled language by Google" } }),
    prisma.skill.create({ data: { name: "React", category: "Frontend", description: "UI library by Meta" } }),
    prisma.skill.create({ data: { name: "Next.js", category: "Frontend", description: "React framework for production" } }),
    prisma.skill.create({ data: { name: "Vue.js", category: "Frontend", description: "Progressive JavaScript framework" } }),
    prisma.skill.create({ data: { name: "Tailwind CSS", category: "Frontend", description: "Utility-first CSS framework" } }),
    prisma.skill.create({ data: { name: "Node.js", category: "Backend", description: "JavaScript runtime for server-side" } }),
    prisma.skill.create({ data: { name: "FastAPI", category: "Backend", description: "Modern Python web framework" } }),
    prisma.skill.create({ data: { name: "Django", category: "Backend", description: "Python web framework" } }),
    prisma.skill.create({ data: { name: "Express.js", category: "Backend", description: "Node.js web framework" } }),
    prisma.skill.create({ data: { name: "PostgreSQL", category: "Database", description: "Advanced open-source relational database" } }),
    prisma.skill.create({ data: { name: "MongoDB", category: "Database", description: "NoSQL document database" } }),
    prisma.skill.create({ data: { name: "SQL", category: "Database", description: "Structured Query Language" } }),
    prisma.skill.create({ data: { name: "Redis", category: "Database", description: "In-memory data structure store" } }),
    prisma.skill.create({ data: { name: "Docker", category: "DevOps", description: "Containerization platform" } }),
    prisma.skill.create({ data: { name: "Kubernetes", category: "DevOps", description: "Container orchestration" } }),
    prisma.skill.create({ data: { name: "AWS", category: "Cloud", description: "Amazon Web Services cloud platform" } }),
    prisma.skill.create({ data: { name: "GCP", category: "Cloud", description: "Google Cloud Platform" } }),
    prisma.skill.create({ data: { name: "Machine Learning", category: "AI/ML", description: "Algorithms that learn from data" } }),
    prisma.skill.create({ data: { name: "TensorFlow", category: "AI/ML", description: "ML framework by Google" } }),
    prisma.skill.create({ data: { name: "PyTorch", category: "AI/ML", description: "ML framework by Meta" } }),
    prisma.skill.create({ data: { name: "NLP", category: "AI/ML", description: "Natural Language Processing" } }),
    prisma.skill.create({ data: { name: "Git", category: "Tools", description: "Version control system" } }),
    prisma.skill.create({ data: { name: "GraphQL", category: "API", description: "Query language for APIs" } }),
    prisma.skill.create({ data: { name: "REST API", category: "API", description: "Representational State Transfer API design" } }),
    prisma.skill.create({ data: { name: "Problem Solving", category: "Soft Skills", description: "Analytical and creative problem resolution" } }),
    prisma.skill.create({ data: { name: "Communication", category: "Soft Skills", description: "Clear and effective communication" } }),
    prisma.skill.create({ data: { name: "Leadership", category: "Soft Skills", description: "Team leadership and mentoring" } }),
  ]);

  const skillMap = Object.fromEntries(skills.map((s) => [s.name, s]));

  // ============================================================
  // Demo User: Alex Chen
  // ============================================================
  const hashedPassword = await bcrypt.hash("demo123456", 12);

  const alex = await prisma.user.create({
    data: {
      name: "Alex Chen",
      email: "alex@skillpassport.dev",
      password: hashedPassword,
      username: "alex-chen",
      bio: "Full-stack developer passionate about building scalable web applications and exploring ML applications.",
      location: "San Francisco, CA",
      headline: "Full Stack Developer | Python & React | Open to Opportunities",
      githubUsername: "alexchen-dev",
      currentStatus: "professional",
      targetCountry: "United States",
      isPublic: true,
      onboardingComplete: true,
    },
  });

  // Education
  await prisma.education.create({
    data: {
      userId: alex.id,
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: new Date("2018-08-01"),
      endDate: new Date("2022-05-15"),
      grade: "3.7 GPA",
    },
  });

  // Experience
  await prisma.experience.create({
    data: {
      userId: alex.id,
      company: "TechCorp Solutions",
      role: "Software Engineer",
      description: "Developed and maintained React-based frontend applications. Built RESTful APIs with Node.js and PostgreSQL. Improved application performance by 40%.",
      startDate: new Date("2022-06-01"),
      endDate: new Date("2024-01-01"),
      isCurrent: false,
      location: "San Francisco, CA",
      skills: ["React", "Node.js", "PostgreSQL", "Docker"],
    },
  });

  await prisma.experience.create({
    data: {
      userId: alex.id,
      company: "AI Startup (DataMind)",
      role: "ML Engineer Intern",
      description: "Built NLP pipelines for text classification. Deployed models using FastAPI. Reduced inference time by 60% through optimization.",
      startDate: new Date("2021-05-01"),
      endDate: new Date("2021-08-31"),
      isCurrent: false,
      location: "Remote",
      skills: ["Python", "Machine Learning", "FastAPI", "NLP"],
    },
  });

  // User Skills
  const userSkillsData = [
    { skillId: skillMap["Python"].id, proficiencyLevel: "Advanced", confidenceScore: 91, verificationStatus: "verified", evidenceCount: 12, aiExplanation: "Python proficiency is strongly supported by 8 projects, 3 coding challenges, 1 internship, and detected GitHub activity. Code quality and architecture demonstrate advanced understanding." },
    { skillId: skillMap["React"].id, proficiencyLevel: "Advanced", confidenceScore: 88, verificationStatus: "verified", evidenceCount: 8, aiExplanation: "React expertise demonstrated through reusable component architecture, state management with Redux, custom hooks, and performance optimization in 5 projects." },
    { skillId: skillMap["Node.js"].id, proficiencyLevel: "Intermediate", confidenceScore: 82, verificationStatus: "analyzed", evidenceCount: 6, aiExplanation: "Node.js skills shown through API development, middleware patterns, and database integration across multiple projects." },
    { skillId: skillMap["SQL"].id, proficiencyLevel: "Advanced", confidenceScore: 85, verificationStatus: "verified", evidenceCount: 7, aiExplanation: "SQL competency evidenced through complex query design, database schema modeling, and performance optimization in projects." },
    { skillId: skillMap["Machine Learning"].id, proficiencyLevel: "Intermediate", confidenceScore: 74, verificationStatus: "analyzed", evidenceCount: 4, aiExplanation: "ML skills demonstrated through NLP pipeline, classification models, and internship experience." },
    { skillId: skillMap["TypeScript"].id, proficiencyLevel: "Intermediate", confidenceScore: 78, verificationStatus: "analyzed", evidenceCount: 4, aiExplanation: "TypeScript usage detected across frontend projects with proper type definitions and interfaces." },
    { skillId: skillMap["Docker"].id, proficiencyLevel: "Beginner", confidenceScore: 45, verificationStatus: "unverified", evidenceCount: 1, aiExplanation: "Basic Docker knowledge inferred from one project. Limited evidence for higher proficiency claims." },
    { skillId: skillMap["Git"].id, proficiencyLevel: "Advanced", confidenceScore: 90, verificationStatus: "verified", evidenceCount: 15, aiExplanation: "Git expertise demonstrated through consistent commit history, branching strategies, and open-source contributions." },
    { skillId: skillMap["PostgreSQL"].id, proficiencyLevel: "Intermediate", confidenceScore: 80, verificationStatus: "analyzed", evidenceCount: 5, aiExplanation: "PostgreSQL skills shown through schema design, query optimization, and indexing strategies." },
    { skillId: skillMap["FastAPI"].id, proficiencyLevel: "Intermediate", confidenceScore: 76, verificationStatus: "analyzed", evidenceCount: 3, aiExplanation: "FastAPI proficiency demonstrated through API design, async endpoints, and Pydantic model usage in ML projects." },
    { skillId: skillMap["AWS"].id, proficiencyLevel: "Beginner", confidenceScore: 35, verificationStatus: "unverified", evidenceCount: 0, aiExplanation: "Limited evidence of AWS usage. Adding cloud deployment projects would significantly improve this score." },
  ];

  for (const skillData of userSkillsData) {
    await prisma.userSkill.create({ data: { userId: alex.id, ...skillData } });
  }

  // Projects
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce application with React frontend, Node.js backend, MongoDB database, Stripe payment integration, and admin dashboard.",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "TypeScript", "Tailwind CSS"],
      githubUrl: "https://github.com/alexchen-dev/ecommerce-platform",
      liveUrl: "https://ecommerce-demo.vercel.app",
      role: "Lead Developer",
      isFeatured: true,
    },
    {
      title: "AI Resume Analyzer",
      description: "NLP-powered tool that analyzes resumes and job descriptions to identify skill matches. Uses FastAPI backend with Hugging Face transformers.",
      technologies: ["Python", "FastAPI", "NLP", "Machine Learning", "React", "PostgreSQL"],
      githubUrl: "https://github.com/alexchen-dev/ai-resume-analyzer",
      role: "Solo Developer",
      isFeatured: true,
    },
    {
      title: "Real-Time Chat Application",
      description: "WebSocket-based chat application with rooms, private messaging, file sharing, and end-to-end encryption.",
      technologies: ["React", "Node.js", "Socket.io", "Redis", "PostgreSQL"],
      githubUrl: "https://github.com/alexchen-dev/realtime-chat",
      role: "Full Stack Developer",
      isFeatured: false,
    },
    {
      title: "Machine Learning Dashboard",
      description: "Interactive dashboard for visualizing ML model performance, dataset statistics, and experiment tracking.",
      technologies: ["Python", "FastAPI", "React", "D3.js", "scikit-learn"],
      githubUrl: "https://github.com/alexchen-dev/ml-dashboard",
      role: "Solo Developer",
      isFeatured: false,
    },
    {
      title: "Task Management API",
      description: "RESTful API with authentication, role-based access control, real-time notifications, and comprehensive test coverage.",
      technologies: ["Node.js", "Express.js", "PostgreSQL", "JWT", "Redis"],
      githubUrl: "https://github.com/alexchen-dev/task-api",
      role: "Backend Developer",
      isFeatured: false,
    },
    {
      title: "Data Analysis Pipeline",
      description: "Automated ETL pipeline for processing and analyzing large datasets. Includes visualization notebooks and statistical analysis.",
      technologies: ["Python", "Pandas", "NumPy", "Matplotlib", "SQL"],
      githubUrl: "https://github.com/alexchen-dev/data-pipeline",
      role: "Data Engineer",
      isFeatured: false,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: { userId: alex.id, ...project } });
  }

  // Certificates
  await prisma.certificate.create({
    data: {
      userId: alex.id,
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      issueDate: new Date("2023-03-15"),
      credentialId: "AWS-CCP-2023-ALEX",
      url: "https://aws.amazon.com/certification",
      skills: ["AWS", "Cloud Computing"],
    },
  });

  await prisma.certificate.create({
    data: {
      userId: alex.id,
      title: "Google Data Analytics Certificate",
      issuer: "Google / Coursera",
      issueDate: new Date("2022-11-20"),
      credentialId: "GOOGLE-DA-2022",
      url: "https://coursera.org/verify",
      skills: ["SQL", "Data Analysis", "Python"],
    },
  });

  await prisma.certificate.create({
    data: {
      userId: alex.id,
      title: "Meta React Developer Certificate",
      issuer: "Meta / Coursera",
      issueDate: new Date("2023-07-10"),
      credentialId: "META-REACT-2023",
      url: "https://coursera.org/verify",
      skills: ["React", "JavaScript", "Frontend"],
    },
  });

  // Evidence
  await prisma.evidence.createMany({
    data: [
      {
        userId: alex.id,
        type: "project",
        title: "E-Commerce Platform",
        description: "Full-stack e-commerce application with React, Node.js, and MongoDB",
        technologies: ["React", "Node.js", "MongoDB", "TypeScript"],
        verificationStatus: "verified",
        aiScore: 88,
        extractedSkills: [
          { name: "React", level: "Advanced", confidence: 88 },
          { name: "Node.js", level: "Intermediate", confidence: 82 },
          { name: "MongoDB", level: "Intermediate", confidence: 78 },
        ],
        aiSummary: "Comprehensive full-stack project demonstrating strong React and Node.js proficiency.",
      },
      {
        userId: alex.id,
        type: "internship",
        title: "ML Engineer Intern — DataMind",
        description: "Built NLP pipelines for text classification using Python and FastAPI",
        technologies: ["Python", "Machine Learning", "FastAPI", "NLP"],
        verificationStatus: "verified",
        aiScore: 85,
        extractedSkills: [
          { name: "Python", level: "Advanced", confidence: 91 },
          { name: "Machine Learning", level: "Intermediate", confidence: 74 },
          { name: "FastAPI", level: "Intermediate", confidence: 76 },
        ],
        aiSummary: "Professional ML engineering internship with strong Python evidence.",
      },
      {
        userId: alex.id,
        type: "certificate",
        title: "Meta React Developer Certificate",
        description: "Completed Meta's React professional certificate program",
        technologies: ["React", "JavaScript"],
        verificationStatus: "verified",
        aiScore: 80,
        extractedSkills: [
          { name: "React", level: "Intermediate", confidence: 80 },
          { name: "JavaScript", level: "Intermediate", confidence: 78 },
        ],
        aiSummary: "Professional certificate from Meta validating React competency.",
      },
      {
        userId: alex.id,
        type: "coding_challenge",
        title: "LeetCode — 150+ Problems Solved",
        description: "Solved 150+ algorithmic problems including dynamic programming, trees, and graphs",
        technologies: ["Python", "Algorithms", "Data Structures"],
        verificationStatus: "analyzed",
        aiScore: 82,
        extractedSkills: [
          { name: "Python", level: "Advanced", confidence: 89 },
          { name: "Problem Solving", level: "Advanced", confidence: 85 },
        ],
        aiSummary: "Consistent coding challenge activity demonstrates strong algorithmic thinking.",
      },
      {
        userId: alex.id,
        type: "hackathon",
        title: "HackSF 2023 — 2nd Place Winner",
        description: "Built an AI-powered accessibility tool in 24 hours. Won 2nd place out of 200+ teams.",
        technologies: ["React", "Python", "FastAPI", "Machine Learning"],
        verificationStatus: "verified",
        aiScore: 92,
        extractedSkills: [
          { name: "React", level: "Advanced", confidence: 85 },
          { name: "Python", level: "Advanced", confidence: 88 },
          { name: "Machine Learning", level: "Intermediate", confidence: 72 },
        ],
        aiSummary: "Competitive hackathon placement provides strong evidence of rapid development capability.",
      },
    ],
  });

  // Career Goal
  const careerGoal = await prisma.careerGoal.create({
    data: {
      userId: alex.id,
      targetRole: "Full Stack Developer",
      targetIndustry: "Technology",
      targetCountry: "United States",
      requiredSkills: ["React", "Node.js", "PostgreSQL", "TypeScript", "Docker", "AWS"],
      matchPercentage: 82,
      isActive: true,
    },
  });

  // Skill Gaps
  await prisma.skillGap.createMany({
    data: [
      {
        userId: alex.id,
        skill: "Docker",
        currentLevel: "Beginner",
        requiredLevel: "Intermediate",
        gapScore: 50,
        priority: "High",
        resources: ["Docker Documentation", "Docker for Developers (Udemy)", "Docker Compose Tutorial"],
        targetRole: "Full Stack Developer",
      },
      {
        userId: alex.id,
        skill: "AWS",
        currentLevel: null,
        requiredLevel: "Beginner",
        gapScore: 75,
        priority: "Medium",
        resources: ["AWS Free Tier", "AWS Cloud Practitioner Essentials", "A Cloud Guru"],
        targetRole: "Full Stack Developer",
      },
      {
        userId: alex.id,
        skill: "Kubernetes",
        currentLevel: null,
        requiredLevel: "Beginner",
        gapScore: 80,
        priority: "Low",
        resources: ["Kubernetes Documentation", "Kubernetes for Beginners", "CNCF learning path"],
        targetRole: "Full Stack Developer",
      },
    ],
  });

  // Learning Roadmap
  await prisma.learningRoadmap.create({
    data: {
      userId: alex.id,
      careerGoalId: careerGoal.id,
      title: "Full Stack Developer Readiness Roadmap",
      overview: "12-week roadmap focused on closing Docker and AWS gaps to achieve Full Stack Developer readiness.",
      steps: [
        { week: 1, title: "Week 1-3: Docker Fundamentals", tasks: ["Install Docker", "Learn basic commands", "Containerize existing app"], skills_targeted: ["Docker"] },
        { week: 4, title: "Week 4-6: Docker Compose & Networking", tasks: ["Multi-container apps", "Docker networking", "Docker volumes"], skills_targeted: ["Docker"] },
        { week: 7, title: "Week 7-9: AWS Foundations", tasks: ["AWS Free Tier setup", "EC2 basics", "S3 storage", "RDS database"], skills_targeted: ["AWS"] },
        { week: 10, title: "Week 10-12: Deploy Full Stack App", tasks: ["Deploy app to EC2", "Set up RDS", "Configure S3 for assets", "Add CI/CD pipeline"], skills_targeted: ["AWS", "Docker"] },
      ],
      milestones: [
        "Week 3: First Docker container running",
        "Week 6: Full app containerized with Docker Compose",
        "Week 9: App deployed to AWS EC2",
        "Week 12: Full CI/CD pipeline in production",
      ],
      totalDurationWeeks: 12,
      status: "active",
      currentWeek: 2,
    },
  });

  // Assessments
  await prisma.assessment.create({
    data: {
      userId: alex.id,
      skill: "Python",
      level: "Intermediate",
      questions: [
        { id: 1, question: "What does *args allow?", options: ["Keyword args", "Positional args", "Unpack dict", "Default args"], correct_answer: 1, explanation: "*args accepts any number of positional arguments." },
        { id: 2, question: "Which is a list comprehension?", options: ["[x for x in range(10)]", "{x: x for x in range(10)}", "(x for x in range(10))", "set(x for x in range(10))"], correct_answer: 0, explanation: "List comprehensions use square brackets." },
      ],
      userAnswers: [1, 0],
      score: 84,
      correct: 2,
      total: 2,
      levelAchieved: "Advanced",
      previousConfidence: 85,
      newConfidence: 91,
      feedback: "Excellent! Score of 84% updated your Python confidence score.",
      completedAt: new Date("2024-01-15"),
    },
  });

  // GitHub Repos
  await prisma.gitHubRepo.createMany({
    data: [
      {
        userId: alex.id,
        repoId: 101,
        name: "ecommerce-platform",
        fullName: "alexchen-dev/ecommerce-platform",
        description: "Full-stack e-commerce with React and Node.js",
        url: "https://github.com/alexchen-dev/ecommerce-platform",
        language: "TypeScript",
        languages: { TypeScript: 45000, JavaScript: 12000, CSS: 8000 },
        stars: 42,
        forks: 7,
        topics: ["react", "nodejs", "ecommerce", "typescript"],
        extractedSkills: [{ name: "React", level: "Advanced" }, { name: "TypeScript", level: "Intermediate" }, { name: "Node.js", level: "Intermediate" }],
        isApproved: true,
        pushedAt: new Date("2024-02-10"),
      },
      {
        userId: alex.id,
        repoId: 102,
        name: "ai-resume-analyzer",
        fullName: "alexchen-dev/ai-resume-analyzer",
        description: "NLP-powered resume analyzer using Python and FastAPI",
        url: "https://github.com/alexchen-dev/ai-resume-analyzer",
        language: "Python",
        languages: { Python: 38000, TypeScript: 15000 },
        stars: 89,
        forks: 23,
        topics: ["python", "nlp", "fastapi", "machine-learning"],
        extractedSkills: [{ name: "Python", level: "Advanced" }, { name: "FastAPI", level: "Intermediate" }, { name: "NLP", level: "Intermediate" }],
        isApproved: true,
        pushedAt: new Date("2024-03-05"),
      },
    ],
  });

  // AI Profile Summary
  await prisma.aiProfileSummary.create({
    data: {
      userId: alex.id,
      summary: "Full-stack developer with demonstrated expertise in Python, React, and SQL, supported by 6 projects, 2 internships, 3 certificates, and competitive hackathon experience. Currently targeting Full Stack Developer roles in the technology industry with an 82% career readiness match.",
      headline: "Full Stack Developer | Python & React Specialist | 82% Career Ready",
      keyStrengths: ["Python", "React", "SQL", "Problem Solving", "API Design"],
    },
  });

  // Second Demo User: Priya Sharma
  const priya = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "priya@skillpassport.dev",
      password: hashedPassword,
      username: "priya-sharma",
      bio: "Data Science enthusiast transitioning from business analytics to ML engineering.",
      location: "Bangalore, India",
      headline: "Data Scientist | Python | Machine Learning | Targeting Germany",
      githubUsername: "priyasharma-ml",
      currentStatus: "career_switcher",
      targetCountry: "Germany",
      isPublic: true,
      onboardingComplete: true,
    },
  });

  await prisma.education.create({
    data: {
      userId: priya.id,
      institution: "IIT Bombay",
      degree: "Master of Science",
      field: "Data Science",
      startDate: new Date("2021-07-01"),
      endDate: new Date("2023-05-30"),
      grade: "8.9 CGPA",
    },
  });

  const priyaSkills = [
    { skillId: skillMap["Python"].id, proficiencyLevel: "Advanced", confidenceScore: 88, verificationStatus: "verified", evidenceCount: 9 },
    { skillId: skillMap["Machine Learning"].id, proficiencyLevel: "Advanced", confidenceScore: 85, verificationStatus: "verified", evidenceCount: 7 },
    { skillId: skillMap["SQL"].id, proficiencyLevel: "Intermediate", confidenceScore: 76, verificationStatus: "analyzed", evidenceCount: 4 },
    { skillId: skillMap["TensorFlow"].id, proficiencyLevel: "Intermediate", confidenceScore: 72, verificationStatus: "analyzed", evidenceCount: 3 },
  ];

  for (const s of priyaSkills) {
    await prisma.userSkill.create({ data: { userId: priya.id, ...s } });
  }

  await prisma.careerGoal.create({
    data: {
      userId: priya.id,
      targetRole: "ML Engineer",
      targetIndustry: "AI/Technology",
      targetCountry: "Germany",
      requiredSkills: ["Python", "Machine Learning", "PyTorch", "Docker", "MLOps"],
      matchPercentage: 74,
    },
  });

  console.log("✅ Seed complete!");
  console.log("\n📋 Demo accounts:");
  console.log("  Email: alex@skillpassport.dev  | Password: demo123456");
  console.log("  Email: priya@skillpassport.dev | Password: demo123456");
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
