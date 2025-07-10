
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, AlertCircle, Star, Download, Eye } from "lucide-react";

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
}

interface ResumeListProps {
  resumes: Resume[];
}

export const ResumeList = ({ resumes }: ResumeListProps) => {
  const getStatusIcon = (status: Resume['status']) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Resume['status']) => {
    switch (status) {
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-4">
      {resumes.map((resume) => (
        <Card key={resume.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-lg">{resume.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Uploaded {resume.uploadDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {resume.status === 'completed' && (
                  <div className="flex items-center space-x-6 flex-1">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(resume.score)}`}>
                        {resume.score}
                      </div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold">{resume.skills.length}</div>
                      <div className="text-xs text-muted-foreground">Skills</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold">{resume.projects.length}</div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold">{resume.experience}y</div>
                      <div className="text-xs text-muted-foreground">Experience</div>
                    </div>
                  </div>
                )}

                {resume.status === 'processing' && (
                  <div className="flex-1">
                    <Progress value={65} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">Analyzing resume content...</p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(resume.status)}
                  {getStatusBadge(resume.status)}
                </div>
                
                {resume.status === 'completed' && (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {resume.status === 'completed' && resume.skills.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Top Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {resume.skills.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{resume.skills.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
