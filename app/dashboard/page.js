"use client";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTasks,
  FaUser,
  FaClock,
  FaBell,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import gsap from "gsap";
import { auth } from "../lib/firebase"; // تأكد ان مسار الفايربيز صحيح
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

import Profile from "../Components/Profile";
import First from "../Components/First";
import Tasks from "../Components/Tasks";
import Pomodoro from "../Components/Pomodoro";
import LogOut from "../Components/LogOut";

export default function Dashboard() {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // content right part
  const content = {
    dashboard: <First />,
    tasks: <Tasks />,
    pomodoro: <Pomodoro />,
    profile: <Profile />,
    logout: <LogOut />,
  };

  const handleSectionChange = (section) => {
    setLoading(true);
    setTimeout(() => {
      setActiveSection(section);
      setLoading(false);
    }, 700); // simulate loading
  };

  // gsap animation on section change
  useEffect(() => {
    gsap.fromTo(
      ".content-area",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6 }
    );
  }, [activeSection]);

  // Check user auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // لو مفيش مستخدم، روح لصفحة تسجيل الدخول
        router.push("/"); // غيرها للصفحة اللي فيها تسجيل الدخول عندك
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <FaBell /> },
    { key: "tasks", label: "Tasks", icon: <FaTasks /> },
    { key: "pomodoro", label: "Pomodoro", icon: <FaClock /> },
    { key: "profile", label: "Profile", icon: <FaUser /> },
    {
      key: "logout",
      label: "Logout",
      icon: <FaSignOutAlt />,
    },
  ];

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex bg-white relative">
      {/*mobile*/}
      <button
        className="lg:hidden absolute top-4 left-4 z-20 text-2xl"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <FaBars className="cursor-pointer" />
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white p-4 space-y-4 fixed lg:static z-10 h-full transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64 lg:w-56`}
      >
        <h2 className="text-2xl font-bold text-center">Dashboard</h2>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    handleSectionChange(item.key);
                    setShowSidebar(false);
                  }
                }}
                className={`flex items-center w-full gap-2 text-left p-2 rounded-md hover:bg-gray-700 transition ${
                  activeSection === item.key ? "bg-gray-700" : ""
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* content */}
      <div className="flex-1 ml-0 p-10 content-area bg-gray-100 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          content[activeSection]
        )}
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
}
