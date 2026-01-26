"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/useAuthToken";
import Link from "next/link";
import styles from "./login.module.css";

type FormErrors = {
  [key: string]: string | undefined;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [serverError, setServerError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const router = useRouter();

  // Simple validation logic
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email address";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        break;
      default:
        break;
    }
    return undefined;
  };

  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setFormErrors({});
    setIsLoading(true);

    // Validate all fields
    const errors: FormErrors = {};
    errors.email = validateField("email", email);
    errors.password = validateField("password", password);

    setFormErrors(errors);
    setTouched({ email: true, password: true });

    if (errors.email || errors.password) {
      setIsLoading(false);
      return;
    }

    console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_SERV);
    console.log(
      "Full URL:",
      `${process.env.NEXT_PUBLIC_BACKEND_SERV}/auth/login/local`
    );

    try {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/auth/login/local`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Login failed");
      setAuthToken(data.access_token);
      router.push("/dashboard");
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const getFieldStatus = (field: string, value: string) => {
    if (!touched[field]) return "default";
    if (formErrors[field]) return "error";
    if (value.length > 0) return "success";
    return "default";
  };

  const getInputClass = (field: string, value: string) => {
    const status = getFieldStatus(field, value);
    let className = styles.input;
    if (status === "error") className += ` ${styles.input_error}`;
    if (status === "success") className += ` ${styles.input_success}`;
    return className;
  };

  return (
    <div className={styles.page}>
      {/* Animated background */}
      <div className={styles.background}>
        <div className={styles.bg_circle_1}></div>
        <div className={styles.bg_circle_2}></div>
        <div className={styles.bg_circle_3}></div>
      </div>

      {/* Right Panel - Form */}
      <div className={styles.form_panel}>
        <div className={styles.form_wrapper}>
          {/* Mobile logo */}
          <div className={styles.mobile_logo}>
            <div className={styles.logo_icon_small}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className={styles.logo_text_small}>ft_transcendence</span>
          </div>

          {/* Form card */}
          <div className={styles.form_card}>
            <div className={styles.form_header}>
              <h2 className={styles.form_title}>Sign In</h2>
              <p className={styles.form_subtitle}>
                Enter your credentials to continue
              </p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className={styles.error_banner}>
                <svg
                  className={styles.error_icon}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{serverError}</p>
              </div>
            )}

            <form onSubmit={submit} className={styles.form}>
              {/* Email */}
              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <div className={styles.input_wrapper}>
                  <div className={styles.input_icon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <input
                    className={getInputClass("email", email)}
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email) {
                        const error = validateField("email", e.target.value);
                        setFormErrors((prev) => ({ ...prev, email: error }));
                      }
                    }}
                    onBlur={() => handleBlur("email", email)}
                    disabled={isLoading}
                  />
                  {getFieldStatus("email", email) === "success" && (
                    <div className={styles.success_icon}>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
                {formErrors.email && touched.email && (
                  <p className={styles.field_error}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className={styles.field}>
                <div className={styles.label_row}>
                  <label className={styles.label}>Password</label>
                </div>
                <div className={styles.input_wrapper}>
                  <div className={styles.input_icon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    className={`${getInputClass("password", password)} ${
                      styles.password_input
                    }`}
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password) {
                        const error = validateField("password", e.target.value);
                        setFormErrors((prev) => ({ ...prev, password: error }));
                      }
                    }}
                    onBlur={() => handleBlur("password", password)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.password_toggle}
                  >
                    {showPassword ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {formErrors.password && touched.password && (
                  <p className={styles.field_error}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className={styles.remember_row}>
                <label className={styles.checkbox_label}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkbox_custom}></span>
                  <span className={styles.checkbox_text}>Remember me</span>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`${styles.submit_button} ${
                  isLoading ? styles.submit_loading : ""
                }`}
              >
                {isLoading ? (
                  <span className={styles.button_loading}>
                    <svg
                      className={styles.spinner}
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className={styles.spinner_track}
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className={styles.spinner_head}
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className={styles.button_content}>
                    Sign In
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                )}
              </button>

              {/* Register link */}
              <p className={styles.register_link}>
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className={styles.register_link_anchor}
                >
                  Create one
                </Link>
              </p>
            </form>
          </div>

          {/* Footer */}
          <p className={styles.footer}>
            By signing in, you agree to our{" "}
            <Link href="/terms" className={styles.footer_link}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className={styles.footer_link}>
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
