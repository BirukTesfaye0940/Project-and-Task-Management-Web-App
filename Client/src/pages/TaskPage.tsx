import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import TaskCard from '@/components/taskComponent/TaskCard';
import TaskDetailDialog from '@/components/taskComponent/TaskDetailDialog';
import CreateTaskDialog from '@/components/taskComponent/CreateTaskDialog';
import EditTaskDialog from '@/components/taskComponent/EditTaskDialog';
import TaskFilters from '@/components/taskComponent/TaskFilters';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  setStatusFilter,
  setPriorityFilter,
  resetFilters,
} from '@/store/slices/taskSlice';
import type { Task } from '@/store/slices/taskSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';

const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error, filters } = useAppSelector((state) => state.task);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(checkAuth())
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error('Error', {
        description: error,
      });
    }
  }, [error]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    return filtered;
  }, [tasks, searchQuery, filters]);

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setShowDetailDialog(true);
  };

  const handleCreateTask = async (data: Partial<Task>) => {
    try {
      await dispatch(createTask(data)).unwrap();
      setShowCreateDialog(false);
      toast.success('Success', {
        description: 'Task created successfully!',
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to create task',
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setShowEditDialog(true);
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await dispatch(updateTask({ id, updates })).unwrap();
      setShowEditDialog(false);
      setTaskToEdit(null);
      setShowDetailDialog(false);
      toast.success('Success', {
        description: 'Task updated successfully!',
      });
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to update task',
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await dispatch(deleteTask(taskToDelete)).unwrap();
        setShowDeleteDialog(false);
        setTaskToDelete(null);
        setShowDetailDialog(false);
        toast.success('Success', {
          description: 'Task deleted successfully!',
        });
      } catch (error) {
        toast.error('Error', {
          description: 'Failed to delete task',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ListTodo className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          </div>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <TaskFilters
                statusFilter={filters.status}
                priorityFilter={filters.priority}
                onStatusFilterChange={(status: string) => dispatch(setStatusFilter(status as "all" | "to-do" | "in-progress" | "done"))}
                onPriorityFilterChange={(priority: string) => dispatch(setPriorityFilter(priority as "all" | "low" | "medium" | "high"))}
                onResetFilters={() => dispatch(resetFilters())}
              />
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg border shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : filteredTasks.length > 0 ? (
            filteredTasks?.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onViewDetails={handleViewDetails}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <ListTodo className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filters.status !== 'all' || filters.priority !== 'all'
                  ? 'No tasks match your current filters.'
                  : 'Get started by creating your first task.'}
              </p>
              {!searchQuery && filters.status === 'all' && filters.priority === 'all' && (
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Task
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Dialogs */}
        <TaskDetailDialog
          task={selectedTask}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />

        <CreateTaskDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateTask}
          loading={loading}
        />

        <EditTaskDialog
          task={taskToEdit}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSubmit={handleUpdateTask}
          loading={loading}
        />

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default TasksPage;