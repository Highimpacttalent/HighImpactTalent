#!/usr/bin/env node
import mongoose from 'mongoose';
import Application from '../models/ApplicationModel.js';
import Jobs from '../models/jobsModel.js';
import Users from '../models/userModel.js';
import { scoreResumeAgainstJobKeywords } from './Reommend.js';
import dbConnection from '../dbConfig/dbConnection.js';
import { scoreResumeWithGemini } from './LLMRecommend.js';

async function main() {
  await dbConnection();

  const jobId = '6864d0e0d336f59dcf22ec56';

  const job = await Jobs.findById(jobId);
  if (!job) {
    console.error('Job not found:', jobId);
    process.exit(1);
  }

  const applications = await Application.find({ job: jobId });
  console.log(`Found ${applications.length} applications for job ${jobId}`);

  let count = 0;
  for (const app of applications) {
    const user = await Users.findById(app.applicant);
    if (!user) {
      console.warn(`Applicant not found for application ${app._id}`);
      continue;
    }

    console.log(`Processing application ${app._id} (applicant ${user._id})`);
    const result = await scoreResumeWithGemini(app.cvUrl, job, user);

    await Application.findByIdAndUpdate(app._id, {
  resumeMatchLevel: result.scoreLabel,
  matchPercentage: result.matchPercentage,
  matchBreakdown: result.breakdown,
});


    count++;
  }

  console.log(`✅ Updated ${count} applications`);
  await mongoose.disconnect();
}
main().catch(err => {
  console.error(err);
  process.exit(1);
});
