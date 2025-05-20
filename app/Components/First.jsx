import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import UserChart from "./UserChart";
import { getAuth } from "firebase/auth"; // لإحضار المستخدم الحالي

function First() {
  const [projectData, setProjectData] = useState({
    total: 0,
    ended: 0,
    running: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          console.warn("لا يوجد مستخدم مسجل الدخول.");
          return;
        }

        const userId = currentUser.uid;

        // نجيب فقط المهام الخاصة بالمستخدم الحالي
        const q = query(collection(db, "tasks"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        let total = 0;
        let ended = 0;
        let running = 0;
        let pending = 0;

        querySnapshot.forEach((doc) => {
          total++;
          const data = doc.data();

          if (data.status === "Completed") ended++;
          else if (data.status === "In Progress") running++;
          else if (data.status === "Pending") pending++;
        });

        setProjectData({ total, ended, running, pending });
      } catch (error) {
        console.error("خطأ في جلب البيانات من فايربيز:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Boxes */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-10 mb-32">
        <div className="w-[250px] p-5 rounded-md h-auto bg-gray-800 text-white">
          <h3 className="text-2xl mb-3">Total Tasks</h3>
          <b className="text-[18px]">{projectData.total}</b>
        </div>
        <div className="w-[250px] p-5 rounded-md h-auto bg-gray-800 text-white">
          <h3 className="text-2xl mb-3">Completed Tasks</h3>
          <b className="text-[18px]">{projectData.ended}</b>
        </div>
        <div className="w-[250px] p-5 rounded-md h-auto bg-gray-800 text-white">
          <h3 className="text-2xl mb-3">Running Tasks</h3>
          <b className="text-[18px]">{projectData.running}</b>
        </div>
        <div className="w-[250px] p-5 rounded-md h-auto bg-gray-800 text-white">
          <h3 className="text-2xl mb-3">Pending Tasks</h3>
          <b className="text-[18px]">{projectData.pending}</b>
        </div>
      </div>
      {/* Charts */}
      <UserChart projectData={projectData} />
    </div>
  );
}

export default First;
