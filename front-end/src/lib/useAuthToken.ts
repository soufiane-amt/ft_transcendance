"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const STORAGE_KEY = "access_token";

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;

  const current = localStorage.getItem(STORAGE_KEY);
  // Normalize undefined/null
  const currentNorm = current === null ? null : current;
  const tokenNorm = token === null ? null : token;

  // If nothing changed, do nothing
  console.log("currentNorm:", currentNorm);
  console.log("tokenNorm:", tokenNorm);
  if (currentNorm === tokenNorm) return;

  if (token) {
    localStorage.setItem(STORAGE_KEY, token);
    Cookies.set(STORAGE_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_KEY);
    Cookies.remove(STORAGE_KEY);
  }
  // notify same-tab listeners
  window.dispatchEvent(new Event("auth-token-changed"));
}

export default function useAuthToken() {
  //   const [token, setToken] = useState<string | null>(() => {
  //     if (typeof window === "undefined") return null;
  //     return localStorage.getItem(STORAGE_KEY);
  //   });

  //   useEffect(() => {
  //     const onStorage = (e: StorageEvent) => {
  //       if (e.key !== STORAGE_KEY) return;
  //       const newVal = e.newValue; // string | null
  //       setToken((prev) => (prev === newVal ? prev : newVal));
  //     };

  //     const onCustom = () => {
  //       const newVal = localStorage.getItem(STORAGE_KEY);
  //       setToken((prev) => (prev === newVal ? prev : newVal));
  //     };

  //     window.addEventListener("storage", onStorage);
  //     window.addEventListener("auth-token-changed", onCustom);

  //     return () => {
  //       window.removeEventListener("storage", onStorage);
  //       window.removeEventListener("auth-token-changed", onCustom);
  //     };
  //   }, []);

  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4OTExNjczNC1lOWU5LTQwYTAtYWE5Ni1jNTZlYmZjZjVhZTYiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NjczNTgzOTYsImV4cCI6MTc2NzQ0NDc5Nn0.WpJyXJRjtNChi1s23t1SaYVAc6F2kEBV16-aCulCtb4";
}
