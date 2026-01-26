"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../register/register.module.css"; // Reuse your styles if you want
import Cookies from "js-cookie";

export default function UploadPicturePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const JwtToken = Cookies.get("access_token");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError("Please select an image file.");
      setFile(null);
      setPreview(null);
      return;
    }
    if (selected.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB.");
      setFile(null);
      setPreview(null);
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please select a picture to upload.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Replace with your backend endpoint
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/auth/upload-picture`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        },
      );

      if (!res.ok) {
        let errorMsg = "Upload failed";
        try {
          const data = await res.json();
          errorMsg = data.message || errorMsg;
        } catch {
          // If response is not JSON, keep default message
        }
        setError("Failed to upload image. " + errorMsg);
        return;
      }

      // Redirect to dashboard or next step
      router.push("/dashboard");
    } catch (err: any) {
      setError("Failed to upload image. " + (err.message || "Upload failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.form_panel}>
        <div className={styles.form_wrapper}>
          <div className={styles.form_card}>
            <div className={styles.form_header}>
              <h2 className={styles.form_title}>Upload Profile Picture</h2>
              <p className={styles.form_subtitle}>
                Add a profile picture to complete your registration.
              </p>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      objectFit: "cover",
                      margin: "0 auto 1rem",
                      border: "3px solid #6366f1",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background: "#22223b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1rem",
                      color: "#6366f1",
                      fontSize: "2.5rem",
                    }}
                  >
                    <svg
                      width="48"
                      height="48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="24" cy="24" r="22" />
                      <circle cx="24" cy="20" r="8" />
                      <path d="M12 40c2-6 8-10 12-10s10 4 12 10" />
                    </svg>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.submit_button}
                  style={{ marginBottom: "1rem" }}
                  onClick={() => inputRef.current?.click()}
                  disabled={isLoading}
                >
                  Choose Picture
                </button>
                {error && (
                  <p className={styles.field_error} style={{ marginTop: 0 }}>
                    {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className={styles.submit_button}
                disabled={isLoading || !file}
              >
                {isLoading ? "Uploading..." : "Upload & Continue"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
