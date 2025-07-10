
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, FileText, BarChart3, Users, Zap, Shield, Download, Star } from "lucide-react";
import { useTheme } from "next-themes";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'student' | 'hr' | null>(null);

  const features = [
    {
      icon: FileText,
      title: "Smart Resume Parsing",
      description: "Extract skills, projects, education, and experience from PDF/DOCX files with high accuracy"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Visualize common skills, project overlap, and resume quality metrics with interactive charts"
    },
    {
      icon: Shield,
      title: "Duplicate Detection",
      description: "Identify copied content and similar projects across multiple resumes"
    },
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description: "Get personalized improvement suggestions and skill gap analysis"
    },
    {
      icon: Users,
      title: "Dual Mode Interface",
      description: "Student mode for improvement tips, HR mode for candidate filtering"
    },
    {
      icon: Download,
      title: "Export Reports",
      description: "Generate comprehensive PDF/CSV reports for detailed analysis"
    }
  ];

  const stats = [
    { number: "10K+", label: "Resumes Analyzed" },
    { number: "95%", label: "Parsing Accuracy" },
    { number: "50+", label: "Skills Tracked" },
    { number: "24/7", label: "AI Assistant" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Resume Analyzer Pro
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            🚀 AI-Powered Resume Analysis
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Analyze, Compare, and Perfect Your Resume
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Upload multiple resumes and get instant AI-powered insights, skill gap analysis, 
            duplicate detection, and personalized improvement suggestions.
          </p>
          
          {/* User Type Selection */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                userType === 'student' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' : ''
              }`}
              onClick={() => setUserType('student')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Student Mode</h3>
                <p className="text-sm text-muted-foreground">Resume improvement tips and career guidance</p>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                userType === 'hr' ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-950' : ''
              }`}
              onClick={() => setUserType('hr')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">HR Mode</h3>
                <p className="text-sm text-muted-foreground">Candidate filtering and batch analysis</p>
              </CardContent>
            </Card>
          </div>

          <Button 
            size="lg" 
            onClick={() => navigate('/dashboard')} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
            disabled={!userType}
          >
            {userType ? `Start ${userType === 'student' ? 'Learning' : 'Analyzing'}` : 'Select Mode First'}
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground text-lg">Everything you need for comprehensive resume analysis</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Analyze Your Resume?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of professionals who've improved their careers</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3"
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Resume Analyzer Pro</span>
          </div>
          <p className="text-slate-400">© 2024 Resume Analyzer Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
