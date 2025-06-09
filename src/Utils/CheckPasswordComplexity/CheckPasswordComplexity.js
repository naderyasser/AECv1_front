export function checkPasswordComplexity(password) {
  // Initialize score and feedback
  let score = 0;
  let feedback = [];

  // Check length
  if (password.length < 8) {
    feedback.push({
      message: "Password is too short. Minimum 8 characters required.",
      type: "negative",
    });
  } else {
    score += Math.min(2, Math.floor(password.length / 8));
    if (password.length >= 12) {
      feedback.push({
        message: "Good length!",
        type: "positive",
      });
    }
  }

  // Check for numbers
  if (/\d/.test(password)) {
    score++;
    if (password.match(/\d/g).length >= 2) {
      score++;
      feedback.push({
        message: "Good use of numbers!",
        type: "positive",
      });
    }
  } else {
    feedback.push({
      message: "Add numbers for stronger password.",
      type: "negative",
    });
  }

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push({
      message: "Add lowercase letters.",
      type: "negative",
    });
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push({
      message: "Add uppercase letters.",
      type: "negative",
    });
  }

  // Check for special characters
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 2;
    feedback.push({
      message: "Good use of special characters!",
      type: "positive",
    });
  } else {
    feedback.push({
      message: "Add special characters for stronger password.",
      type: "negative",
    });
  }

  // Check for common patterns
  if (/(\w)\1{2,}/.test(password)) {
    score--;
    feedback.push({
      message: "Avoid repeating characters.",
      type: "negative",
    });
  }

  if (/^(123|abc|qwerty|password|admin|user)/i.test(password)) {
    score -= 2;
    feedback.push({
      message: "Avoid common password patterns.",
      type: "negative",
    });
  }

  // Calculate complexity level
  let complexity = {
    score: Math.max(0, Math.min(10, score)),
    level: "",
    feedback: feedback,
  };

  // Determine complexity level based on score
  if (score >= 8) {
    complexity.level = "Very Strong";
  } else if (score >= 6) {
    complexity.level = "Strong";
  } else if (score >= 4) {
    complexity.level = "Moderate";
  } else if (score >= 2) {
    complexity.level = "Weak";
  } else {
    complexity.level = "Very Weak";
  }

  return complexity;
}
