import fetch from "node-fetch";
import pdfParse from "pdf-parse/lib/pdf-parse.js"; // Use browserified version
import natural from "natural";

const stemmer = natural.PorterStemmer;

export const scoreResumeAgainstJobKeywords = async (cvUrl, job, applicant) => {
  try {
    const response = await fetch(cvUrl);
    if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    const data = await pdfParse(buffer);
    const text = data.text.toLowerCase();

    // 🧠 Stemming to normalize words
    const words = text.match(/\b[a-z]{2,}\b/g) || [];
    const resumeWordsStemmed = new Set(words.map(w => stemmer.stem(w)));

    // 🏷️ Keyword matching with stemming
    const stemArray = arr => (Array.isArray(arr) ? arr.map(w => stemmer.stem(w.toLowerCase())) : []);

    const mustHave = stemArray(job.keywords?.must_have);
    const niceToHave = stemArray(job.keywords?.nice_to_have);
    const bonus = stemArray(job.keywords?.bonus);
    const redFlags = stemArray(job.keywords?.red_flags);

    const mustHaveMatches = mustHave.filter(kw => resumeWordsStemmed.has(kw));
    const niceToHaveMatches = niceToHave.filter(kw => resumeWordsStemmed.has(kw));
    const bonusMatches = bonus.filter(kw => resumeWordsStemmed.has(kw));
    const redFlagMatches = redFlags.filter(kw => resumeWordsStemmed.has(kw));

    const totalMust = mustHave.length;
    const totalNiceBonus = niceToHave.length + bonus.length;
    const totalRedFlags = redFlags.length;

    const mustMatchRatio = totalMust ? mustHaveMatches.length / totalMust : 0;
    const niceBonusRatio = totalNiceBonus ? (niceToHaveMatches.length + bonusMatches.length) / totalNiceBonus : 0;
    const redFlagRatio = totalRedFlags ? redFlagMatches.length / totalRedFlags : 0;
    const bonusRatio = bonus.length ? bonusMatches.length / bonus.length : 0;


    // 🌟 Flexible Classification Logic
    let label = "relevant"; // Start with optimistic assumption

    // If too many red flags, immediately mark as not relevant
    if (redFlagRatio >= 0.75) {
      label = "not_relevant";
    } else {
      // Strong match on must-have and nice-to-have
      if (mustMatchRatio >= 0.7 && (niceBonusRatio >= 0.3 || bonusRatio >= 0.3)) {
        label = "relevant";
      }
      // Moderate match (good musts or a nice mix)
      else if (mustMatchRatio >= 0.4 || niceBonusRatio >= 0.3) {
        label = "recommended";
      }
      // Weak but possible
      else if ((niceBonusRatio >= 0.2 || bonusRatio >= 0.3) && redFlagRatio < 0.3) {
        label = "recommended";
      }
    }


    // 🎯 Scoring weights
    const weights = {
      exp: 35,
      skills: 25,
      sal: 20,
      loc: 20,
    };

    // ✅ Experience Score
    const jobMinExp = job.experience?.minExperience;
    let expScore = 0;
    if (jobMinExp !== undefined && applicant.experience) {
      const ratio = Math.min(Number(applicant.experience) / Number(jobMinExp), 1);
      expScore = ratio * weights.exp;
    }

    // ✅ Skill Score
    const jobSkills = Array.isArray(job.skills) ? job.skills.map(s => stemmer.stem(s.toLowerCase())) : [];
    const applicantSkills = Array.isArray(applicant.skills) ? applicant.skills.map(s => stemmer.stem(s.toLowerCase())) : [];

    const matchedSkills = applicantSkills.filter(skill => jobSkills.includes(skill));
    const skillScoreRatio = jobSkills.length ? matchedSkills.length / jobSkills.length : 0;
    const skillsScore = skillScoreRatio * weights.skills;

    // ✅ Salary Score
    let salScore = 0;
    const jobMinSalary = parseInt(job.salary?.minSalary ?? job.salary ?? 0, 10);
    const currentSalary = parseInt(applicant.currentSalary ?? 0, 10);

    if (!isNaN(currentSalary) && !isNaN(jobMinSalary)) {
      if (currentSalary < jobMinSalary) salScore = weights.sal;
      else if (currentSalary === jobMinSalary) salScore = 10;
    }

    // ✅ Location Score
    let locScore = 0;
    if (job.jobLocation) {
      const jobLoc = job.jobLocation.toLowerCase();
      const appLoc = applicant.currentLocation?.toLowerCase();
      const openToRelocate = applicant.openToRelocate?.toLowerCase() === "yes";

      if (appLoc === jobLoc) locScore = weights.loc;
      else if (openToRelocate) locScore = 10;
    } else {
      locScore = weights.loc; // No location → give full
    }

    // ✅ Final Score
    const totalScore = expScore + skillsScore + salScore + locScore;
    const matchPercentage = Math.round(totalScore);

    const breakdown = {
      experience: `${expScore.toFixed(1)} / ${weights.exp}`,
      skills: `${skillsScore.toFixed(1)} / ${weights.skills}`,
      salary: `${salScore.toFixed(1)} / ${weights.sal}`,
      location: `${locScore.toFixed(1)} / ${weights.loc}`,
    };

    // Optional: Confidence Label
    let confidenceLevel = "low";
    if (label === "relevant") confidenceLevel = "high";
    else if (label === "recommended") confidenceLevel = "medium";

    return {
      success: true,
      scoreLabel: label,
      confidenceLevel,
      matchPercentage,
      redFlags: redFlagMatches,
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
