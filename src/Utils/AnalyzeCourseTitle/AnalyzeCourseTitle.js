export function analyzeCourseTitle(title) {
  const analysis = {
    score: 0,
    engagement: "",
    feedback: [],
    strengths: [],
    improvements: [],
  };

  const includesAnyWord = (text, words) =>
    words.some((word) => text.toLowerCase().includes(word.toLowerCase()));

  const powerWords = [
    "master",
    "essential",
    "ultimate",
    "complete",
    "advanced",
    "practical",
    "professional",
    "expert",
    "comprehensive",
    "proven",
    "secret",
    "exclusive",
    "breakthrough",
    "revolutionary",
    "innovative",
    "step-by-step",
    "quick",
    "easy",
    "powerful",
    "effective",
  ];

  const problemSolvingWords = [
    "solution",
    "fix",
    "resolve",
    "overcome",
    "improve",
    "boost",
    "enhance",
    "optimize",
    "maximize",
    "transform",
  ];

  const wordCount = title.split(/\s+/).length;
  if (wordCount < 3) {
    analysis.improvements.push(
      "Title is too short - aim for 5-10 words for better context"
    );
    analysis.score -= 1;
  } else if (wordCount > 15) {
    analysis.improvements.push(
      "Title might be too long - consider shortening it for better retention"
    );
    analysis.score -= 1;
  } else if (wordCount >= 5 && wordCount <= 10) {
    analysis.strengths.push("Optimal title length");
    analysis.score += 2;
  }

  const usedPowerWords = powerWords.filter((word) =>
    title.toLowerCase().includes(word.toLowerCase())
  );
  if (usedPowerWords.length > 0) {
    analysis.strengths.push(
      `Strong engagement words used: ${usedPowerWords.join(", ")}`
    );
    analysis.score += usedPowerWords.length;
  } else {
    analysis.improvements.push(
      `Consider adding engaging words like: ${powerWords
        .slice(0, 5)
        .join(", ")}`
    );
  }

  if (problemSolvingWords.some((word) => title.toLowerCase().includes(word))) {
    analysis.strengths.push("Addresses problem-solving or improvement");
    analysis.score += 2;
  }

  if (/\d+/.test(title)) {
    analysis.strengths.push(
      "Contains specific numbers which can increase credibility"
    );
    analysis.score += 1;
  }

  if (/how to|learn|build|create|develop|master/i.test(title)) {
    analysis.strengths.push("Uses actionable language");
    analysis.score += 2;
  }

  if (
    /for|targeting|designed for|beginners|advanced|professionals/i.test(title)
  ) {
    analysis.strengths.push("Clearly specifies target audience");
    analysis.score += 2;
  } else {
    analysis.improvements.push("Consider specifying the target audience");
  }

  if (
    title.toLowerCase().includes("certification") ||
    title.toLowerCase().includes("certified") ||
    title.toLowerCase().includes("official")
  ) {
    analysis.strengths.push(
      "Indicates professional recognition or certification"
    );
    analysis.score += 2;
  }

  analysis.score = Math.min(100, Math.max(0, analysis.score * 8));

  if (analysis.score >= 80) {
    analysis.engagement = "Highly Engaging";
  } else if (analysis.score >= 60) {
    analysis.engagement = "Engaging";
  } else if (analysis.score >= 40) {
    analysis.engagement = "Moderately Engaging";
  } else if (analysis.score >= 20) {
    analysis.engagement = "Somewhat Engaging";
  } else {
    analysis.engagement = "Needs Improvement";
  }

  analysis.feedback = [
    `Engagement Score: ${analysis.score}/100 (${analysis.engagement})`,
    "\nStrengths:",
    ...analysis.strengths.map((s) => `- ${s}`),
    "\nSuggested Improvements:",
    ...analysis.improvements.map((i) => `- ${i}`),
  ];

  return analysis;
}
