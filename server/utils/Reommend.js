import fetch from "node-fetch";
import pdfParse from "pdf-parse";

/**
 * Scores resume against job keywords and returns a match label.
 * @param {string} cvUrl - Publicly accessible PDF resume URL
 * @param {Object} jobKeywords - Keywords grouped into must_have, nice_to_have, bonus
 * @returns {Promise<{success: boolean, scoreLabel: string, error?: string}>}
 */
export const scoreResumeAgainstJobKeywords = async (cvUrl, jobKeywords) => {
  try {
    const response = await fetch(cvUrl);
    if (!response.ok) throw new Error("Failed to fetch resume PDF");

    const buffer = await response.buffer();
    const data = await pdfParse(buffer);
    const text = data.text.toLowerCase();
    const resumeWords = new Set(text.match(/\b[a-z]{2,}\b/g)); // extract only alphabetic words

    const mustHaveMatches = jobKeywords.must_have.filter((kw) =>
      resumeWords.has(kw.toLowerCase())
    );
    const niceToHaveMatches = jobKeywords.nice_to_have.filter((kw) =>
      resumeWords.has(kw.toLowerCase())
    );
    const bonusMatches = jobKeywords.bonus.filter((kw) =>
      resumeWords.has(kw.toLowerCase())
    );

    const totalMust = jobKeywords.must_have.length;
    const totalNice = jobKeywords.nice_to_have.length;
    const totalBonus = jobKeywords.bonus.length;

    const mustMatchRatio = totalMust === 0 ? 0 : mustHaveMatches.length / totalMust;
    const niceBonusRatio =
      (niceToHaveMatches.length + bonusMatches.length) /
      (totalNice + totalBonus || 1); // prevent division by 0

    let label = "not_relevant";
    if (mustMatchRatio >= 0.75) {
      label = "relevant";
    } else if (mustMatchRatio >= 0.4 && niceBonusRatio >= 0.4) {
      label = "recommended";
    }

    return {
      success: true,
      scoreLabel: label,
    };
  } catch (error) {
    console.error("Resume Scoring Error:", error.message);
    return {
      success: false,
      scoreLabel: "not_relevant",
      error: error.message,
    };
  }
};
