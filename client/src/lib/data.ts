// AI Builder 100 — Foundations for Application
// Central data store for all modules, topics, and FAQ content

export interface Topic {
  id: number;
  title: string;
  type: 'video' | 'reading' | 'exercise' | 'quiz';
  duration: string;
}

export interface Module {
  id: number;
  slug: string;
  number: string;
  title: string;
  tagline: string;
  difficulty: 'Foundational' | 'Intermediate' | 'Applied';
  description: string;
  about: string;
  image: string;
  topics: Topic[];
  learningOutcomes: string[];
  prerequisites: string[];
  tools: string[];
  nextSlug?: string;
  nextTitle?: string;
}

export const MODULES: Module[] = [
  {
    id: 1,
    slug: 'ai-problem-solving',
    number: '01',
    title: 'AI Problem Solving',
    tagline: 'Introduction to AI and how it amplifies human capabilities',
    difficulty: 'Foundational',
    description:
      'Discover how artificial intelligence reframes complex problems and extends what humans can accomplish. This module introduces the core mindset behind AI-driven thinking.',
    about:
      'This module establishes the foundational lens through which you will approach every subsequent topic in the bootcamp. You will learn how AI acts as a force multiplier for human decision-making, creativity, and productivity. Through concrete examples drawn from healthcare, logistics, finance, and creative industries, you will develop an intuition for recognising where AI can and cannot add value — and why that distinction matters.',
    image:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663629670019/7jkvNcR3wFqQGyjiBuyQFW/module-01-TNzhM6UAjodPQ4wXw4D9HR.webp',
    topics: [
      { id: 1, title: 'What Is AI? Definitions and Mental Models', type: 'video', duration: '30 min' },
      { id: 2, title: 'AI as a Human Amplifier', type: 'video', duration: '35 min' },
      { id: 3, title: 'Problem Framing for AI Solutions', type: 'reading', duration: '25 min' },
      { id: 4, title: 'Identifying AI Opportunities in Real Contexts', type: 'video', duration: '40 min' },
      { id: 5, title: 'When Not to Use AI', type: 'reading', duration: '20 min' },
      { id: 6, title: 'Case Study: AI in Healthcare Triage', type: 'video', duration: '35 min' },
      { id: 7, title: 'Hands-On: Problem Framing Workshop', type: 'exercise', duration: '45 min' },
      { id: 8, title: 'Module Assessment', type: 'quiz', duration: '20 min' },
    ],
    learningOutcomes: [
      'Define AI and articulate its relationship to human intelligence',
      'Apply a structured problem-framing approach to identify AI opportunities',
      'Evaluate whether a given problem is suitable for an AI solution',
      'Recognise real-world examples of AI amplifying human capabilities',
    ],
    prerequisites: ['No prior AI experience required', 'Curiosity and an open mindset'],
    tools: ['Notion', 'Miro', 'ChatGPT'],
    nextSlug: 'ai-everyday-life',
    nextTitle: 'AI in Everyday Life',
  },
  {
    id: 2,
    slug: 'ai-everyday-life',
    number: '02',
    title: 'AI in Everyday Life',
    tagline: 'Understanding types of AI and where they are used',
    difficulty: 'Foundational',
    description:
      'Map the landscape of AI technologies embedded in daily life — from recommendation engines to voice assistants — and understand the distinct categories of AI that power them.',
    about:
      'AI is already woven into the fabric of everyday experience, yet most people interact with it without recognising its presence. This module gives you a taxonomy of AI types — narrow AI, generative AI, predictive systems, and more — and traces each to the products and services you encounter daily. By the end, you will be able to look at any digital product and identify the AI mechanisms at work beneath the surface.',
    image:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663629670019/7jkvNcR3wFqQGyjiBuyQFW/module-02-59jTRsqAskwZPLNStD6dod.webp',
    topics: [
      { id: 1, title: 'A Taxonomy of AI: Narrow, General, and Generative', type: 'video', duration: '35 min' },
      { id: 2, title: 'Recommendation Systems: How Netflix and Spotify Work', type: 'video', duration: '40 min' },
      { id: 3, title: 'Voice Assistants and Natural Language Interfaces', type: 'reading', duration: '25 min' },
      { id: 4, title: 'Computer Vision in Consumer Products', type: 'video', duration: '35 min' },
      { id: 5, title: 'Predictive AI: From Fraud Detection to Navigation', type: 'reading', duration: '30 min' },
      { id: 6, title: 'Generative AI in Creative Tools', type: 'video', duration: '40 min' },
      { id: 7, title: 'Hands-On: AI Audit of Your Daily Apps', type: 'exercise', duration: '50 min' },
      { id: 8, title: 'Module Assessment', type: 'quiz', duration: '20 min' },
    ],
    learningOutcomes: [
      'Classify AI systems by type and explain the distinctions between them',
      'Identify AI mechanisms embedded in everyday consumer products',
      'Explain how recommendation, vision, and language AI systems function at a conceptual level',
      'Conduct a basic AI audit of a digital product or service',
    ],
    prerequisites: ['Completion of Module 01 or equivalent foundational knowledge'],
    tools: ['ChatGPT', 'Google Lens', 'Spotify'],
    nextSlug: 'real-world-ai-systems',
    nextTitle: 'Real-World AI Systems',
  },
  {
    id: 3,
    slug: 'real-world-ai-systems',
    number: '03',
    title: 'Real-World AI Systems',
    tagline: 'Responsible and ethical considerations in practice',
    difficulty: 'Intermediate',
    description:
      'Examine how AI systems are designed, deployed, and maintained in production environments — and the ethical responsibilities that come with building systems that affect real people.',
    about:
      'Moving beyond theory, this module examines AI as it exists in production: the pipelines, feedback loops, and organisational structures that keep AI systems running. Crucially, it pairs this technical understanding with an ethical lens. You will study real cases where AI systems caused harm — through bias, opacity, or misaligned incentives — and learn the frameworks used by responsible practitioners to anticipate and mitigate these risks.',
    image:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663629670019/7jkvNcR3wFqQGyjiBuyQFW/module-03-cq2jLsrjFkmStQVkatjcxs.webp',
    topics: [
      { id: 1, title: 'Anatomy of a Production AI System', type: 'video', duration: '40 min' },
      { id: 2, title: 'Data Pipelines and Model Lifecycle', type: 'video', duration: '45 min' },
      { id: 3, title: 'Bias in AI: Sources, Types, and Consequences', type: 'reading', duration: '35 min' },
      { id: 4, title: 'Transparency and Explainability in AI', type: 'video', duration: '40 min' },
      { id: 5, title: 'Accountability Frameworks for AI Teams', type: 'reading', duration: '30 min' },
      { id: 6, title: 'Case Study: Algorithmic Bias in Hiring Tools', type: 'video', duration: '35 min' },
      { id: 7, title: 'Hands-On: Ethical Risk Assessment Exercise', type: 'exercise', duration: '55 min' },
      { id: 8, title: 'Module Assessment', type: 'quiz', duration: '20 min' },
    ],
    learningOutcomes: [
      'Describe the components and lifecycle of a production AI system',
      'Identify common sources of bias in AI data and model design',
      'Apply an ethical risk assessment framework to a real AI use case',
      'Articulate the principles of transparency and accountability in AI deployment',
    ],
    prerequisites: ['Modules 01 and 02 or equivalent understanding of AI types'],
    tools: ['IBM AI Fairness 360', 'Google What-If Tool', 'Miro'],
    nextSlug: 'responsible-ai-practice',
    nextTitle: 'Responsible AI in Practice',
  },
  {
    id: 4,
    slug: 'responsible-ai-practice',
    number: '04',
    title: 'Responsible AI in Practice',
    tagline: 'Applying AI with awareness of impact and limitations',
    difficulty: 'Intermediate',
    description:
      'Translate ethical principles into actionable practices. Learn how to design, evaluate, and communicate AI solutions that are fair, transparent, and mindful of their limitations.',
    about:
      'Responsible AI is not a checklist — it is a continuous practice embedded in every stage of the development process. This module equips you with practical tools: fairness metrics, model cards, impact assessments, and stakeholder communication strategies. You will work through scenarios that require balancing competing values — accuracy versus fairness, automation versus human oversight — and develop the judgment to navigate these trade-offs in real professional contexts.',
    image:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663629670019/7jkvNcR3wFqQGyjiBuyQFW/module-04-UnBMd4yueuZh72TYsvVx4D.webp',
    topics: [
      { id: 1, title: 'Responsible AI Principles: A Practitioner\'s Framework', type: 'video', duration: '35 min' },
      { id: 2, title: 'Fairness Metrics and How to Measure Them', type: 'video', duration: '40 min' },
      { id: 3, title: 'Writing Model Cards and Datasheets', type: 'reading', duration: '30 min' },
      { id: 4, title: 'AI Impact Assessments in Organisations', type: 'video', duration: '40 min' },
      { id: 5, title: 'Human-in-the-Loop Design Patterns', type: 'reading', duration: '30 min' },
      { id: 6, title: 'Communicating AI Limitations to Stakeholders', type: 'video', duration: '35 min' },
      { id: 7, title: 'Hands-On: Drafting a Model Card', type: 'exercise', duration: '50 min' },
      { id: 8, title: 'Module Assessment', type: 'quiz', duration: '20 min' },
    ],
    learningOutcomes: [
      'Apply fairness metrics to evaluate an AI model\'s outputs',
      'Draft a model card documenting an AI system\'s intended use and limitations',
      'Design human-in-the-loop mechanisms for high-stakes AI decisions',
      'Communicate AI limitations clearly to non-technical stakeholders',
    ],
    prerequisites: ['Module 03 or equivalent understanding of AI ethics fundamentals'],
    tools: ['Hugging Face Model Cards', 'Airtable', 'Notion'],
    nextSlug: 'ai-agents-automation',
    nextTitle: 'AI Agents and Automation',
  },
  {
    id: 5,
    slug: 'ai-agents-automation',
    number: '05',
    title: 'AI Agents and Automation',
    tagline: 'Introduction to workflows, agents, and orchestration',
    difficulty: 'Applied',
    description:
      'Enter the frontier of agentic AI — systems that plan, act, and coordinate autonomously. Learn how to design and orchestrate AI workflows that go beyond single-model interactions.',
    about:
      'The next wave of AI is not just models that answer questions — it is agents that take actions, use tools, and coordinate with other agents to complete complex tasks. This module introduces the architecture of AI agents: how they perceive their environment, plan sequences of actions, and call external tools. You will explore orchestration frameworks, build a simple multi-step workflow, and examine the governance challenges that arise when AI systems act with greater autonomy.',
    image:
      'https://d2xsxph8kpxj0f.cloudfront.net/310519663629670019/7jkvNcR3wFqQGyjiBuyQFW/module-05-C2VwzGHjpTfAAELefqBR78.webp',
    topics: [
      { id: 1, title: 'What Are AI Agents? Architecture and Capabilities', type: 'video', duration: '40 min' },
      { id: 2, title: 'Tool Use and Function Calling in LLMs', type: 'video', duration: '45 min' },
      { id: 3, title: 'Workflow Orchestration: Patterns and Frameworks', type: 'reading', duration: '35 min' },
      { id: 4, title: 'Multi-Agent Systems and Coordination', type: 'video', duration: '45 min' },
      { id: 5, title: 'Governing Autonomous AI: Risks and Safeguards', type: 'reading', duration: '30 min' },
      { id: 6, title: 'Case Study: AI Agents in Business Process Automation', type: 'video', duration: '40 min' },
      { id: 7, title: 'Hands-On: Building a Simple AI Workflow', type: 'exercise', duration: '60 min' },
      { id: 8, title: 'Module Assessment', type: 'quiz', duration: '25 min' },
    ],
    learningOutcomes: [
      'Explain the architecture and decision-making loop of an AI agent',
      'Describe how tool use and function calling extend LLM capabilities',
      'Design a multi-step AI workflow for a real business process',
      'Identify governance risks in autonomous AI systems and propose safeguards',
    ],
    prerequisites: ['Modules 01–04 or equivalent foundational AI knowledge'],
    tools: ['LangChain', 'n8n', 'OpenAI API', 'Zapier'],
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Who is this bootcamp designed for?',
    answer:
      'AI Builder 100 is designed for professionals, students, and curious individuals who want to build a practical understanding of AI — no prior technical background required. Whether you are in business, design, education, or any other field, this bootcamp gives you the foundational literacy to engage confidently with AI.',
  },
  {
    question: 'Do I need programming experience to participate?',
    answer:
      'No programming experience is required. The curriculum focuses on conceptual understanding, practical frameworks, and applied thinking rather than code. Hands-on exercises use accessible tools that require no technical setup.',
  },
  {
    question: 'Are the modules independent or sequential?',
    answer:
      'The modules are designed to build on each other sequentially, with each one deepening the context established by the previous. That said, learners with prior AI exposure may find they can engage with later modules independently.',
  },
  {
    question: 'Will I receive a certificate upon completion?',
    answer:
      'Yes. Learners who complete all five modules and their assessments will receive a certificate of completion for AI Builder 100 — Foundations for Application.',
  },
  {
    question: 'How is progress tracked?',
    answer:
      'Your progress is saved automatically in your browser as you complete topics. You can view your overall completion status and module-by-module breakdown at any time on the My Progress page.',
  },
  {
    question: 'What makes this bootcamp different from a standard online course?',
    answer:
      'AI Builder 100 is structured as a bootcamp — meaning it prioritises applied, practical learning over passive consumption. Every module includes hands-on exercises and real-world case studies designed to build judgment and capability, not just awareness.',
  },
];

export const STATS = [
  { value: 5, label: 'Core Modules', suffix: '' },
  { value: 40, label: 'Hours of Content', suffix: '+' },
  { value: 5, label: 'Hands-on Exercises', suffix: '' },
  { value: 100, label: 'Practical Focus', suffix: '%' },
];
