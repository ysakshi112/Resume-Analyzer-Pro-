
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SkillData {
  skill: string;
  count: number;
  category: string;
}

interface SkillsChartProps {
  data: SkillData[];
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export const SkillsChart = ({ data }: SkillsChartProps) => {
  return (
    <div className="space-y-6">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="skill" 
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
            />
            <Bar 
              dataKey="count" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2">Skills by Category</h4>
          <div className="space-y-2">
            {Array.from(new Set(data.map(d => d.category))).map((category, index) => (
              <div key={category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{category}</span>
                </div>
                <span className="font-medium">
                  {data.filter(d => d.category === category).reduce((sum, d) => sum + d.count, 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2">Top Skills</h4>
          <div className="space-y-2">
            {data.slice(0, 3).map((skill, index) => (
              <div key={skill.skill} className="flex items-center justify-between text-sm">
                <span>{skill.skill}</span>
                <span className="font-medium">{skill.count} resumes</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
