
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';

interface ProjectData {
  project: string;
  count: number;
  similarity: number;
}

interface ProjectsComparisonChartProps {
  data: ProjectData[];
}

export const ProjectsComparisonChart = ({ data }: ProjectsComparisonChartProps) => {
  const getSimilarityBadge = (similarity: number) => {
    if (similarity >= 80) return <Badge variant="destructive">High Similarity</Badge>;
    if (similarity >= 60) return <Badge className="bg-orange-500">Moderate</Badge>;
    return <Badge variant="secondary">Low Similarity</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="project" 
              angle={-45}
              textAnchor="end"
              height={80}
              className="text-xs"
            />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => [
                name === 'count' ? `${value} resumes` : `${value}% similarity`,
                name === 'count' ? 'Found in' : 'Similarity'
              ]}
            />
            <Bar 
              dataKey="count" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold">Duplicate Analysis</h4>
        {data.map((project, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h5 className="font-medium">{project.project}</h5>
              <p className="text-sm text-muted-foreground">
                Found in {project.count} resume{project.count !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{project.similarity}%</span>
              {getSimilarityBadge(project.similarity)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
