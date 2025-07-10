
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Resume {
  id: string;
  name: string;
  score: number;
}

interface ResumeScoreChartProps {
  resumes: Resume[];
}

export const ResumeScoreChart = ({ resumes }: ResumeScoreChartProps) => {
  const chartData = resumes.map(resume => ({
    name: resume.name.length > 15 ? resume.name.substring(0, 15) + '...' : resume.name,
    score: resume.score
  }));

  const getBarColor = (score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div className="space-y-4">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              className="text-xs"
            />
            <YAxis 
              domain={[0, 100]}
              className="text-xs"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [`${value}/100`, 'Score']}
            />
            <Bar 
              dataKey="score" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-500">
            {resumes.filter(r => r.score >= 80).length}
          </div>
          <div className="text-sm text-muted-foreground">Excellent (80+)</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-500">
            {resumes.filter(r => r.score >= 60 && r.score < 80).length}
          </div>
          <div className="text-sm text-muted-foreground">Good (60-79)</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-500">
            {resumes.filter(r => r.score < 60).length}
          </div>
          <div className="text-sm text-muted-foreground">Needs Work (&lt;60)</div>
        </div>
      </div>
    </div>
  );
};
