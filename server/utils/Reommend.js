import fetch from "node-fetch";
import pdfParse from "pdf-parse/lib/pdf-parse.js"; // Use browserified version

export const scoreResumeAgainstJobKeywords = async (cvUrl, jobKeywords) => {
  try {
    const response = await fetch(cvUrl);
    if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    const data = await pdfParse(buffer);
    const text = data.text.toLowerCase();
    const resumeWords = new Set(text.match(/\b[a-z]{2,}\b/g) || []);

    const mustHaveMatches = jobKeywords.must_have.filter(kw => 
      resumeWords.has(kw.toLowerCase())
    );
    const niceToHaveMatches = jobKeywords.nice_to_have.filter(kw => 
      resumeWords.has(kw.toLowerCase())
    );
    const bonusMatches = jobKeywords.bonus.filter(kw => 
      resumeWords.has(kw.toLowerCase())
    );

    const totalMust = jobKeywords.must_have.length;
    const mustMatchRatio = totalMust ? mustHaveMatches.length / totalMust : 0;
    
    const totalNiceBonus = jobKeywords.nice_to_have.length + jobKeywords.bonus.length;
    const niceBonusRatio = totalNiceBonus 
      ? (niceToHaveMatches.length + bonusMatches.length) / totalNiceBonus 
      : 0;

    let label = "not_relevant";
    if (mustMatchRatio >= 0.75) {
      label = "relevant";
    } else if (mustMatchRatio >= 0.4 && niceBonusRatio >= 0.4) {
      label = "recommended";
    }

    return { success: true, scoreLabel: label };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, scoreLabel: "not_relevant", error: error.message };
  }
};
