import mammoth from 'mammoth';

export const parseDocx = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;

    return parseTextContent(text);
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
};

const parseTextContent = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  const data = {
    name: '',
    contact: '',
    summary: [],
    education: [],
    skills: [],
    experience: [],
    projects: []
  };

  let currentSection = null;
  let currentItem = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();

    // Detect name (usually first line, all caps or title case)
    if (i === 0 && !data.name) {
      data.name = line;
      continue;
    }

    // Detect contact (has email or phone)
    if (i <= 2 && (line.includes('@') || line.match(/\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/))) {
      data.contact = line;
      continue;
    }

    // Detect sections
    if (upperLine.includes('SUMMARY') || upperLine.includes('PROFILE') || upperLine.includes('OBJECTIVE')) {
      currentSection = 'summary';
      currentItem = null;
      continue;
    } else if (upperLine.includes('EDUCATION') || upperLine.includes('ACADEMIC')) {
      currentSection = 'education';
      currentItem = null;
      continue;
    } else if (upperLine.includes('SKILL') || upperLine.includes('COMPETENC')) {
      currentSection = 'skills';
      currentItem = null;
      continue;
    } else if (upperLine.includes('EXPERIENCE') || upperLine.includes('EMPLOYMENT') || upperLine.includes('WORK HISTORY')) {
      currentSection = 'experience';
      currentItem = null;
      continue;
    } else if (upperLine.includes('PROJECT')) {
      currentSection = 'projects';
      currentItem = null;
      continue;
    }

    // Parse content based on current section
    if (currentSection === 'summary') {
      data.summary.push(line);
    } else if (currentSection === 'education') {
      // Try to detect education entry
      if (line.includes('University') || line.includes('College') || line.includes('Institute') ||
          line.match(/B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|Ph\.?D\.?|Bachelor|Master|MEng|BTech/i)) {
        const eduItem = parseEducationLine(line);
        if (eduItem) {
          data.education.push(eduItem);
        }
      }
    } else if (currentSection === 'skills') {
      // Parse skills - look for category: items format
      if (line.includes(':')) {
        const [category, items] = line.split(':').map(s => s.trim());
        data.skills.push({ category, items });
      } else {
        // Single line skills
        data.skills.push({ category: 'Skills', items: line });
      }
    } else if (currentSection === 'experience') {
      // Detect company/role
      if (line.match(/^\d{2}\/\d{4}|^\d{4}/) || line.includes('Present') || line.includes('Current')) {
        // This is likely a date line
        if (currentItem) {
          currentItem.period = line;
        }
      } else if (!line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
        // New job entry
        if (currentItem) {
          data.experience.push(currentItem);
        }
        currentItem = {
          company: line,
          location: '',
          title: '',
          period: '',
          bullets: []
        };
      } else {
        // Bullet point
        if (currentItem) {
          const bullet = line.replace(/^[•\-*]\s*/, '');
          currentItem.bullets.push(bullet);
        }
      }
    } else if (currentSection === 'projects') {
      if (!line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
        if (currentItem) {
          data.projects.push(currentItem);
        }
        currentItem = {
          name: line,
          tech: '',
          period: '',
          bullets: []
        };
      } else {
        if (currentItem) {
          const bullet = line.replace(/^[•\-*]\s*/, '');
          currentItem.bullets.push(bullet);
        }
      }
    }
  }

  // Add last item
  if (currentSection === 'experience' && currentItem) {
    data.experience.push(currentItem);
  }
  if (currentSection === 'projects' && currentItem) {
    data.projects.push(currentItem);
  }

  return data;
};

const parseEducationLine = (line) => {
  // Try to extract: Degree | School - Details, GPA, Dates
  const degreeMatch = line.match(/([^|]+)/);
  const degree = degreeMatch ? degreeMatch[1].trim() : line;

  return {
    degree,
    school: '',
    details: '',
    gpa: '',
    period: ''
  };
};
