import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Clock, CheckCircle, AlertCircle, MoreVertical, ArrowRight, ArrowLeft } from 'lucide-react';
import { createTask, updateTask } from '@/store/slices/taskSlice';
import type { Task } from '@/store/slices/taskSlice';
import { useAppDispatch } from '@/store/hooks';

interface TaskListProps {
  projectId: string;
  tasks: Task[];
}

export function TaskList({ projectId, tasks }: TaskListProps) {
  const dispatch = useAppDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    status: 'to-do' as Task['status']
  });

  const handleCreateTask = async () => {
    if (newTask.title.trim()) {
      await dispatch(createTask({ ...newTask, project: projectId }));
      setNewTask({ title: '', description: '', priority: 'medium', status: 'to-do' });
      setIsDialogOpen(false);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task['status']) => {
    await dispatch(updateTask({
      id: task._id,
      updates: { status: newStatus }
    }));
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'border-l-green-500 bg-green-50';
      case 'in-progress':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const getNextStatus = (currentStatus: Task['status']): Task['status'] | null => {
    switch (currentStatus) {
      case 'to-do':
        return 'in-progress';
      case 'in-progress':
        return 'done';
      default:
        return null;
    }
  };

  const getPrevStatus = (currentStatus: Task['status']): Task['status'] | null => {
    switch (currentStatus) {
      case 'done':
        return 'in-progress';
      case 'in-progress':
        return 'to-do';
      default:
        return null;
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'to-do':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  const groupedTasks = {
    'to-do': tasks.filter(task => task.status === 'to-do'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    'done': tasks.filter(task => task.status === 'done')
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3B82F6] hover:bg-[#2563EB]">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value: Task['priority']) => setNewTask({ ...newTask, priority: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newTask.status} onValueChange={(value: Task['status']) => setNewTask({ ...newTask, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-do">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask} className="bg-[#3B82F6] hover:bg-[#2563EB]">
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <Card key={status} className="bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700 uppercase tracking-wide flex items-center gap-2">
                {getStatusIcon(status)}
                {getStatusLabel(status as Task['status'])} ({statusTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {statusTasks.map((task) => (
                <Card key={task._id} className={`border-l-4 transition-all duration-200 hover:shadow-md ${getStatusColor(task.status)}`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className={`font-medium text-sm ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {getPrevStatus(task.status) && (
                                <DropdownMenuItem onClick={() => handleStatusChange(task, getPrevStatus(task.status)!)}>
                                  <ArrowLeft className="w-3 h-3 mr-2" />
                                  Move to {getStatusLabel(getPrevStatus(task.status)!)}
                                </DropdownMenuItem>
                              )}
                              {getNextStatus(task.status) && (
                                <DropdownMenuItem onClick={() => handleStatusChange(task, getNextStatus(task.status)!)}>
                                  <ArrowRight className="w-3 h-3 mr-2" />
                                  Move to {getStatusLabel(getNextStatus(task.status)!)}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {task.description && (
                        <p className={`text-xs text-gray-600 ${task.status === 'done' ? 'line-through' : ''}`}>
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPrevStatus(task.status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleStatusChange(task, getPrevStatus(task.status)!)}
                            >
                              <ArrowLeft className="w-3 h-3 mr-1" />
                              {getStatusLabel(getPrevStatus(task.status)!)}
                            </Button>
                          )}
                          {getNextStatus(task.status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                              onClick={() => handleStatusChange(task, getNextStatus(task.status)!)}
                            >
                              {getStatusLabel(getNextStatus(task.status)!)}
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {statusTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tasks in this column</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
