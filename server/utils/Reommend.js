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

    // 🎯 Weights (Updated)
    const weights = {
      exp: 35,
      skills: 25,
      sal: 20,
      loc: 20,
    };

    // ✅ 1) Experience Match (% match × 35)
    const jobMinExp = job.experience?.minExperience ?? job.experience;
    let expScore = 0;
    if (jobMinExp !== undefined && jobMinExp !== null && applicant.experience) {
      const ratio = Math.min(Number(applicant.experience) / Number(jobMinExp), 1);
      expScore = ratio * weights.exp;
    }

    // ✅ 2) Skill Match (% match × 25)
    const totalSkills =
      (job.keywords?.must_have?.length || 0) +
      (job.keywords?.nice_to_have?.length || 0) +
      (job.keywords?.bonus?.length || 0);
    const totalMatches =
      mustHaveMatches.length + niceToHaveMatches.length + bonusMatches.length;

    const skillScoreRatio = totalSkills ? totalMatches / totalSkills : 0;
    const skillsScore = skillScoreRatio * weights.skills;

    // ✅ 3) Salary Score (Discrete Conditions)
    let salScore = 0;
    const jobMinSalary = parseInt(job.salary?.minSalary ?? job.salary ?? 0, 10);
    const currentSalary = parseInt(applicant.currentSalary ?? 0, 10);

    if (!isNaN(currentSalary) && !isNaN(jobMinSalary)) {
      if (currentSalary < jobMinSalary) {
        salScore = weights.sal;
      } else if (currentSalary === jobMinSalary) {
        salScore = 10;
      } else {
        salScore = 0;
      }
    }

    // ✅ 4) Location Score (Discrete Conditions)
    let locScore = 0;
    if (job.jobLocation) {
      const jobLoc = job.jobLocation.toLowerCase();
      const appLoc = applicant.currentLocation?.toLowerCase();
      const openToRelocate = applicant.openToRelocate?.toLowerCase() === "yes";

      if (appLoc === jobLoc) {
        locScore = weights.loc;
      } else if (openToRelocate) {
        locScore = 10;
      } else {
        locScore = 0;
      }
    } else {
      locScore = weights.loc; // If no location specified, give full score
    }

    // ✅ Total Score
    const totalScore = expScore + skillsScore + salScore + locScore;
    const matchPercentage = Math.round(totalScore);


    // 🎯 Breakdown for transparency
    const breakdown = {
      experience: `${expScore.toFixed(1)} / ${weights.exp}`,
      skills: `${skillsScore.toFixed(1)} / ${weights.skills}`,
      salary: `${salScore.toFixed(1)} / ${weights.sal}`,
      location: `${locScore.toFixed(1)} / ${weights.loc}`,
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
        skills: `0 / 25`,
        location: `0 / 20`,
        salary: `0 / 20`,
      },
      error: error.message,
    };
  }
};
