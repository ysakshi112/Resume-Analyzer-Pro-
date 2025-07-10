
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  Users, 
  BarChart3, 
  PieChart, 
  Download,
  MessageSquare,
  Settings,
  Star,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { SkillsChart } from "@/components/SkillsChart";
import { ResumeScoreChart } from "@/components/ResumeScoreChart";
import { ProjectsComparisonChart } from "@/components/ProjectsComparisonChart";
import { ChatBot } from "@/components/ChatBot";
import { UploadZone } from "@/components/UploadZone";
import { ResumeList } from "@/components/ResumeList";
import { extractTextFromFile, parseResumeText, calculateResumeScore, ParsedResume } from "@/utils/resumeParser";

interface Resume {
  id: string;
  name: string;
  uploadDate: Date;
  score: number;
  status: 'processing' | 'completed' | 'error';
  skills: string[];
  projects: string[];
  experience: number;
  education: string;
  parsedData?: ParsedResume;
}

const Dashboard = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedTab, setSelectedTab] = useState("upload");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleFileUpload = async (files: File[]) => {
    const newResumes: Resume[] = files.map((file, index) => ({
      id: `resume-${Date.now()}-${index}`,
      name: file.name,
      uploadDate: new Date(),
      score: 0,
      status: 'processing' as const,
      skills: [],
      projects: [],
      experience: 0,
      education: ''
    }));

    setResumes(prev => [...prev, ...newResumes]);

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const resumeId = newResumes[i].id;

      try {
        // Extract text from file
        const text = await extractTextFromFile(file);
        
        // Parse the resume
        const parsedData = parseResumeText(text);
        
        // Calculate score with the actual resume text
        const score = calculateResumeScore(parsedData, text);

        console.log(`Processing resume ${file.name}:`, {
          skills: parsedData.skills.length,
          projects: parsedData.projects.length,
          experience: parsedData.experience,
          score: score,
          textLength: text.length
        });

        // Update the resume with parsed data
        setResumes(prev => prev.map(r => 
          r.id === resumeId ? {
            ...r,
            status: 'completed' as const,
            score,
            skills: parsedData.skills,
            projects: parsedData.projects.map(p => p.substring(0, 50)), // Truncate for display
            experience: parsedData.experience,
            education: parsedData.education,
            parsedData
          } : r
        ));
      } catch (error) {
        console.error('Error processing resume:', error);
        setResumes(prev => prev.map(r => 
          r.id === resumeId ? { ...r, status: 'error' as const } : r
        ));
      }
    }
  };

  const completedResumes = resumes.filter(r => r.status === 'completed');
  const averageScore = completedResumes.length > 0 
    ? Math.round(completedResumes.reduce((sum, r) => sum + r.score, 0) / completedResumes.length)
    : 0;

  // Generate skills data from actual resumes
  const skillsData = () => {
    const skillCounts: { [key: string]: number } = {};
    const skillCategories: { [key: string]: string } = {
      'JavaScript': 'Frontend',
      'TypeScript': 'Frontend', 
      'React': 'Frontend',
      'Vue': 'Frontend',
      'Angular': 'Frontend',
      'HTML': 'Frontend',
      'CSS': 'Frontend',
      'Node.js': 'Backend',
      'Python': 'Backend',
      'Java': 'Backend',
      'C++': 'Backend',
      'PHP': 'Backend',
      'MongoDB': 'Database',
      'PostgreSQL': 'Database',
      'MySQL': 'Database',
      'AWS': 'DevOps',
      'Docker': 'DevOps',
      'Kubernetes': 'DevOps'
    };

    completedResumes.forEach(resume => {
      resume.skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    return Object.entries(skillCounts)
      .map(([skill, count]) => ({
        skill,
        count,
        category: skillCategories[skill] || 'Other'
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  // Generate projects comparison data
  const projectsData = () => {
    const projectCounts: { [key: string]: { count: number; resumes: string[] } } = {};

    completedResumes.forEach(resume => {
      resume.projects.forEach(project => {
        const key = project.toLowerCase();
        if (!projectCounts[key]) {
          projectCounts[key] = { count: 0, resumes: [] };
        }
        projectCounts[key].count++;
        projectCounts[key].resumes.push(resume.name);
      });
    });

    return Object.entries(projectCounts)
      .filter(([_, data]) => data.count > 1) // Only show duplicates
      .map(([project, data]) => ({
        project: project.charAt(0).toUpperCase() + project.slice(1),
        count: data.count,
        similarity: data.count > 3 ? 90 : data.count > 2 ? 75 : 60
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const uniqueSkills = new Set(completedResumes.flatMap(r => r.skills)).size;
  const duplicateProjects = projectsData().length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Resume Analyzer</span>
              </div>
              <Badge variant="secondary">
                {resumes.length} Resume{resumes.length !== 1 ? 's' : ''} Uploaded
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Resumes</p>
                  <p className="text-2xl font-bold">{resumes.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{averageScore}/100</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unique Skills</p>
                  <p className="text-2xl font-bold">{uniqueSkills}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duplicates Found</p>
                  <p className="text-2xl font-bold">{duplicateProjects}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="skills">Skills Gap</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Resumes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UploadZone onFilesUpload={handleFileUpload} />
              </CardContent>
            </Card>

            {resumes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Uploaded Resumes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResumeList resumes={resumes} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {completedResumes.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SkillsChart data={skillsData()} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Resume Scores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResumeScoreChart resumes={completedResumes} />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProjectsComparisonChart data={projectsData()} />
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
                  <p className="text-muted-foreground">Upload some resumes to see analytics</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Duplicate Detection</CardTitle>
              </CardHeader>
              <CardContent>
                {projectsData().length > 0 ? (
                  <div className="space-y-4">
                    {projectsData().map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{project.project}</h4>
                          <p className="text-sm text-muted-foreground">
                            Found in {project.count} resume{project.count !== 1 ? 's' : ''} with {project.similarity}% similarity
                          </p>
                        </div>
                        <Badge variant={project.similarity >= 80 ? "destructive" : project.similarity >= 60 ? "default" : "secondary"}>
                          {project.similarity >= 80 ? "High Similarity" : project.similarity >= 60 ? "Moderate" : "Low Similarity"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Duplicates Found</h3>
                    <p className="text-muted-foreground">All resumes appear to have unique content</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Gap Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-4">Frontend Developer Requirements</h4>
                    <div className="space-y-3">
                      {[
                        { skill: 'React.js', percentage: Math.round((completedResumes.filter(r => r.skills.includes('React')).length / Math.max(completedResumes.length, 1)) * 100) },
                        { skill: 'TypeScript', percentage: Math.round((completedResumes.filter(r => r.skills.includes('TypeScript')).length / Math.max(completedResumes.length, 1)) * 100) },
                        { skill: 'JavaScript', percentage: Math.round((completedResumes.filter(r => r.skills.includes('JavaScript')).length / Math.max(completedResumes.length, 1)) * 100) }
                      ].map(({ skill, percentage }) => (
                        <div key={skill} className="flex items-center justify-between">
                          <span>{skill}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={percentage} className="w-32" />
                            <span className="text-sm">{percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Generate Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="w-6 h-6" />
                    Export PDF Summary
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <BarChart3 className="w-6 h-6" />
                    Export CSV Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Bot */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Dashboard;
