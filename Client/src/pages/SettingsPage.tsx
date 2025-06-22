import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkAuth } from "@/store/slices/authSlice";
import { User } from "lucide-react"
import { useEffect } from "react";
import { NavLink } from "react-router-dom"


function SettingsPage() {
  const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
  
    useEffect(() => {
      dispatch(checkAuth());
    }, [dispatch]);
  
  return (
    <div className="max-w-2xl m-5">
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
  )
}

export default SettingsPage
