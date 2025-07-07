import fs from "fs";
import Handlebars from "handlebars";
import path from "path";

// Register helpers (if needed)
Handlebars.registerHelper("join", function (array, separator = ", ") {
  return array?.join(separator) || "";
});

Handlebars.registerHelper("formatDateRange", function (startDate, endDate) {
  if (!startDate && !endDate) return "";
  return `${startDate || ""} - ${endDate || ""}`;
});

Handlebars.registerHelper("lowerCase", function (str) {
  return str?.toLowerCase() || "";
});

// Utility to generate HTML from template and data
export const generateResumeHTML = (resumeData) => {
  const templatePath = path.join(
    process.cwd(),
    "Resume-html",
    "resume-template.html"
  );

  const htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile(htmlTemplate);

  const renderedHTML = template(resumeData);
  return renderedHTML;
};
