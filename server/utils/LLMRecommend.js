// utils/geminiResumeMatcher.js

import fetch from "node-fetch";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import axios from "axios";

const GEMINI_API_KEY = "AIzaSyCXj7iUCYWDQXPW3i6ky4Y24beLiINeDBw";


function createLLMJobSummary(job) {
  if (!job) return "";

  const {
    jobTitle,
    jobLocation,
    salary,
    workType,
    workMode,
    experience,
    jobDescription,
    qualifications,
    skills,
    screeningQuestions,
  } = job;

  const salaryStr = salary
    ? `a salary range of ₹${salary.minSalary}L to ₹${salary.maxSalary}L`
    : "a competitive salary";

  const expStr = experience
    ? `between ${experience.minExperience} to ${experience.maxExperience} years of experience`
    : "relevant experience";

  const qualificationStr = qualifications?.length
    ? `Candidates should hold at least a ${qualifications.join(", ")} degree.`
    : "";

  const skillsStr = skills?.length ? `Key skills include: ${skills.join(", ")}.` : "";

  const screeningQs = screeningQuestions?.length
    ? `Candidates will be asked screening questions during the application process.`
    : "";

  return `
We are hiring a "${jobTitle}" for our team in ${jobLocation}. This is a ${workType} role with ${workMode} setup, offering ${salaryStr}. We are looking for candidates with ${expStr}.

${qualificationStr}
${skillsStr}

Here’s a quick overview of the role:
${jobDescription?.trim() || ""}


${screeningQs}
`.trim();
}


export const scoreResumeWithGemini = async ( cvUrl, jobDescription, applicant ) => {
  console.log("🟡 Starting scoreResumeWithGemini");
  if (!jobDescription || !applicant || !cvUrl)
    throw new Error("Missing job description, applicant info, or cvUrl");
  
  console.log("📥 Fetching resume PDF from:", cvUrl);
  const response = await fetch(cvUrl);
  if (!response.ok){
    console.error("🔴 Failed to fetch PDF. Status:", response.status);
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }
  console.log("📦 Parsing PDF content...");
  const buffer = await response.arrayBuffer();
  const data = await pdfParse(buffer);
  const resumeText = data.text;

  if (!resumeText || resumeText.trim().length < 50) {
      console.warn("⚠️ Resume text seems too short or empty");
    } else {
      console.log("✅ Resume parsed successfully. Length:", resumeText.length);
    }

  const jobSummary = createLLMJobSummary(jobDescription);
  console.log("🚀 Sending prompt to Gemini...");

  const scoringRules = `
    Scoring Logic:
    1. Match percentage of JD content vs resume content (semantic similarity) * 35 = Experience score
    2. Match percentage of candidate skills vs job required skills * 25 = Skills score
    3. Salary comparison:
    - Current salary less than job salary = 20
    - Current salary equal to job salary = 10
    - Current salary greater than job salary = 0
    4. Location comparison:
    - Same city = 20
    - Different city but open to relocate = 10
    - Different and not open to relocate = 0
    `;

    const prompt = `You are a highly experienced technical recruiter and hiring analyst with deep expertise in role-specific candidate evaluation.

Your task is to **strictly and objectively evaluate** how well a candidate matches a job **only based on**:

1. The full Job Description (JD)
2. The candidate's full Resume text
3. Candidate metadata (experience, skills, salary, location, relocation preference)

---

🎯 **Core Evaluation Rule**

Do **not** reward candidates for general excellence, strong academic profiles, or achievements **unless** those strengths **directly align with the specific needs of the JD**.

If a JD is for an Operations Manager, and the candidate has an exceptional profile in Marketing or Branding — it should be **considered irrelevant**.

Match only what the JD *explicitly asks for*. This includes the right domain, required skills, functional experience, salary alignment, and location/relocation feasibility.

---

🔍 **Step 1: Categorize Fit**

Assign the candidate to one of these categories:

- ✅ **relevant**: The candidate meets **all required qualifications** for the role. They have strong and direct alignment across *experience, skills, salary, and location*. This means they are **a very solid match**, fully suitable to move forward.

- 🌟 **recommended**: The candidate goes **beyond** being just relevant — they are **exceptional** in the exact areas the JD prioritizes. They exceed expectations or show deep mastery in the role's domain. This label is **rare** and should only be given if the candidate is **truly the best possible match** with high confidence.

- ❌ **not_relevant**: The candidate is missing **one or more critical requirements** (wrong domain, lacks required experience or skills, mismatch in location/salary, or not open to relocation). Even if their profile is impressive in unrelated areas, mark them as *not_relevant*.

⚠️ Do **not** mark someone as *recommended* unless they are truly **exceptional** in the **specific job context**. Most solid fits should be marked as *relevant*.

---

📊 **Step 2: Provide a Score Breakdown**

Use the scoring rules strictly and justify every point. Score only what is clearly supported in the resume and metadata.

${scoringRules}

Avoid assumptions. Penalize unclear or vague profiles. Score conservatively.

---

📝 **Input Details**

🧾 Job Description:
"""
${jobSummary}
"""

📄 Candidate Resume:
"""
${resumeText.trim()}
"""

📌 Candidate Metadata:
- Experience: ${applicant.experience || "N/A"}
- Skills: ${Array.isArray(applicant.skills) ? applicant.skills.join(", ") : "N/A"}
- Current Salary: ${applicant.currentSalary || "N/A"}
- Current Location: ${applicant.currentLocation || "N/A"}
- Open to Relocate: ${applicant.openToRelocate || "N/A"}

---

✅ **Respond ONLY with a JSON object using this exact format (no extra text):**
{
  "scoreLabel": "relevant | recommended | not_relevant",
  "confidenceLevel": "high | medium | low",
  "matchPercentage": 0-100,
  "breakdown": {
    "experience": "x / 35",
    "skills": "y / 25",
    "salary": "z / 20",
    "location": "w / 20"
  }
}
`;

    console.log("🚀 Sending prompt to Gemini...");
    const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        { contents: [{ role: "user", parts: [{ text: prompt }] }] },
        { headers: { "Content-Type": "application/json" } }
    );

    console.log("📩 Received response from Gemini.");

    const raw =
        geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("📄 Raw response received:", raw.slice(0, 100));
    const jsonText = raw
        .replace(/^```json\s*/, "")
        .replace(/```$/, "")
        .trim();

    const parsed = JSON.parse(jsonText);
    console.log("✅ JSON parsed successfully:", parsed);

    return parsed;
    };
