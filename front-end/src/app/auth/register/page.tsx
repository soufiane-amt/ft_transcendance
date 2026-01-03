"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/useAuthToken";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            firstname,
            lastname,
            email,
            password,
          }),
        }
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Register failed");
      setAuthToken(data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0149]">
      <form
        onSubmit={submit}
        className="bg-white p-8 rounded shadow-md w-[420px]"
      >
        <h2 className="text-2xl mb-4">Register</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input
          className="w-full p-2 mb-3 border"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 border"
          placeholder="First name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 border"
          placeholder="Last name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 border"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 border"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-[#DA343E] text-white p-2">Sign up</button>
      </form>
    </div>
  );
}
