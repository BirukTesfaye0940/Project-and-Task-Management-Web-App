import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, AlertCircle, User, Edit, Trash2 } from 'lucide-react';
import type { Task } from '@/store/slices/taskSlice';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onViewDetails: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'done':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'to-do':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onViewDetails, onEdit, onDelete }) => {
  const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'done';

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => onViewDetails(task)}>
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {task.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0" onClick={() => onViewDetails(task)}>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={cn('text-xs', getStatusColor(task.status))}>
            {task.status.replace('-', ' ')}
          </Badge>
          <Badge className={cn('text-xs', getPriorityColor(task.priority))}>
            <AlertCircle className="h-3 w-3 mr-1" />
            {task.priority}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className={cn(isOverdue && 'text-red-600 font-medium')}>
                {formatDate(task.deadline)}
              </span>
              {isOverdue && <span className="text-red-600">(Overdue)</span>}
            </div>
            
            {task.assignedTo && task.assignedTo.length > 0 && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{task.assignedTo.length} assigned</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;