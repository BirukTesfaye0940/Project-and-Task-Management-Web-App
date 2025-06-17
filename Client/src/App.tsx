import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import LandingPage from "./pages/LandingPage"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LandingPage />} />
    </Route>
  )
)

function App() {
  return (
   <RouterProvider router={router} />
  )
}

export default App
