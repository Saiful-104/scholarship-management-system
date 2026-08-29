
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import coverImg from "../../../assets/images/cover.jpg";

import {
  User,
  Mail,
  Shield,
  Key,
  Edit2,
  Calendar,
  CheckCircle,
  Globe,
  Bell,
  Settings,
} from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [role, isRoleLoading] = useRole();

  if (isRoleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 animate-spin mx-auto"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  const getRoleColor = () => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-pink-600";

      case "moderator":
        return "bg-gradient-to-r from-amber-500 to-orange-600";

      case "student":
        return "bg-gradient-to-r from-blue-500 to-cyan-600";

      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getRoleIcon = () => {
    switch (role?.toLowerCase()) {
      case "admin":
        return <Shield className="w-4 h-4" />;

      case "moderator":
        return <User className="w-4 h-4" />;

      case "student":
        return <User className="w-4 h-4" />;

      default:
        return <User className="w-4 h-4" />;
    }
  };

  const profileImage =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.displayName || "User"
    )}&background=random&color=fff&size=128`;

  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        dark:bg-gray-950
        py-8
        px-4
        transition-colors
        duration-300
      "
    >
      <div className="max-w-4xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1
            className="
              text-3xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            Profile
          </h1>

          <p
            className="
              text-gray-600
              dark:text-gray-400
              mt-2
            "
          >
            Manage your personal information and account settings
          </p>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-2">

            {/* Profile Card */}
            <div
              className="
                bg-white
                dark:bg-gray-900
                rounded-2xl
                shadow-xl
                dark:shadow-black/30
                overflow-hidden
                border
                border-gray-200
                dark:border-gray-800
                transition-colors
                duration-300
              "
            >

              {/* ================= COVER IMAGE ================= */}
              <div className="relative h-48">

                <img
                  alt="cover photo"
                  src={coverImg}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                {/* Profile Image */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative">

                    <img
                      alt="profile"
                      src={profileImage}
                      className="
                        h-24
                        w-24
                        rounded-2xl
                        border-4
                        border-white
                        dark:border-gray-900
                        shadow-xl
                        object-cover
                      "
                    />

                    <button
                      className="
                        absolute
                        -bottom-2
                        -right-2
                        bg-blue-600
                        hover:bg-blue-700
                        dark:bg-blue-500
                        dark:hover:bg-blue-600
                        text-white
                        p-2
                        rounded-full
                        shadow-lg
                        transition-all
                        duration-200
                      "
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              </div>

              {/* ================= PROFILE INFO ================= */}
              <div className="pt-16 pb-8 px-8">

                {/* Name & Email */}
                <div className="text-center mb-6">

                  <h2
                    className="
                      text-2xl
                      font-bold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {user?.displayName || "User"}
                  </h2>

                  <div className="flex items-center justify-center mt-2 space-x-2">

                    <Mail className="w-4 h-4 text-gray-400" />

                    <p
                      className="
                        text-gray-600
                        dark:text-gray-400
                      "
                    >
                      {user?.email}
                    </p>

                  </div>
                </div>

                {/* ================= STATS ================= */}
                <div className="grid grid-cols-3 gap-4 mb-8">

                  {/* Scholarships */}
                  <div
                    className="
                      text-center
                      p-4
                      bg-blue-50
                      dark:bg-blue-950/40
                      rounded-xl
                      border
                      border-blue-100
                      dark:border-blue-900/50
                    "
                  >
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      0
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Scholarships
                    </div>
                  </div>

                  {/* Applications */}
                  <div
                    className="
                      text-center
                      p-4
                      bg-green-50
                      dark:bg-green-950/40
                      rounded-xl
                      border
                      border-green-100
                      dark:border-green-900/50
                    "
                  >
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      0
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Applications
                    </div>
                  </div>

                  {/* Saved */}
                  <div
                    className="
                      text-center
                      p-4
                      bg-purple-50
                      dark:bg-purple-950/40
                      rounded-xl
                      border
                      border-purple-100
                      dark:border-purple-900/50
                    "
                  >
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      0
                    </div>

                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Saved
                    </div>
                  </div>

                </div>

                {/* ================= USER ID & ROLE ================= */}
                <div className="space-y-4">

                  {/* User ID */}
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      p-4
                      bg-gray-50
                      dark:bg-gray-800/70
                      rounded-xl
                      border
                      border-gray-100
                      dark:border-gray-700
                    "
                  >
                    <div className="flex items-center space-x-3">

                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Key className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          User ID
                        </p>

                        <p className="font-mono text-sm text-gray-900 dark:text-gray-200 break-all">
                          {user?.uid}
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Role */}
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      p-4
                      bg-gray-50
                      dark:bg-gray-800/70
                      rounded-xl
                      border
                      border-gray-100
                      dark:border-gray-700
                    "
                  >

                    <div className="flex items-center space-x-3">

                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Shield className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Account Role
                        </p>

                        <p className="font-medium text-gray-900 dark:text-white">
                          {role || "User"}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`
                        inline-flex
                        items-center
                        space-x-1.5
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-medium
                        text-white
                        ${getRoleColor()}
                      `}
                    >
                      {getRoleIcon()}
                      <span>{role || "User"}</span>
                    </span>

                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="space-y-6">

            {/* ================= ACCOUNT STATUS ================= */}
            <div
              className="
                bg-white
                dark:bg-gray-900
                rounded-2xl
                shadow-lg
                dark:shadow-black/30
                p-6
                border
                border-gray-200
                dark:border-gray-800
              "
            >

              <h3
                className="
                  text-lg
                  font-semibold
                  text-gray-900
                  dark:text-white
                  mb-4
                "
              >
                Account Status
              </h3>

              <div className="space-y-4">

                {/* Email Verified */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>

                    <span className="text-gray-700 dark:text-gray-300">
                      Email Verified
                    </span>
                  </div>

                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>

                {/* Profile Complete */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>

                    <span className="text-gray-700 dark:text-gray-300">
                      Profile Complete
                    </span>
                  </div>

                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    80%
                  </span>

                </div>

                {/* Member Since */}
                <div className="flex items-center justify-between">

                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>

                    <span className="text-gray-700 dark:text-gray-300">
                      Member Since
                    </span>
                  </div>

                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Recently
                  </span>

                </div>

              </div>
            </div>

            {/* ================= QUICK ACTIONS ================= */}
            <div
              className="
                bg-white
                dark:bg-gray-900
                rounded-2xl
                shadow-lg
                dark:shadow-black/30
                p-6
                border
                border-gray-200
                dark:border-gray-800
              "
            >

              <h3
                className="
                  text-lg
                  font-semibold
                  text-gray-900
                  dark:text-white
                  mb-4
                "
              >
                Quick Actions
              </h3>

              <div className="space-y-3">

                {/* Update Profile */}
                <button
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-3
                    bg-blue-50
                    dark:bg-blue-950/40
                    text-blue-600
                    dark:text-blue-400
                    rounded-xl
                    hover:bg-blue-100
                    dark:hover:bg-blue-900/50
                    transition-all
                    duration-200
                    group
                  "
                >
                  <div className="flex items-center space-x-3">

                    <div className="p-2 bg-blue-100 dark:bg-blue-900/60 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </div>

                    <span className="font-medium">
                      Update Profile
                    </span>

                  </div>

                  <div className="text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300">
                    →
                  </div>
                </button>

                {/* Change Password */}
                <button
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-3
                    bg-green-50
                    dark:bg-green-950/40
                    text-green-600
                    dark:text-green-400
                    rounded-xl
                    hover:bg-green-100
                    dark:hover:bg-green-900/50
                    transition-all
                    duration-200
                    group
                  "
                >
                  <div className="flex items-center space-x-3">

                    <div className="p-2 bg-green-100 dark:bg-green-900/60 rounded-lg">
                      <Key className="w-4 h-4" />
                    </div>

                    <span className="font-medium">
                      Change Password
                    </span>

                  </div>

                  <div className="text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300">
                    →
                  </div>
                </button>

                {/* Notifications */}
                <button
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-3
                    bg-purple-50
                    dark:bg-purple-950/40
                    text-purple-600
                    dark:text-purple-400
                    rounded-xl
                    hover:bg-purple-100
                    dark:hover:bg-purple-900/50
                    transition-all
                    duration-200
                    group
                  "
                >
                  <div className="flex items-center space-x-3">

                    <div className="p-2 bg-purple-100 dark:bg-purple-900/60 rounded-lg">
                      <Bell className="w-4 h-4" />
                    </div>

                    <span className="font-medium">
                      Notifications
                    </span>

                  </div>

                  <div className="text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300">
                    →
                  </div>
                </button>

                {/* Settings */}
                <button
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    p-3
                    bg-gray-50
                    dark:bg-gray-800/70
                    text-gray-600
                    dark:text-gray-300
                    rounded-xl
                    hover:bg-gray-100
                    dark:hover:bg-gray-700
                    transition-all
                    duration-200
                    group
                  "
                >
                  <div className="flex items-center space-x-3">

                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Settings className="w-4 h-4" />
                    </div>

                    <span className="font-medium">
                      Settings
                    </span>

                  </div>

                  <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200">
                    →
                  </div>
                </button>

              </div>
            </div>

            {/* ================= SECURITY ================= */}
            <div
              className="
                bg-gradient-to-r
                from-blue-500
                to-blue-600
                dark:from-blue-600
                dark:to-indigo-700
                rounded-2xl
                p-6
                text-white
                shadow-lg
              "
            >

              <div className="flex items-center space-x-3 mb-4">

                <div className="p-2 bg-white/20 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Security Status
                  </h3>

                  <p className="text-sm text-blue-100">
                    Your account is secure
                  </p>
                </div>

              </div>

              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div className="w-4/5 h-2 bg-white rounded-full"></div>
              </div>

              <p className="text-sm text-blue-100">
                High security level
              </p>

            </div>
          </div>
        </div>

        {/* ================= RECENT ACTIVITY ================= */}
        <div
          className="
            mt-8
            bg-white
            dark:bg-gray-900
            rounded-2xl
            shadow-lg
            dark:shadow-black/30
            p-6
            border
            border-gray-200
            dark:border-gray-800
          "
        >

          <h3
            className="
              text-lg
              font-semibold
              text-gray-900
              dark:text-white
              mb-4
            "
          >
            Recent Activity
          </h3>

          <div className="space-y-4">

            {/* Activity */}
            <div
              className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
                p-3
                bg-gray-50
                dark:bg-gray-800/70
                rounded-xl
              "
            >

              <div className="flex items-center space-x-3">

                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Account Created
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your account was successfully created
                  </p>
                </div>

              </div>

              <div className="flex items-center space-x-2">

                <Calendar className="w-4 h-4 text-gray-400" />

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Just now
                </span>

              </div>

            </div>

            {/* Empty State */}
            <div className="text-center py-4">

              <p className="text-gray-500 dark:text-gray-400">
                No recent activity yet
              </p>

              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Start exploring scholarships to see your activity
              </p>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;

