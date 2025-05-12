// filterAndRankCandidates.js

import ResumePool from '../models/ResumePool.js'; // Adjust the path based on your project structure

// Define weights for scoring different criteria based on priority
const WEIGHTS = {
    // High Priority
    skillMatchPercentage: 50, // Base points for skill match percentage (0-100)
    topCompanyMatch: 10,      // Points for meeting the top company flag requirement
    topInstituteMatch: 10,    // Points for meeting the top institute flag requirement

    // Medium Priority
    consultingBackgroundMatch: 8, // Points for meeting the consulting background flag
    specificCompanyMatch: 5,    // Points per specific required company found in work experience
    specificInstituteMatch: 5,  // Points per specific required institute found in education

    // Low Priority
    locationMatch: 3,        // Points for location match
};

// Define the minimum skill match percentage required to be considered (Hard Filter)
const MIN_SKILL_MATCH_PERCENTAGE = 50; // 50%

/**
 * Filters and ranks candidates based on job description criteria and relevant skills.
 * Fetches candidates from the database, applies hard filters,
 * calculates a weighted score for remaining candidates, and sorts them.
 *
 * @param {object} filters - Structured filtering criteria extracted from JD.
 * @param {number | null} filters.minimumYearsExperience - Minimum years of experience.
 * @param {boolean} filters.isTopCompaniesRequired - Whether top companies are required (Boolean flag).
 * @param {boolean} filters.isTopInstitutesRequired - Whether top institutes are required (Boolean flag).
 * @param {boolean} filters.requiresConsultingBackground - Whether consulting background is required (Boolean flag).
 * @param {string | null} filters.requiredLocation - Required location.
 * @param {string[]} filters.requiredCompanies - Array of specific required company names.
 * @param {string[]} filters.requiredInstitutes - Array of specific required institute names.
 * @param {string[]} relevantSkills - Array of skills relevant to the JD (from semantic matching).
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of filtered and ranked candidate objects.
 */
