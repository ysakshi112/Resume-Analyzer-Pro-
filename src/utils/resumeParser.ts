
export interface ParsedResume {
  skills: string[];
  projects: string[];
  experience: number;
  education: string;
  contactInfo: {
    email?: string;
    phone?: string;
    location?: string;
  };
  workExperience: string[];
  certifications: string[];
}

export const parseResumeText = (text: string): ParsedResume => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Common skill keywords to look for
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 
    'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'HTML', 'CSS', 'SASS', 'SCSS', 'Bootstrap', 'Tailwind', 'Material-UI',
    'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Oracle',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git',
    'Machine Learning', 'AI', 'Data Science', 'Analytics', 'Tableau', 'Power BI'
  ];

  // Extract skills
  const skills: string[] = [];
  const textLower = text.toLowerCase();
  skillKeywords.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  });

  // Extract projects (look for project-related keywords)
  const projects: string[] = [];
  lines.forEach(line => {
    const lineLower = line.toLowerCase();
    if ((lineLower.includes('project') || lineLower.includes('built') || lineLower.includes('developed')) 
        && line.length > 20 && line.length < 100) {
      projects.push(line);
    }
  });

  // Extract experience (look for years of experience)
  let experience = 0;
  const experienceMatch = text.match(/(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?(experience|exp)/i);
  if (experienceMatch) {
    experience = parseInt(experienceMatch[1]);
  }

  // Extract education
  let education = 'Not specified';
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college'];
  lines.forEach(line => {
    const lineLower = line.toLowerCase();
    if (educationKeywords.some(keyword => lineLower.includes(keyword))) {
      education = line;
    }
  });

  // Extract contact info
  const contactInfo: ParsedResume['contactInfo'] = {};
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) contactInfo.email = emailMatch[0];

  const phoneMatch = text.match(/[\+]?[1-9]?[\d\s\-\(\)]{10,}/);
  if (phoneMatch) contactInfo.phone = phoneMatch[0];

  // Extract work experience
  const workExperience: string[] = [];
  lines.forEach(line => {
    const lineLower = line.toLowerCase();
    if ((lineLower.includes('developer') || lineLower.includes('engineer') || 
         lineLower.includes('analyst') || lineLower.includes('manager')) 
        && line.length > 10 && line.length < 80) {
      workExperience.push(line);
    }
  });

  return {
    skills: [...new Set(skills)], // Remove duplicates
    projects: projects.slice(0, 5), // Limit to 5 projects
    experience,
    education,
    contactInfo,
    workExperience: workExperience.slice(0, 3), // Limit to 3 work experiences
    certifications: [] // Can be extended later
  };
};

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        resolve(result);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // For PDF files, we'll extract basic text (this is a simplified approach)
        // In a real app, you'd use a proper PDF parser
        resolve(result);
      } else {
        // For other file types, try to extract text
        resolve(result);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const calculateResumeScore = (parsedResume: ParsedResume, resumeText: string = ''): number => {
  let score = 0;
  
  // Skills score (0-30 points) - More skills = higher score
  const skillCount = parsedResume.skills.length;
  score += Math.min(skillCount * 2.5, 30);
  
  // Projects score (0-25 points) - Quality and quantity
  const projectCount = parsedResume.projects.length;
  score += Math.min(projectCount * 5, 25);
  
  // Experience score (0-20 points) - Years of experience
  score += Math.min(parsedResume.experience * 2.5, 20);
  
  // Education score (0-15 points)
  if (parsedResume.education !== 'Not specified') {
    const educationLower = parsedResume.education.toLowerCase();
    if (educationLower.includes('phd') || educationLower.includes('doctorate')) {
      score += 15;
    } else if (educationLower.includes('master')) {
      score += 12;
    } else if (educationLower.includes('bachelor')) {
      score += 10;
    } else {
      score += 7;
    }
  }
  
  // Contact info completeness (0-10 points)
  if (parsedResume.contactInfo.email) score += 5;
  if (parsedResume.contactInfo.phone) score += 5;
  
  // Content quality bonus based on text length and structure
  const textLength = resumeText.length;
  if (textLength > 2000) score += 5; // Well-detailed resume
  if (textLength > 1000) score += 3; // Good detail level
  
  // Work experience diversity bonus
  const workExpCount = parsedResume.workExperience.length;
  score += Math.min(workExpCount * 2, 8);
  
  // Add some randomization to make each resume unique (±5 points)
  const randomFactor = (Math.random() - 0.5) * 10;
  score += randomFactor;
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(Math.round(score), 100));
};
