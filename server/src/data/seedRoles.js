export const defaultRoles = [
  {
    title: 'Full Stack Developer',
    slug: 'full-stack-developer',
    category: 'Software Engineering',
    description: 'Builds end-to-end scalable web applications across modern frontend architectures, robust backend APIs, relational & NoSQL databases, and cloud deployments.',
    salaryRange: { min: 85000, max: 155000, currency: 'USD' },
    marketDemand: 'Very High',
    competencyCategories: [
      { name: 'Frontend', benchmarkScore: 85 },
      { name: 'Backend', benchmarkScore: 85 },
      { name: 'Database', benchmarkScore: 80 },
      { name: 'DevOps & Cloud', benchmarkScore: 75 },
      { name: 'System Design', benchmarkScore: 75 },
      { name: 'Testing & Security', benchmarkScore: 70 }
    ],
    requiredSkills: [
      { name: 'React', category: 'Frontend', importance: 'Critical', requiredScore: 85, description: 'Component lifecycle, hooks, state management, and performance optimization' },
      { name: 'TypeScript / JavaScript', category: 'Frontend', importance: 'Critical', requiredScore: 90, description: 'ES6+, async/await, closures, typing systems' },
      { name: 'Node.js', category: 'Backend', importance: 'Critical', requiredScore: 85, description: 'Event loop, streams, REST API architecture, middleware' },
      { name: 'Express.js / NestJS', category: 'Backend', importance: 'Important', requiredScore: 80, description: 'Routing, auth middleware, rate limiting, error handling' },
      { name: 'MongoDB', category: 'Database', importance: 'Important', requiredScore: 75, description: 'Document schema design, aggregation pipeline, indexing' },
      { name: 'PostgreSQL / SQL', category: 'Database', importance: 'Important', requiredScore: 80, description: 'Relational modeling, ACID transactions, complex queries' },
      { name: 'Docker', category: 'DevOps & Cloud', importance: 'Important', requiredScore: 75, description: 'Containerization, multi-stage builds, docker-compose' },
      { name: 'Git & CI/CD', category: 'DevOps & Cloud', importance: 'Critical', requiredScore: 85, description: 'Branching workflows, GitHub Actions, automated testing pipelines' },
      { name: 'RESTful API Design', category: 'Backend', importance: 'Critical', requiredScore: 85, description: 'HTTP verbs, status codes, OpenAPI specs, auth (JWT/OAuth)' },
      { name: 'System Design & Scalability', category: 'Architecture & System Design', importance: 'Important', requiredScore: 70, description: 'Caching (Redis), load balancing, microservices vs monolith' },
      { name: 'Tailwind CSS / Modern CSS', category: 'Frontend', importance: 'Nice to have', requiredScore: 75, description: 'Responsive layouts, grid, flexbox, utility styling' },
      { name: 'Automated Testing (Jest / Cypress)', category: 'Testing & Quality', importance: 'Important', requiredScore: 70, description: 'Unit testing, integration testing, end-to-end flows' }
    ]
  },
  {
    title: 'AI / Machine Learning Engineer',
    slug: 'ai-ml-engineer',
    category: 'Artificial Intelligence',
    description: 'Designs, trains, and deploys production machine learning pipelines, LLM-based applications, RAG systems, and computer vision / NLP architectures.',
    salaryRange: { min: 110000, max: 190000, currency: 'USD' },
    marketDemand: 'Very High',
    competencyCategories: [
      { name: 'Python & Math', benchmarkScore: 90 },
      { name: 'Deep Learning & ML', benchmarkScore: 85 },
      { name: 'LLMs & GenAI', benchmarkScore: 85 },
      { name: 'MLOps & Deployment', benchmarkScore: 80 },
      { name: 'Data Engineering', benchmarkScore: 75 },
      { name: 'System Architecture', benchmarkScore: 75 }
    ],
    requiredSkills: [
      { name: 'Python', category: 'Data & AI', importance: 'Critical', requiredScore: 95, description: 'NumPy, Pandas, vectorization, object-oriented & functional Python' },
      { name: 'PyTorch / TensorFlow', category: 'Data & AI', importance: 'Critical', requiredScore: 85, description: 'Neural network training, tensor ops, GPU acceleration' },
      { name: 'LLM APIs & Prompt Engineering', category: 'Data & AI', importance: 'Critical', requiredScore: 85, description: 'Gemini, OpenAI, Anthropic, structured output, agents' },
      { name: 'RAG & Vector Databases', category: 'Data & AI', importance: 'Critical', requiredScore: 80, description: 'Pinecone, Chroma, embeddings, semantic search, hybrid retrieval' },
      { name: 'LangChain / LlamaIndex', category: 'Data & AI', importance: 'Important', requiredScore: 80, description: 'Chains, memory, agentic tooling, document chunking' },
      { name: 'Docker & Model Serving', category: 'DevOps & Cloud', importance: 'Important', requiredScore: 80, description: 'FastAPI, vLLM, Triton inference server, containerization' },
      { name: 'MLOps & CI/CD', category: 'DevOps & Cloud', importance: 'Important', requiredScore: 75, description: 'MLflow, Weights & Biases, model evaluation, tracking' },
      { name: 'Math, Linear Algebra & Stats', category: 'Data & AI', importance: 'Critical', requiredScore: 85, description: 'Probability, gradient descent, loss functions, statistics' }
    ]
  },
  {
    title: 'DevOps & Cloud Architect',
    slug: 'devops-cloud-architect',
    category: 'Cloud Infrastructure',
    description: 'Architects reliable, secure cloud-native infrastructure, automated CI/CD pipelines, Kubernetes clusters, and observability stacks.',
    salaryRange: { min: 105000, max: 175000, currency: 'USD' },
    marketDemand: 'High',
    competencyCategories: [
      { name: 'Cloud Platforms (AWS/GCP)', benchmarkScore: 90 },
      { name: 'Containers & Orchestration', benchmarkScore: 90 },
      { name: 'Infrastructure as Code', benchmarkScore: 85 },
      { name: 'CI/CD Pipelines', benchmarkScore: 85 },
      { name: 'Monitoring & Observability', benchmarkScore: 80 },
      { name: 'Security & Networking', benchmarkScore: 80 }
    ],
    requiredSkills: [
      { name: 'AWS or GCP', category: 'DevOps & Cloud', importance: 'Critical', requiredScore: 85, description: 'IAM, VPC, EC2/GCE, S3, ECS, serverless' },
      { name: 'Kubernetes (K8s)', category: 'DevOps & Cloud', importance: 'Critical', requiredScore: 85, description: 'Pods, Deployments, Services, Helm charts, ingress controllers' },
      { name: 'Terraform', category: 'DevOps & Cloud', importance: 'Critical', requiredScore: 85, description: 'HCL, state management, modules, multi-environment deployments' },
      { name: 'Docker', category: 'DevOps & Cloud', importance: 'Critical', requiredScore: 90, description: 'Dockerfile optimization, registry management, networking' },
      { name: 'CI/CD (GitHub Actions / GitLab CI)', category: 'DevOps & Cloud', importance: 'Critical', requiredScore: 85, description: 'Pipeline automation, artifact caching, security scanning' },
      { name: 'Linux / Bash Scripting', category: 'DevOps & Cloud', importance: 'Critical', requiredScore: 85, description: 'Shell scripting, system administration, process management' },
      { name: 'Prometheus & Grafana', category: 'DevOps & Cloud', importance: 'Important', requiredScore: 75, description: 'Metrics collection, dashboarding, alert manager' },
      { name: 'Cloud Security & Compliance', category: 'Security', importance: 'Important', requiredScore: 80, description: 'Zero-trust, secret management (Vault), SSL/TLS, network security' }
    ]
  },
  {
    title: 'Data Scientist',
    slug: 'data-scientist',
    category: 'Data Science',
    description: 'Extracts actionable insights and develops predictive modeling from complex datasets to drive business decision-making and automate intelligence.',
    salaryRange: { min: 95000, max: 165000, currency: 'USD' },
    marketDemand: 'High',
    competencyCategories: [
      { name: 'Python & Data Analysis', benchmarkScore: 90 },
      { name: 'Statistical Modeling & ML', benchmarkScore: 85 },
      { name: 'SQL & Data Warehousing', benchmarkScore: 85 },
      { name: 'Data Visualization & Storytelling', benchmarkScore: 80 },
      { name: 'Big Data & Pipelines', benchmarkScore: 70 },
      { name: 'Business Acumen', benchmarkScore: 75 }
    ],
    requiredSkills: [
      { name: 'Python (Pandas, NumPy, SciPy)', category: 'Data & AI', importance: 'Critical', requiredScore: 90, description: 'Data wrangling, cleansing, exploratory data analysis (EDA)' },
      { name: 'SQL', category: 'Database', importance: 'Critical', requiredScore: 90, description: 'Window functions, CTEs, complex joins, query optimization' },
      { name: 'Scikit-Learn', category: 'Data & AI', importance: 'Critical', requiredScore: 85, description: 'Supervised/unsupervised models, cross-validation, feature engineering' },
      { name: 'Data Visualization (Matplotlib, Seaborn, Tableau)', category: 'Data & AI', importance: 'Important', requiredScore: 80, description: 'Visual storytelling, executive presentation' },
      { name: 'Hypothesis Testing & A/B Testing', category: 'Data & AI', importance: 'Important', requiredScore: 80, description: 'Statistical significance, sample sizing, p-values' }
    ]
  },
  {
    title: 'Cybersecurity Analyst',
    slug: 'cybersecurity-analyst',
    category: 'Information Security',
    description: 'Safeguards organizational infrastructure, identifies vulnerabilities, monitors security incident events (SIEM), and conducts penetration testing.',
    salaryRange: { min: 85000, max: 150000, currency: 'USD' },
    marketDemand: 'Very High',
    competencyCategories: [
      { name: 'Threat Detection & SIEM', benchmarkScore: 85 },
      { name: 'Network Security', benchmarkScore: 85 },
      { name: 'Vulnerability Assessment', benchmarkScore: 80 },
      { name: 'Incident Response', benchmarkScore: 80 },
      { name: 'Security Compliance', benchmarkScore: 75 },
      { name: 'Cloud Security', benchmarkScore: 75 }
    ],
    requiredSkills: [
      { name: 'Network Protocols & Firewalls', category: 'Security', importance: 'Critical', requiredScore: 85, description: 'TCP/IP, DNS, Wireshark, IDS/IPS, packet inspection' },
      { name: 'SIEM Tools (Splunk, Sentinel)', category: 'Security', importance: 'Critical', requiredScore: 80, description: 'Log aggregation, threat hunting, alert triage' },
      { name: 'Vulnerability Scanning (Nessus, Burp Suite)', category: 'Security', importance: 'Critical', requiredScore: 80, description: 'OWASP Top 10, web penetration testing, CVE analysis' },
      { name: 'Python / Bash for Security', category: 'Security', importance: 'Important', requiredScore: 75, description: 'Security automation, scripting recon tasks' }
    ]
  },
  {
    title: 'Frontend Specialist (React / Next.js)',
    slug: 'frontend-specialist',
    category: 'Software Engineering',
    description: 'Crafts responsive, accessible, high-performance web applications with modern React, Next.js, state management, and design systems.',
    salaryRange: { min: 80000, max: 145000, currency: 'USD' },
    marketDemand: 'High',
    competencyCategories: [
      { name: 'React & Core JS', benchmarkScore: 95 },
      { name: 'Next.js & SSR', benchmarkScore: 85 },
      { name: 'UI/UX & CSS Architecture', benchmarkScore: 90 },
      { name: 'Performance & Accessibility', benchmarkScore: 85 },
      { name: 'Testing & Tooling', benchmarkScore: 75 },
      { name: 'API Integration', benchmarkScore: 80 }
    ],
    requiredSkills: [
      { name: 'React (Hooks, Context, State)', category: 'Frontend', importance: 'Critical', requiredScore: 95, description: 'Advanced patterns, custom hooks, memoization' },
      { name: 'Next.js (App Router, SSR, SSG)', category: 'Frontend', importance: 'Critical', requiredScore: 85, description: 'Server components, caching strategies, SEO optimization' },
      { name: 'TypeScript', category: 'Frontend', importance: 'Critical', requiredScore: 85, description: 'Generics, utility types, strict configuration' },
      { name: 'Tailwind CSS & Animation', category: 'Frontend', importance: 'Important', requiredScore: 85, description: 'Framer motion, responsive layout, component design systems' },
      { name: 'Web Vitals & Performance', category: 'Frontend', importance: 'Important', requiredScore: 80, description: 'Lighthouse, bundle splitting, lazy loading, image optimization' }
    ]
  }
];

export const seedDatabase = async () => {
  try {
    const { RoleBenchmark } = await import('../models/RoleBenchmark.js');
    for (const role of defaultRoles) {
      await RoleBenchmark.findOneAndUpdate(
        { slug: role.slug },
        role,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Seeded ${defaultRoles.length} role benchmarks into database`);
  } catch (err) {
    console.error('Error seeding roles:', err.message);
  }
};
