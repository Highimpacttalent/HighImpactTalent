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

    let label = "not_relevant";
    if (mustMatchRatio >= 0.75) {
      label = "relevant";
    } else if (mustMatchRatio >= 0.4 && niceBonusRatio >= 0.4) {
      label = "recommended";
    }

    // Calculate weighted match score
    const weights = {
      exp: 45,
      skills: 15,
      loc: 20,
      sal: 20,
    };

    // 1) Experience
    const jobMinExp = job.experience?.minExperience ?? job.experience;
    let expScore = 0;
    if (jobMinExp !== undefined && jobMinExp !== null) {
      const ratio = Math.min(Number(applicant.experience) / Number(jobMinExp), 1);
      expScore = ratio * weights.exp;
    } else {
      expScore = weights.exp;
    }

    // 2) Skills from resume
    const totalSkills =
      (job.keywords?.must_have?.length || 0) +
      (job.keywords?.nice_to_have?.length || 0) +
      (job.keywords?.bonus?.length || 0);
    const totalMatches =
      mustHaveMatches.length + niceToHaveMatches.length + bonusMatches.length;

    const skillScoreRatio = totalSkills ? totalMatches / totalSkills : 0;
    const skillsScore = skillScoreRatio * weights.skills;

    // 3) Location
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

    // 4) Salary
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

    const totalScore = Math.round(expScore + skillsScore + locScore + salScore);

    const breakdown = {
      experience: `${expScore.toFixed(1)} / ${weights.exp}`,
      skills: `${skillsScore.toFixed(1)} / ${weights.skills}`,
      location: `${locScore.toFixed(1)} / ${weights.loc}`,
      salary: `${salScore.toFixed(1)} / ${weights.sal}`,
    };

    return {
      success: true,
      scoreLabel: label,
      matchPercentage: totalScore,
      breakdown,
    };
  } catch (error) {
    console.error("Error:", error.message);
    return {
      success: false,
      scoreLabel: "not_relevant",
      matchPercentage: 0,
      breakdown: {
        experience: "0 / 45",
        skills: "0 / 15",
        location: "0 / 20",
        salary: "0 / 20",
      },
      error: error.message,
    };
  }
};
