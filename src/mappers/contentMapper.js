import { normalizeDate, highlightMetrics, normalizeCompanyName, extractGPA, cleanBullet } from './sectionNormalizer';
import ashTemplate from '../template/ashTemplate.json';

/**
 * Maps parsed resume content to Ash template structure
 */
export const mapToAshTemplate = (parsedData) => {
  const mapped = {
    name: parsedData.name || 'YOUR NAME',
    contact: parsedData.contact || 'email@example.com | +1 (XXX) XXX-XXXX | City, State',
    summary: mapSummary(parsedData.summary),
    education: mapEducation(parsedData.education),
    skills: mapSkills(parsedData.skills),
    experience: mapExperience(parsedData.experience),
    projects: mapProjects(parsedData.projects)
  };

  return mapped;
};

const mapSummary = (summary) => {
  if (!summary || summary.length === 0) {
    return [
      'Professional summary highlighting your experience, specializations, and key achievements.',
      'Add 2-3 lines describing your expertise and what makes you a strong candidate.'
    ];
  }

  // Join summary lines if they're short, or keep as paragraphs
  const text = Array.isArray(summary) ? summary.join(' ') : summary;

  // Split into reasonable line lengths (around 120 chars per line)
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + word).length > 120) {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }

  return lines.slice(0, 3); // Max 3 lines for summary
};

const mapEducation = (education) => {
  if (!education || education.length === 0) {
    return [
      {
        degree: 'Degree in Field',
        school: 'University Name',
        details: 'Specialization or Relevant Coursework',
        gpa: 'GPA: X.X/4.0',
        period: 'MM/YYYY – MM/YYYY'
      }
    ];
  }

  return education.map(edu => {
    const gpa = edu.gpa || extractGPA(edu.degree + ' ' + edu.school + ' ' + edu.details);

    return {
      degree: edu.degree || 'Degree',
      school: edu.school || 'University',
      details: edu.details || 'Major',
      gpa: gpa || 'GPA: X.X/4.0',
      period: normalizeDate(edu.period) || 'MM/YYYY – MM/YYYY'
    };
  });
};

const mapSkills = (skills) => {
  if (!skills || skills.length === 0) {
    return [
      { category: 'Languages', items: 'Python, JavaScript, Java, C++' },
      { category: 'Frameworks', items: 'React, Node.js, Django, Flask' },
      { category: 'Tools', items: 'Git, Docker, AWS, CI/CD' }
    ];
  }

  // Ensure each skill has category and items
  return skills.map(skill => ({
    category: skill.category || 'Skills',
    items: skill.items || skill
  }));
};

const mapExperience = (experience) => {
  if (!experience || experience.length === 0) {
    return [
      {
        company: 'COMPANY NAME',
        location: 'City, State',
        title: 'Job Title',
        period: 'MM/YYYY – MM/YYYY',
        bullets: [
          'Achievement or responsibility with quantifiable impact using metrics',
          'Another key accomplishment highlighting skills and technologies used',
          'Third bullet demonstrating leadership, collaboration, or technical expertise'
        ]
      }
    ];
  }

  return experience.map(exp => {
    // Extract location from company name if present
    let company = exp.company || 'Company';
    let location = exp.location || '';

    if (company.includes('–') || company.includes('-')) {
      const parts = company.split(/[–-]/);
      company = parts[0].trim();
      location = parts[1]?.trim() || location;
    }

    return {
      company: normalizeCompanyName(company),
      location: location || 'Location',
      title: exp.title || exp.role || 'Position',
      period: normalizeDate(exp.period) || 'MM/YYYY – MM/YYYY',
      bullets: (exp.bullets || []).map(bullet => highlightMetrics(cleanBullet(bullet)))
    };
  });
};

const mapProjects = (projects) => {
  if (!projects || projects.length === 0) {
    return [];
  }

  return projects.map(proj => ({
    name: proj.name || 'Project Name',
    tech: proj.tech || '',
    period: normalizeDate(proj.period) || '',
    bullets: (proj.bullets || []).map(bullet => highlightMetrics(cleanBullet(bullet)))
  }));
};

/**
 * Validates mapped data against template requirements
 */
export const validateMappedData = (mappedData) => {
  const errors = [];

  if (!mappedData.name || mappedData.name === 'YOUR NAME') {
    errors.push('Name is required');
  }

  if (!mappedData.education || mappedData.education.length === 0) {
    errors.push('At least one education entry is required');
  }

  if (!mappedData.skills || mappedData.skills.length === 0) {
    errors.push('At least one skill category is required');
  }

  if (!mappedData.experience || mappedData.experience.length === 0) {
    errors.push('At least one work experience entry is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
