import React from 'react';
import '../template/ashTemplate.css';

interface TemplateEngineProps {
  data: {
    name: string;
    contact: string;
    summary: string[];
    education: Array<{
      degree: string;
      school: string;
      details: string;
      gpa: string;
      period: string;
    }>;
    skills: Array<{
      category: string;
      items: string;
    }>;
    experience: Array<{
      company: string;
      location: string;
      title: string;
      period: string;
      bullets: string[];
    }>;
    projects?: Array<{
      name: string;
      tech: string;
      period: string;
      bullets: string[];
    }>;
  };
  zoom?: number;
  highlightKeywords?: (text: string) => string;
  isEditing?: boolean;
  onDataChange?: (data: any) => void;
}

export const TemplateEngine: React.FC<TemplateEngineProps> = ({
  data,
  zoom = 100,
  highlightKeywords = (text) => text,
  isEditing = false,
  onDataChange
}) => {
  // Helper function to strip HTML tags for editing
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleChange = (field: string, value: any) => {
    if (onDataChange) {
      onDataChange({ ...data, [field]: value });
    }
  };

  const handleArrayChange = (field: string, index: number, value: any) => {
    if (onDataChange) {
      const newArray = [...(data[field as keyof typeof data] as any[])];
      newArray[index] = value;
      onDataChange({ ...data, [field]: newArray });
    }
  };

  const handleBulletChange = (section: 'experience' | 'projects', itemIndex: number, bulletIndex: number, value: string) => {
    if (onDataChange) {
      const newSection = [...data[section]];
      newSection[itemIndex].bullets[bulletIndex] = value;
      onDataChange({ ...data, [section]: newSection });
    }
  };
  return (
    <div
      className="ash-template bg-white rounded-lg shadow-2xl"
      style={{
        transform: zoom !== 100 ? `scale(${zoom / 100})` : 'none',
        transformOrigin: 'top center',
        transition: 'transform 0.3s ease',
        width: zoom === 100 ? '100%' : '8.5in',
        maxWidth: zoom === 100 ? '100%' : '8.5in',
      }}
    >
      {/* Header */}
      <div className="ash-header">
        <h1 className="ash-name">
          {isEditing ? (
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none text-center"
            />
          ) : (
            data.name
          )}
        </h1>
      </div>

      <div className="ash-contact">
        {isEditing ? (
          <input
            type="text"
            value={data.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
            className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none text-center"
          />
        ) : (
          data.contact
        )}
      </div>

      {/* Summary Section */}
      {data.summary && data.summary.length > 0 && (
        <div className="ash-section">
          <h2 className="ash-section-header">SUMMARY</h2>
          <div className="ash-section-content">
            {data.summary.map((line, idx) => (
              isEditing ? (
                <textarea
                  key={idx}
                  value={stripHtml(line)}
                  onChange={(e) => {
                    const newSummary = [...data.summary];
                    newSummary[idx] = e.target.value;
                    handleChange('summary', newSummary);
                  }}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
                  rows={2}
                  style={{ margin: 0 }}
                />
              ) : (
                <p
                  key={idx}
                  className="ash-justify"
                  style={{ margin: 0 }}
                  dangerouslySetInnerHTML={{
                    __html: highlightKeywords(line),
                  }}
                />
              )
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      <div className="ash-section">
        <h2 className="ash-section-header">EDUCATION</h2>
        {data.education.map((edu, idx) => (
          <div key={idx} className="ash-education-item" style={{ clear: 'both' }}>
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={edu.period}
                  onChange={(e) => {
                    const newEdu = [...data.education];
                    newEdu[idx].period = e.target.value;
                    handleChange('education', newEdu);
                  }}
                  className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                  style={{ float: 'right', width: '30%', textAlign: 'right', fontWeight: 700, fontSize: '9pt' }}
                />
                <div style={{ width: '65%', display: 'inline-block' }}>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[idx].degree = e.target.value;
                      handleChange('education', newEdu);
                    }}
                    className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    style={{ width: '30%', marginRight: '5px' }}
                  />
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[idx].school = e.target.value;
                      handleChange('education', newEdu);
                    }}
                    className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    style={{ width: '30%', marginRight: '5px' }}
                  />
                  <input
                    type="text"
                    value={edu.details}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[idx].details = e.target.value;
                      handleChange('education', newEdu);
                    }}
                    className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    style={{ width: '20%', marginRight: '5px' }}
                  />
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => {
                      const newEdu = [...data.education];
                      newEdu[idx].gpa = e.target.value;
                      handleChange('education', newEdu);
                    }}
                    className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    style={{ width: '15%' }}
                  />
                </div>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 400 }}>
                  {edu.degree}   | {edu.school} – {edu.details}      {edu.gpa}
                </span>
                <span className="ash-education-date">{edu.period}   </span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <div className="ash-section">
        <h2 className="ash-section-header">SKILLS</h2>
        {data.skills.map((skill, idx) => (
          <div key={idx} className="ash-skill-item">
            <span className="ash-skill-category">{skill.category}: </span>
            {isEditing ? (
              <input
                type="text"
                value={stripHtml(skill.items)}
                onChange={(e) => {
                  const newSkills = [...data.skills];
                  newSkills[idx].items = e.target.value;
                  handleChange('skills', newSkills);
                }}
                className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none flex-1"
                style={{ display: 'inline-block', width: 'calc(100% - 120px)' }}
              />
            ) : (
              <span
                dangerouslySetInnerHTML={{
                  __html: highlightKeywords(skill.items),
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Work Experience Section */}
      <div className="ash-section">
        <h2 className="ash-section-header">WORK EXPERIENCE</h2>
        {data.experience.map((exp, idx) => (
          <div key={idx} className="ash-experience-item">
            <div className="ash-company-line">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[idx].location = e.target.value;
                      handleChange('experience', newExp);
                    }}
                    className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    style={{ float: 'right', width: '40%', textAlign: 'right', fontWeight: 700, fontSize: '9pt' }}
                  />
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[idx].company = e.target.value;
                      handleChange('experience', newExp);
                    }}
                    className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    style={{ width: '55%', fontWeight: 700, fontVariant: 'small-caps', letterSpacing: '0.05em' }}
                  />
                </>
              ) : (
                <>
                  <span className="ash-company-name">{exp.company}</span>
                  <span className="ash-location">{exp.location}</span>
                </>
              )}
            </div>
            <div className="ash-title-line">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[idx].period = e.target.value;
                      handleChange('experience', newExp);
                    }}
                    className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    style={{ float: 'right', width: '40%', textAlign: 'right', fontWeight: 700, fontSize: '9pt' }}
                  />
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => {
                      const newExp = [...data.experience];
                      newExp[idx].title = e.target.value;
                      handleChange('experience', newExp);
                    }}
                    className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    style={{ width: '55%', fontWeight: 700, fontStyle: 'italic' }}
                  />
                </>
              ) : (
                <>
                  <span className="ash-title">{exp.title}</span>
                  <span className="ash-period">{exp.period}</span>
                </>
              )}
            </div>
            <ul className="ash-bullets">
              {exp.bullets.map((bullet, bidx) => (
                <li key={bidx} className="ash-bullet">
                  {isEditing ? (
                    <textarea
                      value={stripHtml(bullet)}
                      onChange={(e) => handleBulletChange('experience', idx, bidx, e.target.value)}
                      className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
                      rows={2}
                    />
                  ) : (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightKeywords(bullet),
                      }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Projects Section (optional) */}
      {data.projects && data.projects.length > 0 && (
        <div className="ash-section">
          <h2 className="ash-section-header">PROJECTS</h2>
          {data.projects.map((proj, idx) => (
            <div key={idx} className="ash-experience-item">
              <div className="ash-company-line">
                {isEditing ? (
                  <>
                    {proj.period && (
                      <input
                        type="text"
                        value={proj.period}
                        onChange={(e) => {
                          const newProjects = [...(data.projects || [])];
                          newProjects[idx].period = e.target.value;
                          handleChange('projects', newProjects);
                        }}
                        className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                        style={{ float: 'right', width: '40%', textAlign: 'right', fontWeight: 700, fontSize: '9pt' }}
                      />
                    )}
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => {
                        const newProjects = [...(data.projects || [])];
                        newProjects[idx].name = e.target.value;
                        handleChange('projects', newProjects);
                      }}
                      className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                      style={{ width: '55%', fontWeight: 700, fontSize: '9pt' }}
                    />
                  </>
                ) : (
                  <>
                    <span className="ash-project-name">{proj.name}</span>
                    {proj.period && <span className="ash-period">{proj.period}</span>}
                  </>
                )}
              </div>
              {proj.tech && (
                <div className="ash-title-line">
                  <span className="ash-project-tech">
                    {isEditing ? (
                      <input
                        type="text"
                        value={proj.tech}
                        onChange={(e) => {
                          const newProjects = [...(data.projects || [])];
                          newProjects[idx].tech = e.target.value;
                          handleChange('projects', newProjects);
                        }}
                        className="bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                        style={{ width: '90%' }}
                      />
                    ) : (
                      proj.tech
                    )}
                  </span>
                </div>
              )}
              <ul className="ash-bullets">
                {proj.bullets.map((bullet, bidx) => (
                  <li key={bidx} className="ash-bullet">
                    {isEditing ? (
                      <textarea
                        value={stripHtml(bullet)}
                        onChange={(e) => handleBulletChange('projects', idx, bidx, e.target.value)}
                        className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
                        rows={2}
                      />
                    ) : (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightKeywords(bullet),
                        }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
