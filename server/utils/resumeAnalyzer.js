const COMMON_SKILLS = [
  "javascript",
  "react",
  "node.js",
  "express",
  "mongodb",
  "mysql",
  "html",
  "css",
  "python",
  "java",
  "c++",
  "git",
  "github",
  "redux",
  "typescript",
  "tailwind",
  "bootstrap",
  "api",
  "rest",
  "sql",
  "firebase",
  "docker",
  "aws",
  "linux",
  "machine learning",
  "data analysis",
];

const ACTION_VERBS = [
  "developed",
  "built",
  "created",
  "designed",
  "implemented",
  "managed",
  "improved",
  "optimized",
  "led",
  "worked",
  "collaborated",
  "deployed",
  "integrated",
  "analyzed",
  "automated",
  "maintained",
];

const REQUIRED_SECTIONS = [
  "summary",
  "education",
  "experience",
  "projects",
  "skills",
];

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function analyzeResume(text) {
  const cleanText = text.replace(/\s+/g, " ").trim();
  const lowerText = cleanText.toLowerCase();

  const words = cleanText.match(/[a-zA-Z]+/g) || [];
  const wordCount = words.length;

  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i.test(cleanText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?(\d{10}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/.test(cleanText);
  const hasLinkedIn = lowerText.includes("linkedin");
  const hasGithub = lowerText.includes("github");

  const sectionMap = {
    summary: includesAny(lowerText, ["summary", "objective", "profile"]),
    education: includesAny(lowerText, ["education", "degree", "university", "college"]),
    experience: includesAny(lowerText, ["experience", "employment", "work history", "internship"]),
    projects: includesAny(lowerText, ["projects", "project"]),
    skills: includesAny(lowerText, ["skills", "technical skills", "technologies"]),
  };

  const foundSections = Object.keys(sectionMap).filter((key) => sectionMap[key]);
  const missingSections = REQUIRED_SECTIONS.filter((key) => !sectionMap[key]);

  const foundSkills = COMMON_SKILLS.filter((skill) =>
    lowerText.includes(skill.toLowerCase())
  );

  const numberMatches = cleanText.match(/\b\d+%?|\b\d+\+/g) || [];

  const usedActionVerbs = ACTION_VERBS.filter((verb) =>
    lowerText.includes(verb)
  );

  let score = 0;

  // Contact details - 15
  if (hasEmail) score += 5;
  if (hasPhone) score += 5;
  if (hasLinkedIn || hasGithub) score += 5;

  // Important sections - 25
  score += Math.round((foundSections.length / REQUIRED_SECTIONS.length) * 25);

  // Skills - 20
  score += Math.min(foundSkills.length * 3, 20);

  // Resume length/content - 15
  if (wordCount >= 450) score += 15;
  else if (wordCount >= 300) score += 12;
  else if (wordCount >= 180) score += 8;
  else score += 4;

  // Achievements with numbers - 15
  score += Math.min(numberMatches.length * 3, 15);

  // Action verbs - 10
  score += Math.min(usedActionVerbs.length * 2, 10);

  score = Math.min(score, 100);

  let feedback = "";
  if (score >= 85) {
    feedback = "Excellent resume. It is well structured and job-ready.";
  } else if (score >= 70) {
    feedback = "Good resume, but it can be improved with stronger achievements and better structure.";
  } else if (score >= 50) {
    feedback = "Average resume. Add missing sections, more skills, and measurable achievements.";
  } else {
    feedback = "Resume needs improvement. Add proper sections, contact details, skills, and project/experience details.";
  }

  const suggestions = [];

  if (!hasEmail) suggestions.push("Add a professional email address.");
  if (!hasPhone) suggestions.push("Add your phone number.");
  if (!hasLinkedIn && !hasGithub) {
    suggestions.push("Add LinkedIn or GitHub profile link.");
  }

  missingSections.forEach((section) => {
    suggestions.push(`Add a clear ${section} section.`);
  });

  if (foundSkills.length < 5) {
    suggestions.push("Add more relevant technical skills.");
  }

  if (wordCount < 300) {
    suggestions.push("Your resume content is short. Add more details about projects, experience, and achievements.");
  }

  if (numberMatches.length < 3) {
    suggestions.push("Add measurable achievements like percentages, numbers, users, revenue, or performance improvements.");
  }

  if (usedActionVerbs.length < 5) {
    suggestions.push("Use stronger action verbs like developed, implemented, optimized, created, and deployed.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Your resume is strong. Keep formatting clean and tailor it for each job role.");
  }

  return {
    score,
    feedback,
    suggestions,
    wordCount,
    foundSections,
    missingSections,
    foundSkills,
    contact: {
      email: hasEmail,
      phone: hasPhone,
      linkedin: hasLinkedIn,
      github: hasGithub,
    },
  };
}

module.exports = analyzeResume;