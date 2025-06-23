import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  ArrowRight,
  ArrowLeft,
  Users,
} from "lucide-react";
import {
  createTask,
  updateTask,
  assignUsersToTask,
} from "@/store/slices/taskSlice";
import type { Task } from "@/store/slices/taskSlice";
import type { Project } from "@/store/slices/projectsSlice";
import { useAppDispatch } from "@/store/hooks";

interface TaskListProps {
  projectId: string;
  tasks: Task[];
  project?: Project;
}

export function TaskList({ projectId, tasks, project }: TaskListProps) {
  const dispatch = useAppDispatch();
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  console.log("All tasks in component:", tasks);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    status: "to-do" as Task["status"],
    assignedTo: [] as string[],
  });

  // Update local tasks when props change
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleCreateTask = async () => {
    if (newTask.title.trim()) {
      const taskData: Partial<Task> = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        project: projectId,
        // ✅ intentionally no assignedTo
      };

      const result = await dispatch(createTask(taskData));
      if (createTask.fulfilled.match(result)) {
        setLocalTasks((prev) => [...prev, result.payload]);
      }

      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        status: "to-do",
        assignedTo: [],
      });
      setIsDialogOpen(false);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task["status"]) => {
    // Update local state immediately for smooth transition
    setLocalTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, status: newStatus } : t))
    );

    // Update in backend
    await dispatch(
      updateTask({
        id: task._id,
        updates: { status: newStatus },
      })
    );
  };

  const handleAssignUsers = async (
    taskId: string,
    assignedUserIds: string[]
  ) => {
    // Update local state immediately
    setLocalTasks((prev) =>
      prev.map((t) => {
        if (t._id === taskId) {
          const assignedUsers = assignedUserIds
            .map((id) => {
              const teamMember = project?.team.find(
                (member) =>
                  typeof member.user === "object" && member.user._id === id
              );
              if (teamMember && typeof teamMember.user === "object") {
                return {
                  _id: teamMember.user._id,
                  fullName: teamMember.user.fullName,
                  email: teamMember.user.email,
                };
              }
              return null;
            })
            .filter(Boolean) as Task["assignedTo"];

          return { ...t, assignedTo: assignedUsers };
        }
        return t;
      })
    );

    // Update in backend
    await dispatch(
      assignUsersToTask({
        id: taskId,
        assignedTo: assignedUserIds,
      })
    );

    setAssignDialogOpen(false);
    setSelectedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "border-l-green-500 bg-green-50";
      case "in-progress":
        return "border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-gray-300 bg-white";
    }
  };

  const getNextStatus = (
    currentStatus: Task["status"]
  ): Task["status"] | null => {
    switch (currentStatus) {
      case "to-do":
        return "in-progress";
      case "in-progress":
        return "done";
      default:
        return null;
    }
  };

  const getPrevStatus = (
    currentStatus: Task["status"]
  ): Task["status"] | null => {
    switch (currentStatus) {
      case "done":
        return "in-progress";
      case "in-progress":
        return "to-do";
      default:
        return null;
    }
  };

  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "to-do":
        return "To Do";
      case "in-progress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  const groupedTasks = {
    "to-do": localTasks.filter((task) => task.status === "to-do"),
    "in-progress": localTasks.filter((task) => task.status === "in-progress"),
    done: localTasks.filter((task) => task.status === "done"),
  };
  console.log("grouped tasks",groupedTasks);
  

  const availableUsers =
    project?.team.filter((member) => typeof member.user === "object") || [];

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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  placeholder="Enter task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: Task["priority"]) =>
                      setNewTask({ ...newTask, priority: value })
                    }
                  >
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
                  <Select
                    value={newTask.status}
                    onValueChange={(value: Task["status"]) =>
                      setNewTask({ ...newTask, status: value })
                    }
                  >
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
              <div>
                <Label>Assign to Team Members</Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {availableUsers.map((member) => {
                    const user = member.user as {
                      _id: string;
                      fullName: string;
                      email: string;
                    };
                    return (
                      <div
                        key={user._id}
                        className="flex items-center space-x-3"
                      >
                        <Checkbox
                          id={`assign-${user._id}`}
                          checked={newTask.assignedTo.includes(user._id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewTask({
                                ...newTask,
                                assignedTo: [...newTask.assignedTo, user._id],
                              });
                            } else {
                              setNewTask({
                                ...newTask,
                                assignedTo: newTask.assignedTo.filter(
                                  (id) => id !== user._id
                                ),
                              });
                            }
                          }}
                        />
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-[#3B82F6] text-white text-xs">
                            {user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    );
                  })}
                  {availableUsers.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      No team members available
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTask}
                  className="bg-[#3B82F6] hover:bg-[#2563EB]"
                >
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Task: {selectedTask?.title}</DialogTitle>
          </DialogHeader>
          <AssignmentDialog
            task={selectedTask}
            availableUsers={availableUsers}
            onAssign={handleAssignUsers}
            onClose={() => {
              setAssignDialogOpen(false);
              setSelectedTask(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groupedTasks).map(([status, statusTasks]) => (
          <Card key={status} className="bg-gray-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700 uppercase tracking-wide flex items-center gap-2">
                {getStatusIcon(status)}
                {getStatusLabel(status as Task["status"])} ({statusTasks.length}
                )
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {statusTasks.map((task) => (
                <Card
                  key={task._id}
                  className={`border-l-4 transition-all duration-300 ease-in-out hover:shadow-md transform hover:-translate-y-1 ${getStatusColor(
                    task.status
                  )}`}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4
                          className={`font-medium text-sm ${
                            task.status === "done"
                              ? "line-through text-gray-500"
                              : ""
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTask(task);
                                  setAssignDialogOpen(true);
                                }}
                              >
                                <Users className="w-3 h-3 mr-2" />
                                Assign Users
                              </DropdownMenuItem>
                              {getPrevStatus(task.status) && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(
                                      task,
                                      getPrevStatus(task.status)!
                                    )
                                  }
                                >
                                  <ArrowLeft className="w-3 h-3 mr-2" />
                                  Move to{" "}
                                  {getStatusLabel(getPrevStatus(task.status)!)}
                                </DropdownMenuItem>
                              )}
                              {getNextStatus(task.status) && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(
                                      task,
                                      getNextStatus(task.status)!
                                    )
                                  }
                                >
                                  <ArrowRight className="w-3 h-3 mr-2" />
                                  Move to{" "}
                                  {getStatusLabel(getNextStatus(task.status)!)}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {task.description && (
                        <p
                          className={`text-xs text-gray-600 ${
                            task.status === "done" ? "line-through" : ""
                          }`}
                        >
                          {task.description}
                        </p>
                      )}

                      {/* Assigned Users */}
                      {task.assignedTo && task.assignedTo.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-gray-400" />
                          <div className="flex -space-x-1 overflow-hidden">
                            {task.assignedTo.slice(0, 3).map((user) => (
                              <Avatar
                                key={user._id}
                                className="w-6 h-6 border-2 border-white"
                              >
                                <AvatarFallback className="bg-[#3B82F6] text-white text-xs">
                                  {user.fullName
                                    ? user.fullName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                    : "NA"}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {task.assignedTo.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-gray-600">
                                  +{task.assignedTo.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {task.assignedTo.length === 1
                              ? task.assignedTo[0]?.fullName?.split(" ")[0]
                              : `${task.assignedTo.length} assigned`}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPrevStatus(task.status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() =>
                                handleStatusChange(
                                  task,
                                  getPrevStatus(task.status)!
                                )
                              }
                            >
                              <ArrowLeft className="w-3 h-3 mr-1" />
                              {getStatusLabel(getPrevStatus(task.status)!)}
                            </Button>
                          )}
                          {getNextStatus(task.status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs bg-[#3B82F6] text-white hover:bg-[#2563EB] hover:text-white transition-colors duration-200"
                              onClick={() =>
                                handleStatusChange(
                                  task,
                                  getNextStatus(task.status)!
                                )
                              }
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

// Assignment Dialog Component
interface AssignmentDialogProps {
  task: Task | null;
  availableUsers: any[];
  onAssign: (taskId: string, userIds: string[]) => void;
  onClose: () => void;
}

function AssignmentDialog({
  task,
  availableUsers,
  onAssign,
  onClose,
}: AssignmentDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (task) {
      setSelectedUsers(task.assignedTo?.map((user) => user._id) || []);
    }
  }, [task]);

  const handleAssign = () => {
    if (task) {
      onAssign(task._id, selectedUsers);
    }
  };

  if (!task) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
        {availableUsers.map((member) => {
          const user = member.user as {
            _id: string;
            fullName: string;
            email: string;
          };
          return (
            <div key={user._id} className="flex items-center space-x-3">
              <Checkbox
                id={`assign-dialog-${user._id}`}
                checked={selectedUsers.includes(user._id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedUsers([...selectedUsers, user._id]);
                  } else {
                    setSelectedUsers(
                      selectedUsers.filter((id) => id !== user._id)
                    );
                  }
                }}
              />
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-[#3B82F6] text-white">
                  {user.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {member.role}
              </Badge>
            </div>
          );
        })}
        {availableUsers.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No team members available
          </p>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleAssign}
          className="bg-[#3B82F6] hover:bg-[#2563EB]"
        >
          Assign Users
        </Button>
      </div>
    </div>
  );
}
