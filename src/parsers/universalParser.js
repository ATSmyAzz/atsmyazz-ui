import { parseDocx } from './parseDocx';
import { parsePdf } from './parsePdf';

export const parseResume = async (file) => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileName.endsWith('.docx')) {
      return await parseDocx(file);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await parsePdf(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      const text = await file.text();
      return parseTextContent(text);
    } else {
      throw new Error('Unsupported file format. Please upload DOCX, PDF, or TXT file.');
    }
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
};

const parseTextContent = (text) => {
  // Basic text parsing logic
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  return {
    name: lines[0] || 'Unknown',
    contact: lines[1] || '',
    summary: [],
    education: [],
    skills: [],
    experience: [],
    projects: []
  };
};
