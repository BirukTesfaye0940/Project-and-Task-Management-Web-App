import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Plus, Eye, Users, Clock, CheckCircle2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProjects, type Project } from "@/store/slices/projectsSlice";
import { fetchTasks } from "@/store/slices/taskSlice";
import { Link, NavLink } from "react-router-dom";
import { checkAuth } from "@/store/slices/authSlice";

// Utility to map status to display text and badge classes
const statusMap: Record<Project["status"], { label: string; badge: string }> = {
  active: { label: "In Progress", badge: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", badge: "bg-green-100 text-green-700" },
  "on-hold": { label: "On Hold", badge: "bg-yellow-100 text-yellow-700" },
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { projects } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.task);

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  // Stats
  const activeCount = projects.filter((p) => p.status === "active").length;
  const pendingCount = tasks.filter(
    (t) => t.status === "to-do" || t.status === "in-progress"
  ).length;
  const teamCount = new Set(
    projects.flatMap((p) =>
      p.team.map((member) =>
        typeof member.user === "string" ? member.user : member.user._id
      )
    )
  ).size;

  const stats = [
    {
      title: "Active Projects",
      value: activeCount,
      icon: CheckCircle2,
      badge: "bg-green-50 text-green-600",
    },
    {
      title: "Pending Tasks",
      value: pendingCount,
      icon: Clock,
      badge: "bg-blue-50 text-blue-600",
    },
    {
      title: "Team Members",
      value: teamCount,
      icon: Users,
      badge: "bg-purple-50 text-purple-600",
    },
  ];

  // Recent projects with real progress
  const recent = projects.map((p) => {
    const total = p.tasks?.length || 0;
    const done = p.tasks?.filter((t) => t.status === "done").length || 0;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const { label, badge } = statusMap[p.status] || {
      label: "Planning",
      badge: "bg-gray-100 text-gray-700",
    };
    return {
      id: p._id,
      name: p.name,
      progress: pct,
      statusLabel: label,
      badgeClass: badge,
      due: p.endDate ? new Date(p.endDate).toLocaleDateString() : "N/A",
    };
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName || "Guest"}!
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening today.</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <Card key={i} className="shadow-sm hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{s.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {s.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${s.badge}`}>
                  {" "}
                  <s.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your most active projects</CardDescription>
            </div>
            <Link to="/projects">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" /> View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recent.length ? (
                recent.map((r, idx) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{r.name}</h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600"
                            style={{ width: `${r.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {r.progress}%
                        </span>
                      </div>
                      <span
                        className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${r.badgeClass}`}
                      >
                        {r.statusLabel}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Due</p>
                      <p className="text-sm font-medium text-gray-900">
                        {r.due}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No recent projects found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Card */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {user?.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt={user.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center">
                    {user?.fullName?.[0]?.toUpperCase() || "G"}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900">
                {user?.fullName || "Guest"}
              </h3>
              <p className="text-sm text-gray-600">{user?.email || "N/A"}</p>
              <NavLink to={"/profile-page"}>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  Edit Profile
                </Button>
              </NavLink>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
