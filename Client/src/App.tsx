import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/Login"
import SignUpPage from "./pages/Signup"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
    </Route>
  )
)

function App() {
  return (
   <RouterProvider router={router} />
  )
}

export default App
