import React, { useState, useEffect, useRef } from "react";

export default function Pomodoro() {
  const WORK_TIME = 25 * 60; // 25 minutes in seconds
  const BREAK_TIME = 5 * 60; // 5 minutes in seconds

  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true); // true = work, false = break

  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkTime(true);
    setTimeLeft(WORK_TIME);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            if (isWorkTime) {
              setIsWorkTime(false);
              return BREAK_TIME;
            } else {
              setIsWorkTime(true);
              return WORK_TIME;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, isWorkTime]);

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center mt-32 select-none">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">
        {isWorkTime ? "Work Time" : "Break Time"}
      </h2>

      <div
        className={`text-6xl font-mono mb-6 ${
          isWorkTime ? "text-red-600" : "text-green-600"
        }`}
      >
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          className={`px-6 py-2 rounded-md text-white font-semibold transition-colors ${
            isRunning
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          onClick={resetTimer}
          className="px-6 py-2 rounded-md bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition-colors"
        >
          Reset
        </button>
      </div>

      <p className="mt-6 text-gray-500 text-sm">
        Pomodoro Technique: 25 minutes work, 5 minutes break.
      </p>
    </div>
  );
}
