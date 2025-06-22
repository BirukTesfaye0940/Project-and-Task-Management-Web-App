"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Calendar, Users, CheckCircle, Clock, AlertCircle, Bug } from "lucide-react"
import type { Project } from "@/store/slices/projectsSlice"
import { TaskList } from "./TaskList"
import { format } from "date-fns"
import { InviteUserDialog } from "./InviteUserDialog"
import { useState } from "react"
import { IssuesPage } from "../../pages/IssuesPage"

interface ProjectDetailsProps {
  project: Project
  onBack: () => void
}

export function ProjectDetails({ project, onBack }: ProjectDetailsProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "issues">("overview")

  const completedTasks = project.tasks?.filter((task) => task.status === "done").length || 0
  const totalTasks = project.tasks?.length || 0
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const inProgressTasks = project.tasks?.filter((task) => task.status === "in-progress").length || 0
  const todoTasks = project.tasks?.filter((task) => task.status === "to-do").length || 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "on-hold":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-[#3B82F6] text-[#3B82F6]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("issues")}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === "issues"
                ? "border-[#3B82F6] text-[#3B82F6]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Bug className="w-4 h-4" />
            Issues
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl">{project.name}</CardTitle>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                  <Badge variant="outline" className={`flex items-center gap-2 ${getStatusColor(project.status)}`}>
                    {getStatusIcon(project.status)}
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm">
                        {format(new Date(project.startDate), "MMM dd, yyyy")} -{" "}
                        {format(new Date(project.endDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium">Team</p>
                      <p className="text-sm">{project.team.length} members</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Project Progress</h4>
                    <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <p className="text-sm text-gray-600">
                    {completedTasks} of {totalTasks} tasks completed
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-sm text-gray-600">To Do: {todoTasks}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="text-sm text-gray-600">In Progress: {inProgressTasks}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-sm text-gray-600">Completed: {completedTasks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {project.tasks && <TaskList projectId={project._id} tasks={project.tasks} project={project} />}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Members</CardTitle>
              </CardHeader>
              <InviteUserDialog projectId={project._id} />
              <CardContent className="space-y-4">
                {project.team.map((member) => (
                  <div key={member._id} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#3B82F6] text-white">
                        {typeof member.user === "object"
                          ? member.user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {typeof member.user === "object" ? member.user.fullName : "Unknown User"}
                      </p>
                      <p className="text-sm text-gray-600">{typeof member.user === "object" ? member.user.email : ""}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#3B82F6]">{totalTasks}</p>
                    <p className="text-sm text-gray-600">Total Tasks</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{inProgressTasks}</p>
                    <p className="text-sm text-gray-600">In Progress</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-600">{todoTasks}</p>
                    <p className="text-sm text-gray-600">To Do</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <IssuesPage projectId={project._id} projectName={project.name} />
      )}
    </div>
  )
}