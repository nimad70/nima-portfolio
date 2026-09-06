import {
  educationSchema,
  parseContent,
  roleSchema,
  skillGroupSchema,
  type Education,
  type Role,
  type SkillGroup,
} from "./schema";
import { z } from "zod";

/**
 * CV data, migrated from legacy/pages/about.html.
 *
 * Structured rather than MDX because it is a list of records, not prose —
 * the About page, the sitemap and (Phase 5) the RAG corpus all read the same
 * objects. Validated at module load, so a malformed entry fails the build.
 */

const rolesRaw = [
  {
    title: "AI Research Intern — LLMs",
    organisation: "ICIS, Radboud University",
    location: "Nijmegen, Netherlands",
    start: "Oct 2023",
    end: "Mar 2024",
    highlights: [
      "Researched LLM vulnerabilities in RAG systems via poisoned vector databases, demonstrating up to 40% degradation in answer quality.",
      "Implemented memory-efficient fine-tuning for LLaMA-2 using LoRA, QLoRA and 8-bit/4-bit quantisation, bringing training within reach of a single consumer GPU.",
      "Built a semantic search QA pipeline on ChromaDB and InstructorEmbedding, orchestrated with LangChain.",
      "Streamlined document preprocessing and embedding over large unstructured corpora with PyPDFLoader and SentenceTransformers.",
    ],
  },
  {
    title: "Freelance Software Developer",
    organisation: "Independent",
    location: "Remote",
    start: "Oct 2017",
    end: "Jul 2021",
    highlights: [
      "Built a used-car price prediction model explaining roughly 90% of price variance (R² ≈ 0.90) with scikit-learn, including feature engineering, missing-value handling and categorical encoding.",
      "Collected training data by scraping listings with BeautifulSoup and Requests, storing to MySQL.",
      "Led development of a personalised fitness coaching Android app in Java.",
      "Delivered web applications in Django, PHP, AngularJS and JavaScript, with responsive front-ends and scalable back-ends.",
    ],
  },
  {
    title: "Front-End Developer",
    organisation: "Jahankit Electronics",
    location: "Tehran, Iran",
    start: "Mar 2017",
    end: "Sep 2017",
    highlights: [
      "Introduced Scrum to the team, improving delivery predictability.",
      "Built a responsive e-commerce front-end in JavaScript and Bootstrap, contributing to a 20% increase in online sales.",
      "Ran user research and rebuilt the front-end in modular components off the back of it.",
    ],
  },
  {
    title: "Full Stack Developer",
    organisation: "Mecatec",
    location: "Hamedan, Iran",
    start: "Feb 2016",
    end: "Dec 2016",
    highlights: [
      "Built responsive websites in PHP, JavaScript, CSS3 and MySQL.",
      "Improved page performance through front-end and database query optimisation.",
      "Worked in an agile team delivering client-specific solutions.",
    ],
  },
  {
    title: "Web Development Intern",
    organisation: "Bu-Ali Sina University",
    location: "Hamedan, Iran",
    start: "Jun 2014",
    end: "Sep 2014",
    highlights: [
      "Designed and built a student auction site for trading books and goods, in HTML5, CSS3, PHP and MySQL.",
    ],
  },
];

const educationRaw = [
  {
    degree: "M.Sc. Computer Science",
    institution: "University of Padua",
    location: "Padua, Italy",
    start: "2021",
    end: "2024",
    detail: [
      "Specialisation in artificial intelligence, machine learning and NLP.",
      "Deep learning across RNNs, CNNs, LSTMs and transformers, in PyTorch and TensorFlow.",
      "Thesis: exposing LLM vulnerabilities through poisoned vector databases in RAG systems.",
    ],
  },
  {
    degree: "B.Eng. Computer Engineering",
    institution: "Bu-Ali Sina University",
    location: "Hamedan, Iran",
    start: "2010",
    end: "2015",
    detail: [
      "Software engineering major, focused on algorithms, SQL and object-oriented programming in C and C++.",
      "Thesis: design of a web-based exceptional-talents admission system.",
    ],
  },
];

const skillsRaw = [
  { heading: "Languages", items: ["Python", "C++", "R", "SQL"] },
  {
    heading: "AI & ML",
    items: [
      "PyTorch",
      "TensorFlow",
      "scikit-learn",
      "Hugging Face",
      "LangChain",
      "OpenCV",
      "pandas",
    ],
  },
  {
    heading: "Techniques",
    items: [
      "Fine-tuning (LoRA / QLoRA)",
      "Retrieval-augmented generation",
      "Prompt engineering",
      "Computer vision",
      "Data preprocessing",
    ],
  },
  { heading: "Data", items: ["SQL", "MongoDB", "ChromaDB"] },
  { heading: "Platform", items: ["Docker", "Git", "Azure", "REST APIs"] },
];

export const roles: Role[] = parseContent(
  z.array(roleSchema),
  rolesRaw,
  "src/content/cv.ts (roles)",
);

export const education: Education[] = parseContent(
  z.array(educationSchema),
  educationRaw,
  "src/content/cv.ts (education)",
);

export const skills: SkillGroup[] = parseContent(
  z.array(skillGroupSchema),
  skillsRaw,
  "src/content/cv.ts (skills)",
);
