"use client";

import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LogOut() {
  const auth = getAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.replace("/"); // استخدم router.replace بدل window.location.href
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <div className="bg-white shadow-md rounded-md p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Are you sure you want to log out?
        </h2>
        <p className="mb-6 text-gray-600">
          You will lose access to your account temporarily.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Yes, log out
        </button>
      </div>
    </div>
  );
}
