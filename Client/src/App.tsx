import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/Login"
import SignUpPage from "./pages/Signup"
import DashboardPage from "./pages/DashboardPage"
import NotFound from "./pages/NotFound"
import Layout from "./pages/Layout"
import { Toaster } from "sonner"
import ProjectsPage from "./pages/ProjectsPage"
import AcceptInvitationPage from "./pages/AcceptInvitationPage"
import TasksPage from "./pages/TaskPage"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/accept-invite/:token" element={<AcceptInvitationPage />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Route>
      

      <Route path="*" element={<NotFound />} />
    </Route>
  )
)

function App() {
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
}

export default App
