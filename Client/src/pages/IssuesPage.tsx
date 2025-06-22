import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Bug, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { fetchIssues, createIssue, updateIssue, deleteIssue, type Issue } from "@/store/slices/issueSlice"
import { format } from "date-fns"
import { useAppDispatch, useAppSelector } from "@/store/hooks"

interface IssuesPageProps {
  projectId: string
  projectName: string
}

export function IssuesPage({ projectId, projectName }: IssuesPageProps) {
  const dispatch = useAppDispatch()
  const { issues, loading, error } = useAppSelector((state) => state.issues)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newIssueDescription, setNewIssueDescription] = useState("")

  useEffect(() => {
    dispatch(fetchIssues(projectId) as any)
  }, [dispatch, projectId])

  const filteredIssues = issues.filter((issue: Issue) => {
    const matchesSearch = issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateIssue = async () => {
    if (!newIssueDescription.trim()) return

    try {
      await dispatch(
        createIssue({
          description: newIssueDescription,
          project: projectId,
        }) as any,
      )
      setNewIssueDescription("")
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Failed to create issue:", error)
    }
  }

  const handleUpdateIssueStatus = async (issueId: string, status: Issue["status"]) => {
    try {
      await dispatch(
        updateIssue({
          id: issueId,
          data: { status },
        }) as any,
      )
    } catch (error) {
      console.error("Failed to update issue:", error)
    }
  }

  const handleDeleteIssue = async (issueId: string) => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {
        await dispatch(deleteIssue(issueId) as any)
      } catch (error) {
        console.error("Failed to delete issue:", error)
      }
    }
  }

  const getStatusIcon = (status: Issue["status"]) => {
    switch (status) {
      case "open":
        return <Bug className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: Issue["status"]) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const openIssues = issues.filter((issue: Issue) => issue.status === "open").length
  const inProgressIssues = issues.filter((issue: Issue) => issue.status === "in-progress").length
  const resolvedIssues = issues.filter((issue: Issue) => issue.status === "resolved").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
          <p className="text-gray-600">{projectName}</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Issue
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Issue</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  value={newIssueDescription}
                  onChange={(e) => setNewIssueDescription(e.target.value)}
                  placeholder="Describe the issue..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateIssue}
                  disabled={!newIssueDescription.trim()}
                  className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                >
                  Create Issue
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-[#3B82F6]">{issues.length}</p>
              </div>
              <Bug className="w-8 h-8 text-[#3B82F6]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="text-2xl font-bold text-red-600">{openIssues}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{inProgressIssues}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{resolvedIssues}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Loading issues...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-500">Error: {error}</p>
            </CardContent>
          </Card>
        ) : filteredIssues.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bug className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all" ? "No issues match your filters" : "No issues found"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredIssues.map((issue: Issue) => (
            <Card key={issue._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`flex items-center gap-2 ${getStatusColor(issue.status)}`}>
                        {getStatusIcon(issue.status)}
                        {issue.status.replace("-", " ")}
                      </Badge>
                      <span className="text-sm text-gray-500">#{issue._id.slice(-6)}</span>
                    </div>

                    <p className="text-gray-900 font-medium">{issue.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Reported by {typeof issue.reportedBy === "object" ? issue.reportedBy.fullName : "Unknown"}
                      </span>
                      <span>•</span>
                      <span>{format(new Date(issue.createdAt), "MMM dd, yyyy")}</span>
                    </div>

                    {issue.resolution && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          <strong>Resolution:</strong> {issue.resolution}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Select
                      value={issue.status}
                      onValueChange={(value) => handleUpdateIssueStatus(issue._id, value as Issue["status"])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteIssue(issue._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}