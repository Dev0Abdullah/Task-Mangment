import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "@mui/material";
import { auth, db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
function Profile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // open && close model
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  //Firestore fech
  useEffect(() => {
    const fetchData = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setBio(data.bio || "");
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchData();
  }, []);

  //save info
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("لم يتم العثور على المستخدم.");
      return;
    }
    // بعد رفع الصورة أو لو مفيش صورة جديدة، نحفظ البيانات
    await setDoc(doc(db, "users", user.uid), {
      name,
      bio,
    });
    toast.success("تم حفظ البيانات بنجاح");
    closeModal();
  };

  return (
    <div className="w-full h-full flex justify-center flex-col items-center gap-20">
      <div className="w-[150px] h-[150px] rounded-full shadow-2xl">
        <img
          alt="Profile"
          src="/WhatsApp Image 2025-05-19 at 21.20.34_fc7144af.jpg"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <div className="flex justify-center items-center flex-col gap-3">
        <div>
          Name: <b>{name}</b>
        </div>
        <div>
          Bio: <b>{bio}</b>
        </div>
      </div>

      <div>
        <Button variant="contained" type="button" onClick={openModal}>
          Edit Profile
        </Button>
      </div>

      {/* dialog */}
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
                    Edit Profile
                  </Dialog.Title>

                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder="Enter your name"
                        className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Enter your bio"
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
                      >
                        Save Changes
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

export default Profile;
