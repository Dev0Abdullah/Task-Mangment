"use client";

import { Button } from "@mui/material";
import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoMdAdd } from "react-icons/io";
import { format } from "date-fns";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";

function Tasks() {
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const tasksCollection = collection(db, "tasks");
    const q = query(tasksCollection, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const openModal = () => {
    setIsOpen(true);
    setEditMode(false);
    setName("");
    setBio("");
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditMode(false);
    setName("");
    setBio("");
    setCurrentId(null);
  };

  const handleSave = async () => {
    if (loading) return; // منع الضغط المتكرر
    if (name.trim() === "") {
      toast.error("Please Enter Name");
      return;
    }

    try {
      setLoading(true); // بداية تحميل

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("You must be logged in to save a task.");
        setLoading(false);
        return;
      }

      const tasksCollection = collection(db, "tasks");

      if (editMode && currentId) {
        const taskDoc = doc(db, "tasks", currentId);
        await updateDoc(taskDoc, {
          title: name,
          description: bio,
        });
      } else {
        await addDoc(tasksCollection, {
          title: name,
          description: bio,
          status: "Pending",
          createdAt: serverTimestamp(),
          userId: user.uid,
        });
      }

      closeModal();
    } catch (error) {
      console.error("Error saving task: ", error);
    } finally {
      setLoading(false); // انتهاء تحميل
    }
  };

  const handleDelete = async (id) => {
    try {
      const taskDoc = doc(db, "tasks", id);
      await deleteDoc(taskDoc);
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const handleEdit = (task) => {
    setEditMode(true);
    setIsOpen(true);
    setName(task.title);
    setBio(task.description);
    setCurrentId(task.id);
  };

  const handleStatusChange = async (task) => {
    const newStatus =
      task.status === "Pending"
        ? "In Progress"
        : task.status === "In Progress"
        ? "Completed"
        : "Pending";

    try {
      const taskDoc = doc(db, "tasks", task.id);
      await updateDoc(taskDoc, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col items-start gap-6">
        {/* الزرار */}
        <Button
          variant="contained"
          className="flex justify-center items-center gap-2 cursor-pointer"
          onClick={openModal}
        >
          <IoMdAdd className="size-4" /> Add Task
        </Button>

        {/* عرض المهام */}
        <div className="flex flex-wrap gap-6 w-full">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border border-gray-200 rounded-xl shadow-md w-80 bg-white p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {task.title}
                </h2>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <p className="text-xs">
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      task.status === "Completed"
                        ? "text-green-600"
                        : task.status === "In Progress"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {task.status}
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  Created:{" "}
                  {task.createdAt
                    ? format(task.createdAt.toDate(), "PPpp")
                    : "Loading..."}
                </p>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  className="text-blue-600 hover:underline text-sm cursor-pointer"
                  onClick={() => handleStatusChange(task)}
                >
                  Change Status
                </button>
                <div className="flex gap-2">
                  <button
                    className="text-yellow-600 hover:underline text-sm cursor-pointer"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline text-sm cursor-pointer"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* المودال */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    {editMode ? "Edit Task" : "Add Task"}
                  </Dialog.Title>

                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Enter task title"
                        className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Enter task description"
                        rows={3}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        {editMode ? "Save Changes" : "Add Task"}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default Tasks;
