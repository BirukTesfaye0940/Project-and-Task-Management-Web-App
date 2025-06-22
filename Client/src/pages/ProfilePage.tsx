'use client';
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks"; 
import { updateProfile } from "@/store/slices/authSlice"; 
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Camera, Mail, User, Shield, Check, Upload } from "lucide-react";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result as string;
      setSelectedImg(base64Image);
      dispatch(updateProfile({ profilePic: base64Image }));
    };
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="relative mx-auto mb-6">
              <div 
                className={`relative group transition-all duration-300 ${
                  dragActive ? 'scale-105' : ''
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Avatar className="h-32 w-32 ring-4 ring-white shadow-xl transition-all duration-300 group-hover:shadow-2xl">
                  <AvatarImage
                    src={selectedImg || user?.profilePic}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {user?.fullName?.[0]}
                  </AvatarFallback>
                </Avatar>
                
                {/* Upload overlay */}
                <div className={`absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center ${
                  loading ? 'opacity-100' : ''
                }`}>
                  {loading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                  ) : (
                    <Camera className="h-8 w-8 text-white" />
                  )}
                </div>
                
                <label
                  htmlFor="avatar-upload"
                  className={`absolute -bottom-2 -right-2 rounded-full p-3 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 ${
                    loading ? "animate-pulse pointer-events-none" : ""
                  }`}
                >
                  <Upload className="h-5 w-5" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={loading}
                  />
                </label>
              </div>
              
              {dragActive && (
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-500 animate-pulse" />
              )}
            </div>
            
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              {user?.fullName}
            </CardTitle>
            {/* <Badge 
              variant="secondary" 
              className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-200 px-3 py-1"
            >
              <Shield className="h-3 w-3 mr-1" />
              Verified Account
            </Badge> */}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Profile Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                Personal Information
              </h3>
              
              <div className="grid gap-4">
                <div className="group">
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Full Name
                  </label>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 group-hover:border-blue-200 transition-colors duration-200">
                    <div className="font-medium text-gray-900">{user?.fullName}</div>
                  </div>
                </div>
                
                <div className="group">
                  <label className="text-sm font-medium text-gray-500 mb-2 block flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email Address
                  </label>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 group-hover:border-blue-200 transition-colors duration-200">
                    <div className="font-medium text-gray-900 flex items-center justify-between">
                      {user?.email}
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Account Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-500" />
                Account Status
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-green-800">Status</div>
                      <div className="text-lg font-bold text-green-900">Active</div>
                    </div>
                    <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-blue-800">Verification</div>
                      <div className="text-lg font-bold text-blue-900">Verified</div>
                    </div>
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-purple-800">Plan</div>
                      <div className="text-lg font-bold text-purple-900">Premium</div>
                    </div>
                    <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Action Buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                Edit Profile
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-gray-300 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                disabled={loading}
              >
                Security Settings
              </Button>
            </div> */}

            {/* Status Message */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2" />
                    Updating profile...
                  </span>
                ) : (
                  "Click the camera icon or drag & drop to update your photo"
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}