const filterAndRankCandidates = async (filters, relevantSkills) => {
    try {
        console.log("Fetching all candidates from DB...");
        // Fetch all candidates. For 1000 candidates, fetching all and filtering in app is feasible.
        // For much larger datasets, consider pushing some filters to the DB query.
        const allCandidates = await ResumePool.find({}).lean(); // Use .lean() for plain JS objects

        console.log(`Fetched ${allCandidates.length} candidates. Applying filters and scoring...`);

        const candidatesWithScores = [];
        const requiredSkillsCount = relevantSkills ? relevantSkills.length : 0;

        for (const candidate of allCandidates) {
            let score = 0; // Initialize score for the current candidate

            // --- Apply Hard Filters ---
            // Candidates must meet ALL applicable hard filters to be considered for scoring.

            // 1. Minimum Experience (Hard Filter if specified in filters)
            if (filters.minimumYearsExperience !== null &&
                candidate.professionalDetails?.noOfYearsExperience !== undefined && // Check if field exists
                candidate.professionalDetails.noOfYearsExperience < filters.minimumYearsExperience
            ) {
                // console.log(`Skipping ${candidate.personalInformation?.name}: Failed min experience (${candidate.professionalDetails.noOfYearsExperience} < ${filters.minimumYearsExperience})`);
                continue; // Skip this candidate
            }

            // 2. Top Companies Required (Hard Filter IF the flag is true)
            if (filters.isTopCompaniesRequired === true &&
                (!candidate.topCompanies || candidate.topCompanies !== true) // Check if field exists and is exactly true
            ) {
                 // console.log(`Skipping ${candidate.personalInformation?.name}: Top companies required but candidate.topCompanies is ${candidate.topCompanies}`);
                 continue; // Skip candidate
            }

            // 3. Top Institutes Required (Hard Filter IF the flag is true)
             if (filters.isTopInstitutesRequired === true &&
                (!candidate.topInstitutes || candidate.topInstitutes !== true) // Check if field exists and is exactly true
             ) {
                 // console.log(`Skipping ${candidate.personalInformation?.name}: Top institutes required but candidate.topInstitutes is ${candidate.topInstitutes}`);
                 continue; // Skip candidate
             }

            // 4. Consulting Background Required (Hard Filter IF the flag is true)
             if (filters.requiresConsultingBackground === true &&
                 (!candidate.professionalDetails || candidate.professionalDetails.hasConsultingBackground === undefined ||
                  candidate.professionalDetails.hasConsultingBackground !== true) // Check field existence and value
             ) {
                 // console.log(`Skipping ${candidate.personalInformation?.name}: Consulting background required but candidate.hasConsultingBackground is ${candidate.professionalDetails?.hasConsultingBackground}`);
                 continue; // Skip candidate
             }

            // 5. Skill Matching (Hard Filter if relevant skills were found AND candidate has skills)
            let skillMatchPercentage = 0;
            const candidateSkills = candidate.skills || []; // Use empty array if field is missing

            if (requiredSkillsCount > 0) { // Only apply skill filter if JD has relevant skills identified
                 if (candidateSkills.length > 0) {
                     const matchedSkills = candidateSkills.filter(skill =>
                         relevantSkills.includes(skill) // Case-sensitive skill string match
                         // TODO: Consider case-insensitive skill match if needed
                     );
                      skillMatchPercentage = (matchedSkills.length / requiredSkillsCount) * 100;

                    //   if (skillMatchPercentage < MIN_SKILL_MATCH_PERCENTAGE) {
                    //       // console.log(`Skipping ${candidate.personalInformation?.name}: Skill match percentage (${skillMatchPercentage.toFixed(2)}%) below ${MIN_SKILL_MATCH_PERCENTAGE}% threshold`);
                    //       continue; // Skip candidate if less than 50% skill match
                    //   }
                 } else {
                      // JD requires skills, but candidate has none
                      // console.log(`Skipping ${candidate.personalInformation?.name}: JD requires skills (${requiredSkillsCount}), but candidate has no skills listed`);
                      continue;
                 }
            }
            // If requiredSkillsCount is 0, this filter is skipped, and all candidates pass this part.


            // --- If passed all hard filters, calculate score based on all criteria ---

            // Score for Skill Match Percentage (Significant weight)
            // Add the percentage match *after* checking it meets the minimum hard filter
            score += (skillMatchPercentage / 100) * WEIGHTS.skillMatchPercentage; // Normalize percentage to 0-1 before multiplying by weight


            // Score for Top Companies (Adds points if candidate has the flag, regardless of JD flag)
            // Your requirement was that if the JD specifies Top Companies as TRUE, it's a hard filter.
            // If the JD specifies it as FALSE, all candidates pass the filter, and those with topCompanies: true still get points for sorting.
            // So, points are added IF candidate.topCompanies is TRUE. The hard filter above handles the 'required=true' case.
            if (candidate.topCompanies === true) {
                 score += WEIGHTS.topCompanyMatch;
            }


            // Score for Top Institutes (Adds points if candidate has the flag, regardless of JD flag)
             if (candidate.topInstitutes === true) {
                score += WEIGHTS.topInstituteMatch;
            }


            // Score for Consulting Background (Adds points if candidate has the flag, regardless of JD flag)
             if (candidate.professionalDetails?.hasConsultingBackground === true) {
                 score += WEIGHTS.consultingBackgroundMatch;
             }


            // --- Specific Companies and Institutes (Pure Scoring, NO Hard Filter) ---
            // Candidates are NOT skipped if they don't have these. Points are added if they DO.

            // Score for Specific Companies (Points for *each* specific required company they have worked at)
            // This contributes to sorting: more matches = higher score.
            if (filters.requiredCompanies && filters.requiredCompanies.length > 0) {
                const candidateCompanies = candidate.companiesWorkedAt || [];
                const specificCompanyMatchesCount = filters.requiredCompanies.filter(requiredCompany =>
                    candidateCompanies.some(candCompany =>
                         candCompany && typeof candCompany === 'string' && candCompany.toLowerCase() === requiredCompany.toLowerCase() // Case-insensitive and null check
                    )
                ).length;
                // console.log(`Candidate ${candidate.personalInformation?.name} has ${specificCompanyMatchesCount} specific company matches.`);
                 score += specificCompanyMatchesCount * WEIGHTS.specificCompanyMatch;
            } else {
                // If the JD doesn't list specific companies, this criteria doesn't affect the score.
            }


             // Score for Specific Institutes (Points for *each* specific required institute they attended)
             // This contributes to sorting: more matches = higher score.
             if (filters.requiredInstitutes && filters.requiredInstitutes.length > 0) {
                 const candidateEducation = candidate.educationDetails || [];
                 const specificInstituteMatchesCount = filters.requiredInstitutes.filter(requiredInstitute =>
                     candidateEducation.some(edu =>
                         edu.instituteName && typeof edu.instituteName === 'string' && edu.instituteName.toLowerCase() === requiredInstitute.toLowerCase()
                     )
                 ).length;
                 // console.log(`Candidate ${candidate.personalInformation?.name} has ${specificInstituteMatchesCount} specific institute matches.`);
                  score += specificInstituteMatchesCount * WEIGHTS.specificInstituteMatch;
             } else {
                 // If the JD doesn't list specific institutes, this criteria doesn't affect the score.
             }


            // Score for Location Match (Lower priority)
             if (filters.requiredLocation !== null && candidate.personalInformation?.location) {
                 // Simple case-insensitive check for now. Could use fuzzier matching or check country/city separately.
                 if (candidate.personalInformation.location.toLowerCase() === filters.requiredLocation.toLowerCase()) {
                     score += WEIGHTS.locationMatch;
                 }
             }

            // Add candidate to qualifying list with their calculated score
             candidatesWithScores.push({ ...candidate, matchScore: score });

        } // End of candidate loop

        console.log(`Found ${candidatesWithScores.length} candidates after hard filtering and before sorting.`);

        // Sort qualifying candidates by score descending
        candidatesWithScores.sort((a, b) => b.matchScore - a.matchScore);

        // Remove the temporary matchScore field before returning
        const finalRecommendedCandidates = candidatesWithScores.map(candidate => {
            // Use object destructuring to omit matchScore cleanly
            const { matchScore, ...restOfCandidate } = candidate;
            return restOfCandidate;
        });

        return finalRecommendedCandidates;

    } catch (error) {
        console.error("Error filtering and ranking candidates:", error);
        // Re-throw the error so the calling route handler can catch it and send an appropriate response
        throw error;
    }
};

export default filterAndRankCandidates; // Export the function