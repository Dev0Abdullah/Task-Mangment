"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function Signup() {
  // States for form inputs
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");

  // Function to handle form submission
  const submit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (pass !== confirmPass) {
      setError("Passwords do not match!");
      return;
    }

    // Check password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(pass)) {
      setError(
        "Password must be at least 8 characters, contain a lowercase letter, an uppercase letter, a number, and a special character."
      );
      return;
    }

    // Firebase sign-up
    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        const user = userCredential.user;
        toast.success(`Welcome, ${user.email}!`);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      })
      .catch((error) => {
        toast.error("Error creating account: " + error.message);
        console.log(error.message);
      });
  };

  return (
    <div className="w-full h-screen flex">
      {/* Left Part  Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center">
        <form
          onSubmit={submit}
          className="w-[80%] max-w-md space-y-6 bg-gray-100 p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Sign Up
          </h2>
          <div>
            <input
              type="text"
              placeholder="Email..."
              required
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password..."
              required
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setpass(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password..."
              required
              className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <Link href="/" className="text-sm text-blue-500">
              Already have an account?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer"
          >
            Sign Up
          </button>
        </form>
      </div>

      {/* Right Part - Image */}
      <div className="hidden lg:flex w-1/2 h-full">
        <img
          alt="Sign Up Illustration"
          src="joanna-kosinska-LAaSoL0LrYs-unsplash.jpg"
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
