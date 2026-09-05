import { defaultRoles } from '../data/seedRoles.js';

// Skill aliases map for intelligent fuzzy detection
const SKILL_ALIASES = {
  'react': ['react', 'reactjs', 'react.js'],
  'typescript / javascript': ['typescript', 'javascript', 'ts', 'js', 'es6', 'ecmascript'],
  'node.js': ['node', 'nodejs', 'node.js', 'express'],
  'express.js / nestjs': ['express', 'expressjs', 'express.js', 'nestjs', 'nest.js', 'koa'],
  'mongodb': ['mongodb', 'mongo', 'mongoose', 'nosql', 'documentdb'],
  'postgresql / sql': ['postgres', 'postgresql', 'sql', 'mysql', 'sqlite', 'rdbms', 'relational database'],
  'docker': ['docker', 'container', 'containers', 'containerization', 'dockerfile', 'docker-compose'],
  'git & ci/cd': ['git', 'github', 'gitlab', 'ci/cd', 'cicd', 'jenkins', 'actions'],
  'restful api design': ['rest', 'restful', 'api', 'apis', 'crud', 'graphql', 'endpoints'],
  'system design & scalability': ['system design', 'scalability', 'microservices', 'caching', 'redis', 'load balancing'],
  'tailwind css / modern css': ['tailwind', 'css', 'css3', 'sass', 'scss', 'bootstrap', 'styled-components'],
  'automated testing (jest / cypress)': ['jest', 'cypress', 'mocha', 'chai', 'playwright', 'unit test', 'testing', 'tdd'],
  'python': ['python', 'py', 'python3', 'django', 'flask', 'fastapi'],
  'pytorch / tensorflow': ['pytorch', 'tensorflow', 'keras', 'torch'],
  'llm apis & prompt engineering': ['llm', 'genai', 'prompt engineering', 'openai', 'gemini', 'gpt', 'claude', 'transformers'],
  'rag & vector databases': ['rag', 'vector database', 'embeddings', 'pinecone', 'chroma', 'weaviate', 'faiss'],
  'langchain / llamaindex': ['langchain', 'llamaindex', 'llama-index', 'agentic'],
  'aws or gcp': ['aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 's3', 'ec2'],
  'kubernetes (k8s)': ['kubernetes', 'k8s', 'helm', 'kubectl'],
  'terraform': ['terraform', 'iac', 'infrastructure as code'],
  'linux / bash scripting': ['linux', 'bash', 'shell', 'ubuntu', 'unix'],
  'sql': ['sql', 'query', 'queries', 'joins', 'indexing', 'schemas'],
  'scikit-learn': ['scikit-learn', 'sklearn', 'machine learning', 'regression', 'random forest'],
  'data visualization (matplotlib, seaborn, tableau)': ['matplotlib', 'seaborn', 'tableau', 'powerbi', 'visualization', 'charts'],
  'network protocols & firewalls': ['tcp/ip', 'firewall', 'dns', 'wireshark', 'networking', 'osi'],
  'siem tools (splunk, sentinel)': ['siem', 'splunk', 'sentinel', 'log analysis', 'soc']
};

/**
 * Perform rule-based skill gap analysis
 */
export const analyzeSkillGapLocally = ({ resumeText, targetRoleTitle, customJobDescription, candidateInfo }) => {
  const normalizedText = (resumeText || '').toLowerCase();
  
  // Find matching predefined role or construct baseline from custom JD
  let benchmarkRole = defaultRoles.find(
    r => r.title.toLowerCase() === (targetRoleTitle || '').toLowerCase() ||
         r.slug.toLowerCase() === (targetRoleTitle || '').toLowerCase()
  );

  if (!benchmarkRole) {
    benchmarkRole = defaultRoles[0]; // Default to Full Stack Developer
  }

  const roleSkills = [...benchmarkRole.requiredSkills];

  // If custom job description provided, extract mentioned keywords to append
  if (customJobDescription) {
    const jdLower = customJobDescription.toLowerCase();
    const commonTechs = [
      'Next.js', 'GraphQL', 'Redis', 'Kafka', 'Kubernetes', 'AWS', 'Python', 'Go', 'Rust',
      'Java', 'Spring Boot', 'Vue.js', 'Angular', 'Cybersecurity', 'Terraform', 'CI/CD'
    ];
    commonTechs.forEach(tech => {
      if (jdLower.includes(tech.toLowerCase()) && !roleSkills.some(s => s.name.toLowerCase().includes(tech.toLowerCase()))) {
        roleSkills.push({
          name: tech,
          category: 'Specialized',
          importance: 'Important',
          requiredScore: 80,
          description: `Extracted from uploaded Job Description (${tech})`
        });
      }
    });
  }

  // Evaluate candidate skills against role skills
  const extractedSkills = [];
  const skillGaps = [];
  const strengths = [];
  const keyGaps = [];

  let totalWeight = 0;
  let earnedScore = 0;

  roleSkills.forEach(reqSkill => {
    const weight = reqSkill.importance === 'Critical' ? 3 : reqSkill.importance === 'Important' ? 2 : 1;
    totalWeight += weight;

    // Check alias match
    const aliasKey = Object.keys(SKILL_ALIASES).find(
      key => reqSkill.name.toLowerCase().includes(key) || key.includes(reqSkill.name.toLowerCase())
    );
    const aliasesToCheck = aliasKey ? SKILL_ALIASES[aliasKey] : [reqSkill.name.toLowerCase()];

    // Count mentions / presence
    let matched = false;
    let matchCount = 0;
    for (const alias of aliasesToCheck) {
      if (normalizedText.includes(alias.toLowerCase())) {
        matched = true;
        matchCount++;
      }
    }

    if (matched) {
      extractedSkills.push(reqSkill.name);
      // Determine proficiency heuristic based on frequency & depth
      const proficiency = Math.min(95, 60 + (matchCount * 12));
      const gap = Math.max(0, reqSkill.requiredScore - proficiency);

      if (gap <= 10) {
        earnedScore += weight * 1.0;
        strengths.push(reqSkill.name);
        skillGaps.push({
          skill: reqSkill.name,
          category: reqSkill.category,
          status: 'Strong Match',
          currentProficiency: proficiency,
          requiredProficiency: reqSkill.requiredScore,
          gapScore: gap,
          reason: `Demonstrated experience with ${reqSkill.name} identified in resume.`,
          learningPriority: 'Low'
        });
      } else {
        earnedScore += weight * 0.65;
        skillGaps.push({
          skill: reqSkill.name,
          category: reqSkill.category,
          status: 'Needs Improvement',
          currentProficiency: proficiency,
          requiredProficiency: reqSkill.requiredScore,
          gapScore: gap,
          reason: `Found foundational exposure to ${reqSkill.name}, but depth and advanced application can be deepened.`,
          learningPriority: reqSkill.importance === 'Critical' ? 'High' : 'Medium'
        });
        if (reqSkill.importance === 'Critical') {
          keyGaps.push(reqSkill.name);
        }
      }
    } else {
      // Skill missing
      const isCritical = reqSkill.importance === 'Critical';
      earnedScore += 0;
      keyGaps.push(reqSkill.name);
      skillGaps.push({
        skill: reqSkill.name,
        category: reqSkill.category,
        status: isCritical ? 'Missing Critical' : 'Needs Improvement',
        currentProficiency: 15,
        requiredProficiency: reqSkill.requiredScore,
        gapScore: reqSkill.requiredScore - 15,
        reason: `No direct mention or practical project evidence for ${reqSkill.name} found in current profile.`,
        learningPriority: isCritical ? 'High' : 'Medium'
      });
    }
  });

  // Calculate overall match score (0 - 100)
  const overallMatchScore = Math.min(98, Math.max(25, Math.round((earnedScore / (totalWeight || 1)) * 100)));

  // Generate Radar data
  const categoryScores = {};
  skillGaps.forEach(item => {
    if (!categoryScores[item.category]) {
      categoryScores[item.category] = { candidateTotal: 0, benchmarkTotal: 0, count: 0 };
    }
    categoryScores[item.category].candidateTotal += item.currentProficiency;
    categoryScores[item.category].benchmarkTotal += item.requiredProficiency;
    categoryScores[item.category].count += 1;
  });

  const radarData = Object.keys(categoryScores).map(cat => ({
    category: cat,
    candidateScore: Math.round(categoryScores[cat].candidateTotal / categoryScores[cat].count),
    benchmarkScore: Math.round(categoryScores[cat].benchmarkTotal / categoryScores[cat].count),
    fullMark: 100
  }));

  // Ensure minimum categories for radar symmetry if needed
  if (radarData.length < 4) {
    radarData.push(
      { category: 'Architecture', candidateScore: 60, benchmarkScore: 80, fullMark: 100 },
      { category: 'Tooling & CI/CD', candidateScore: 50, benchmarkScore: 85, fullMark: 100 }
    );
  }

  // Generate curated recommendations
  const recommendations = [];
  const highPriorityGaps = skillGaps.filter(g => g.learningPriority === 'High');

  highPriorityGaps.slice(0, 3).forEach(gap => {
    recommendations.push({
      type: 'Course',
      title: `Mastering ${gap.skill} for Production`,
      description: `Targeted sprint focusing on real-world architecture, industry standards, and hands-on integration of ${gap.skill}.`,
      priority: 'High',
      url: `https://www.google.com/search?q=${encodeURIComponent(gap.skill + ' production tutorial documentation')}`
    });
  });

  recommendations.push({
    type: 'Project',
    title: `Full-Lifecycle ${benchmarkRole.title} Portfolio Project`,
    description: `Build and deploy an enterprise-grade project integrating ${keyGaps.slice(0, 3).join(', ') || 'Docker, CI/CD, and Cloud'} with live monitoring.`,
    priority: 'High',
    url: 'https://github.com'
  });

  recommendations.push({
    type: 'Certification',
    title: `Recognized Industry Certification for ${benchmarkRole.title}`,
    description: `Prepare for standard professional credentials that validate competencies in missing domains.`,
    priority: 'Medium',
    url: 'https://roadmap.sh'
  });

  // Generate structured multi-phase Roadmap
  const missingSkills = skillGaps.filter(s => s.status !== 'Strong Match').map(s => s.skill);
  const phase1Skills = missingSkills.slice(0, 2);
  const phase2Skills = missingSkills.slice(2, 4);
  const phase3Skills = missingSkills.slice(4, 7);

  const phases = [
    {
      phaseNumber: 1,
      title: 'Phase 1: Foundation & High-Impact Skill Deficits',
      durationWeeks: 3,
      focusSkills: phase1Skills.length > 0 ? phase1Skills : ['Core Architecture', 'API Design'],
      milestones: [
        {
          title: `Master fundamentals of ${phase1Skills[0] || 'Core Frameworks'}`,
          description: `Deep-dive into official documentation, core patterns, and write isolated proof-of-concept services.`,
          estimatedHours: 20,
          resources: [
            { title: 'Official Documentation & Standards', type: 'Documentation', url: 'https://developer.mozilla.org', isFree: true },
            { title: 'Interactive Practical Exercises', type: 'Course', url: 'https://roadmap.sh', isFree: true }
          ],
          projectIdea: {
            title: `Micro-service or Module demonstrating ${phase1Skills[0] || 'Architecture'}`,
            description: 'Implement clean directory structure, automated validation, and error boundaries.',
            deliverable: 'GitHub Repository with passing test suite'
          },
          completed: false
        },
        {
          title: `Hands-on implementation of ${phase1Skills[1] || 'API & Data Layer'}`,
          description: 'Build end-to-end integration and optimize performance metrics.',
          estimatedHours: 18,
          resources: [
            { title: 'Industry Best Practices Guide', type: 'Article', url: 'https://github.com', isFree: true }
          ],
          completed: false
        }
      ]
    },
    {
      phaseNumber: 2,
      title: 'Phase 2: Deep Dive & Production-Ready Engineering',
      durationWeeks: 3,
      focusSkills: phase2Skills.length > 0 ? phase2Skills : ['Database Optimization', 'Containerization'],
      milestones: [
        {
          title: `Architect systems utilizing ${phase2Skills.join(' & ') || 'Containerization & Cloud'}`,
          description: 'Containerize with Docker, establish automated workflows, and configure environment isolation.',
          estimatedHours: 25,
          resources: [
            { title: 'Docker & Microservices Deep Dive', type: 'Course', url: 'https://docker.com', isFree: true }
          ],
          projectIdea: {
            title: 'End-to-End Scalable Application',
            description: 'Deploy multi-container environment with caching and database migrations.',
            deliverable: 'Live demo URL and Docker Compose configuration'
          },
          completed: false
        }
      ]
    },
    {
      phaseNumber: 3,
      title: 'Phase 3: System Design, Observability & Interview Readiness',
      durationWeeks: 2,
      focusSkills: phase3Skills.length > 0 ? phase3Skills : ['System Design', 'CI/CD Pipelines'],
      milestones: [
        {
          title: 'System Design & Scalability Mock Interviews',
          description: 'Practice high-level architecture designs, trade-off evaluations (CAP theorem, caching, SQL vs NoSQL).',
          estimatedHours: 15,
          resources: [
            { title: 'System Design Primer', type: 'Documentation', url: 'https://github.com/donnemartin/system-design-primer', isFree: true }
          ],
          completed: false
        },
        {
          title: 'Resume & Portfolio Refresh with Validated Metrics',
          description: 'Document newly mastered skills on resume with quantifiable business impact numbers.',
          estimatedHours: 10,
          resources: [
            { title: 'Tech Resume Action Verbs & Formula', type: 'Article', url: 'https://www.freecodecamp.org/news', isFree: true }
          ],
          completed: false
        }
      ]
    }
  ];

  const candidateName = candidateInfo?.candidateName || 'Candidate';
  const summary = `Based on our comprehensive AI assessment, ${candidateName} exhibits a ${overallMatchScore}% match for the ${benchmarkRole.title} role. Strengths include ${strengths.slice(0, 3).join(', ') || 'adaptability and technical fundamentals'}. The key growth opportunities lie in ${keyGaps.slice(0, 3).join(', ') || 'advanced production deployment and system scalability'}. Following the generated personalized roadmap will accelerate readiness within an estimated 8 weeks.`;

  return {
    candidateName,
    targetRole: benchmarkRole.title,
    overallMatchScore,
    summary,
    strengths,
    keyGaps,
    radarData,
    skillGaps,
    extractedSkills,
    recommendations,
    roadmap: {
      targetRole: benchmarkRole.title,
      candidateName,
      totalDurationWeeks: 8,
      phases,
      overallProgressPercentage: 0
    },
    aiProviderUsed: 'Heuristic Rule-Engine (Offline Ready)'
  };
};
