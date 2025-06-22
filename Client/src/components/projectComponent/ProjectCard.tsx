import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarDays, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { Project } from '../../store/slices/projectsSlice';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const completedTasks = project.tasks?.filter(task => task.status === 'done').length;
  const totalTasks = project.tasks?.length;
  const progressPercentage = totalTasks && totalTasks > 0 ? completedTasks &&(completedTasks / totalTasks) * 100 : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'on-hold':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg group-hover:text-[#3B82F6] transition-colors">
              {project.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`ml-2 flex items-center gap-1 ${getStatusColor(project.status)}`}
          >
            {getStatusIcon(project.status)}
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{completedTasks}/{totalTasks} tasks</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays className="w-4 h-4" />
            <span>Due {format(new Date(project.endDate), 'MMM dd')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{project.team.length} members</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member) => (
              <Avatar key={member._id} className="w-6 h-6 border-2 border-white">
                <AvatarFallback className="text-xs bg-[#3B82F6] text-white">
                  {typeof member.user === 'object' 
                    ? member.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                    : 'U'
                  }
                </AvatarFallback>
              </Avatar>
            ))}
            {project.team.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-gray-600">+{project.team.length - 3}</span>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Updated {format(new Date(project.updatedAt), 'MMM dd')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}