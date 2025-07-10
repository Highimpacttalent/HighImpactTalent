import fetch from "node-fetch";
import pdfParse from "pdf-parse/lib/pdf-parse.js"; // Use browserified version

export const scoreResumeAgainstJobKeywords = async (cvUrl, job, applicant) => {
  try {
    const response = await fetch(cvUrl);
    if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    const data = await pdfParse(buffer);
    const text = data.text.toLowerCase();
    const resumeWords = new Set(text.match(/\b[a-z]{2,}\b/g) || []);

    const mustHaveMatches = job.keywords?.must_have?.filter(kw =>
      resumeWords.has(kw.toLowerCase())
    ) || [];
    const niceToHaveMatches = job.keywords?.nice_to_have?.filter(kw =>
      resumeWords.has(kw.toLowerCase())
    ) || [];
    const bonusMatches = job.keywords?.bonus?.filter(kw =>
      resumeWords.has(kw.toLowerCase())
    ) || [];

    const totalMust = job.keywords?.must_have?.length || 0;
    const mustMatchRatio = totalMust ? mustHaveMatches.length / totalMust : 0;

    const totalNiceBonus =
      (job.keywords?.nice_to_have?.length || 0) +
      (job.keywords?.bonus?.length || 0);
    const niceBonusRatio = totalNiceBonus
      ? (niceToHaveMatches.length + bonusMatches.length) / totalNiceBonus
      : 0;

    // 🔍 Relevance Classification
    let label = "not_relevant";
    if (mustMatchRatio >= 0.75) {
      label = "relevant";
    } else if (mustMatchRatio >= 0.4 && niceBonusRatio >= 0.4) {
      label = "recommended";
    }

    // 🎯 Weights (Equal for Experience & Skills)
    const weights = {
      exp: 35,
      skills: 35,
      loc: 15,
      sal: 15,
    };

    // ✅ 1) Experience Score
    const jobMinExp = job.experience?.minExperience ?? job.experience;
    let expScore = 0;
    if (jobMinExp !== undefined && jobMinExp !== null) {
      const ratio = Math.min(Number(applicant.experience) / Number(jobMinExp), 1);
      expScore = ratio * weights.exp;
    } else {
      expScore = weights.exp;
    }

    // ✅ 2) Skills Score (from Resume)
    const totalSkills =
      (job.keywords?.must_have?.length || 0) +
      (job.keywords?.nice_to_have?.length || 0) +
      (job.keywords?.bonus?.length || 0);
    const totalMatches =
      mustHaveMatches.length + niceToHaveMatches.length + bonusMatches.length;

    const skillScoreRatio = totalSkills ? totalMatches / totalSkills : 0;
    const skillsScore = skillScoreRatio * weights.skills;

    // ✅ 3) Location Score
    let locScore = 0;
    if (job.jobLocation) {
      if (
        job.jobLocation.toLowerCase() === "hybrid" ||
        applicant.currentLocation?.toLowerCase() === job.jobLocation.toLowerCase() ||
        applicant.openToRelocate?.toLowerCase() === "yes"
      ) {
        locScore = weights.loc;
      }
    } else {
      locScore = weights.loc;
    }

    // ✅ 4) Salary Score
    const jobMinSalary = job.salary?.minSalary ?? job.salary;
    let salScore = 0;
    if (jobMinSalary !== undefined && jobMinSalary !== null) {
      if (
        !applicant.expectedMinSalary ||
        parseInt(applicant.expectedMinSalary, 10) <= parseInt(jobMinSalary, 10)
      ) {
        salScore = weights.sal;
      }
    } else {
      salScore = weights.sal;
    }

    // ✅ Total Score Before Cap
    let totalScore = expScore + skillsScore + locScore + salScore;

    // ⛔ Cap max score to 50 if not relevant
    if (label === "not_relevant") {
      totalScore = Math.min(totalScore, 50);
    }

    const matchPercentage = Math.round(totalScore);

    // 🎯 Breakdown for transparency
    const breakdown = {
      experience: `${expScore.toFixed(1)} / ${weights.exp}`,
      skills: `${skillsScore.toFixed(1)} / ${weights.skills}`,
      location: `${locScore.toFixed(1)} / ${weights.loc}`,
      salary: `${salScore.toFixed(1)} / ${weights.sal}`,
    };

    return {
      success: true,
      scoreLabel: label,
      matchPercentage,
      breakdown,
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      success: false,
      scoreLabel: "not_relevant",
      matchPercentage: 0,
      breakdown: {
        experience: `0 / 35`,
        skills: `0 / 35`,
        location: `0 / 15`,
        salary: `0 / 15`,
      },
      error: error.message,
    };
  }
};
