"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export function useAuthProtection() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/"); // لو مش مسجل دخول روح للصفحة الرئيسية
      } else {
        setLoading(false); // لو مسجل دخول خلي التحميل يخلص
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  return { loading };
}
