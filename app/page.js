// Becuse Use Hocks
"use client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
export default function Home() {
  // Hocks
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  // Function SubMit
  const submit = (e) => {
    e.preventDefault();
    // FireBase
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        const user = userCredential.user;
        toast.success(`Welcome back, ${user.email}!`);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      })
      .catch((error) => {
        toast.error("Email or Password is incorrect!");
        console.log(error.message);
      });
  };
  return (
    <div className="w-full h-screen flex">
      {/* Left Part - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center">
        <form
          onSubmit={submit}
          className="w-[80%] max-w-md space-y-6 bg-gray-100 p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Log In
          </h2>
          <div>
            <input
              type="text"
              placeholder="Email..."
              required
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password..."
              required
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => {
                setpass(e.target.value);
              }}
            />
          </div>
          <div>
            <Link href="/signup" className="text-sm text-blue-500">
              Create Account ?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer"
          >
            Log In
          </button>
        </form>
      </div>

      {/* Right Part - Image */}
      <div className="hidden lg:flex w-1/2 h-full">
        <img
          alt="Login Illustration"
          src="joanna-kosinska-LAaSoL0LrYs-unsplash.jpg"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
