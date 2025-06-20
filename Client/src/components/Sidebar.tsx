import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  // AlertCircle, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  LogOut
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import type { RootState, AppDispatch } from '@/store/store';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/')
  };
  
  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: location.pathname === '/dashboard'
    },
    {
      title: 'Projects',
      href: '/projects',
      icon: FolderKanban,
      active: location.pathname.startsWith('/projects')
    },
    {
      title: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
      active: location.pathname.startsWith('/tasks')
    },
    // {
    //   title: 'Issues',
    //   href: '/issues',
    //   icon: AlertCircle,
    //   active: location.pathname.startsWith('/issues')
    // },
    {
      title: 'Notifications',
      href: '/notifications',
      icon: Bell,
      active: location.pathname.startsWith('/notifications')
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      active: location.pathname.startsWith('/settings')
    }
  ];

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            {/* <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ProcrastiNOT
            </h1> */}
          </Link>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
              item.active
                ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              isCollapsed && "justify-center px-2"
            )}
          >
            <item.icon className={cn(
              "flex-shrink-0 transition-colors",
              item.active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600",
              isCollapsed ? "w-5 h-5" : "w-4 h-4"
            )} />
            {!isCollapsed && (
              <span className="truncate">{item.title}</span>
            )}
            {item.active && !isCollapsed && (
              <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className={cn(
            "flex-shrink-0",
            isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"
          )} />
          {!isCollapsed && "Sign Out"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;