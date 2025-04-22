// utils/jobMatchCalculator.js
const calculateJobMatch = (user, job) => {
    const matchDetails = {};
    let totalScore = 0;
    let totalPossible = 0;
  
    // 1. Skills Match (35% weight)
    if (user.skills?.length && job.skills?.length) {
      const userSkills = new Set(user.skills.map(s => s.toLowerCase()));
      const jobSkills = new Set(job.skills.map(s => s.toLowerCase()));
      const intersection = new Set([...userSkills].filter(s => jobSkills.has(s)));
      
      const score = (intersection.size / jobSkills.size) * 35;
      matchDetails.skills = {
        match: [...intersection],
        score: Math.round(score),
        maxScore: 35
      };
      totalScore += score;
      totalPossible += 35;
    }
  
    // 2. Location Match (25% weight)
    if (user.preferredLocations?.length && job.jobLocation) {
      const userLocations = user.preferredLocations.map(l => l.toLowerCase());
      const jobLocation = job.jobLocation.toLowerCase();
      const matched = userLocations.some(loc => 
        jobLocation.includes(loc) || loc.includes(jobLocation)
      );
      
      const score = matched ? 25 : 0;
      matchDetails.location = {
        matched,
        score,
        maxScore: 25
      };
      totalScore += score;
      totalPossible += 25;
    }
  
    // 3. Work Type (15% weight)
    if (user.preferredWorkTypes?.length && job.workType) {
      const matched = user.preferredWorkTypes.includes(job.workType);
      const score = matched ? 15 : 0;
      matchDetails.workType = {
        matched,
        score,
        maxScore: 15
      };
      totalScore += score;
      totalPossible += 15;
    }
  
    // 4. Work Mode (15% weight)
    if (user.preferredWorkModes?.length && job.workMode) {
      const matched = user.preferredWorkModes.includes(job.workMode);
      const score = matched ? 15 : 0;
      matchDetails.workMode = {
        matched,
        score,
        maxScore: 15
      };
      totalScore += score;
      totalPossible += 15;
    }
  
    // 5. Salary (10% weight)
    if (user.expectedMinSalary && job.salary) {
      const userMin = Number(user.expectedMinSalary) * 100000;
      const jobSalary = Number(job.salary);
      const matched = !isNaN(userMin) && !isNaN(jobSalary) && jobSalary >= userMin;
      
      const score = matched ? 10 : 0;
      matchDetails.salary = {
        matched,
        score,
        maxScore: 10
      };
      totalScore += score;
      totalPossible += 10;
    }
  
    return {
      matchPercentage: totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0,
      matchDetails
    };
  };
  
export default calculateJobMatch;