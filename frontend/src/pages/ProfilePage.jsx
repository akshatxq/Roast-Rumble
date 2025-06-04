import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className='absolute inset-0 bg-[url(&apos;data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%239C92AC" fillOpacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E&apos;)] animate-pulse'></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/30 p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Warrior Profile
            </h1>
            <p className="text-gray-400"></p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  selectedImg ||
                  authUser.profilePic ||
                  `https://ui-avatars.com/api/?name=${
                    authUser?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2) || "U"
                  }&background=6B46C1&color=fff&size=128`
                }
                alt="Profile"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${
                    authUser?.fullName?.charAt(0) || "U"
                  }&background=6B46C1&color=fff&size=128`;
                }}
                className="size-32 rounded-full object-cover border-4 border-purple-500/30 bg-gray-800"
              />

              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-purple-600 hover:bg-purple-700 hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-gray-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Tap the camera to update your portrait."}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Warrior Name
              </div>
              <p className="px-4 py-2.5 bg-black/30 rounded-lg border border-purple-500/30 text-white">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Roast Mail (Email ID)
              </div>
              <p className="px-4 py-2.5 bg-black/30 rounded-lg border border-purple-500/30 text-white">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-black/30 rounded-xl p-6 border border-purple-500/30">
            <h2 className="text-lg font-medium text-white mb-4">
            Warrior’s Profile Info
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-purple-500/30">
                <span className="text-gray-300">Clan Enrollment</span>
                <span className="text-white">
                  {authUser.createdAt?.split("T")[0]}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-300">Warrior Status</span>
                <span className="text-green-400">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
