"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/useAuthToken";
import Link from "next/link";
import styles from "./register.module.css";

type FormErrors = {
  [key: string]: string | undefined;
};  

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [serverError, setServerError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const router = useRouter();

  // Simple validation logic
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case "username":
        if (!value) return "Username is required";
        if (value.length < 3) return "Username must be at least 3 characters";
        if (value.length > 20) return "Username must be max 20 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Only letters, numbers, and underscores allowed";
        break;
      case "firstname":
        if (!value) return "First name is required";
        if (value.length < 2) return "First name is too short";
        break;
      case "lastname":
        if (!value) return "Last name is required";
        if (value.length < 2) return "Last name is too short";
        break;
      case "email":
        if (!value) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email address";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value)) return "Must contain an uppercase letter";
        if (!/[a-z]/.test(value)) return "Must contain a lowercase letter";
        if (!/[0-9]/.test(value)) return "Must contain a number";
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

  const getPasswordStrength = () => {
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    return checks.filter(Boolean).length;
  };

  const getStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  const getStrengthClass = () => {
    const strength = getPasswordStrength();
    if (strength <= 2) return styles.strength_weak;
    if (strength <= 3) return styles.strength_fair;
    if (strength <= 4) return styles.strength_good;
    return styles.strength_strong;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setIsLoading(true);

    // Validate all fields
    const fields = { username, firstname, lastname, email, password };
    const errors: FormErrors = {};
    Object.entries(fields).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) errors[field] = error;
    });

    setFormErrors(errors);
    setTouched({
      username: true,
      firstname: true,
      lastname: true,
      email: true,
      password: true,
    });

    if (Object.keys(errors).length > 0) {
      setIsLoading(false);
      return;
    }

    try {
      const r = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        }
      );
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Register failed");
      setAuthToken(data.access_token);
      // Redirect to upload picture page after successful registration
      router.push("/auth/upload-picture");
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

      {/* Left Panel - Branding */}
      {/* Right Panel - Form */}
      <div className={styles.form_panel}>
        <div className={styles.form_wrapper}>
          {/* Mobile logo */}
          <div className={styles.mobile_logo}>
            <div className={styles.logo_icon_small}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className={styles.logo_text_small}>ft_transcendence</span>
          </div>

          {/* Form card */}
          <div className={styles.form_card}>
            <div className={styles.form_header}>
              <h2 className={styles.form_title}>Create Account</h2>
              <p className={styles.form_subtitle}>Join the community today</p>
            </div>

            {/* Server error */}
            {serverError && (
              <div className={styles.error_banner}>
                <svg className={styles.error_icon} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p>{serverError}</p>
              </div>
            )}

            <form onSubmit={submit} className={styles.form}>
              {/* Username */}
              <div className={styles.field}>
                <label className={styles.label}>Username</label>
                <div className={styles.input_wrapper}>
                  <div className={styles.input_icon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    className={getInputClass("username", username)}
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (touched.username) {
                        const error = validateField("username", e.target.value);
                        setFormErrors((prev) => ({ ...prev, username: error }));
                      }
                    }}
                    onBlur={() => handleBlur("username", username)}
                    disabled={isLoading}
                  />
                  {getFieldStatus("username", username) === "success" && (
                    <div className={styles.success_icon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
                {formErrors.username && touched.username && (
                  <p className={styles.field_error}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formErrors.username}
                  </p>
                )}
              </div>

              {/* Name row */}
              <div className={styles.name_row}>
                {/* First name */}
                <div className={styles.field}>
                  <label className={styles.label}>First Name</label>
                  <div className={styles.input_wrapper}>
                    <div className={styles.input_icon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                      </svg>
                    </div>
                    <input
                      className={getInputClass("firstname", firstname)}
                      placeholder="John"
                      value={firstname}
                      onChange={(e) => {
                        setFirstname(e.target.value);
                        if (touched.firstname) {
                          const error = validateField("firstname", e.target.value);
                          setFormErrors((prev) => ({ ...prev, firstname: error }));
                        }
                      }}
                      onBlur={() => handleBlur("firstname", firstname)}
                      disabled={isLoading}
                    />
                  </div>
                  {formErrors.firstname && touched.firstname && (
                    <p className={styles.field_error}>{formErrors.firstname}</p>
                  )}
                </div>

                {/* Last name */}
                <div className={styles.field}>
                  <label className={styles.label}>Last Name</label>
                  <div className={styles.input_wrapper}>
                    <div className={styles.input_icon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="10" r="3" />
                        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                      </svg>
                    </div>
                    <input
                      className={getInputClass("lastname", lastname)}
                      placeholder="Doe"
                      value={lastname}
                      onChange={(e) => {
                        setLastname(e.target.value);
                        if (touched.lastname) {
                          const error = validateField("lastname", e.target.value);
                          setFormErrors((prev) => ({ ...prev, lastname: error }));
                        }
                      }}
                      onBlur={() => handleBlur("lastname", lastname)}
                      disabled={isLoading}
                    />
                  </div>
                  {formErrors.lastname && touched.lastname && (
                    <p className={styles.field_error}>{formErrors.lastname}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <div className={styles.input_wrapper}>
                  <div className={styles.input_icon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <input
                    className={getInputClass("email", email)}
                    placeholder="john@example.com"
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
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
                {formErrors.email && touched.email && (
                  <p className={styles.field_error}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <div className={styles.input_wrapper}>
                  <div className={styles.input_icon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    className={`${getInputClass("password", password)} ${styles.password_input}`}
                    placeholder="Create a strong password"
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
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {formErrors.password && touched.password && (
                  <p className={styles.field_error}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {formErrors.password}
                  </p>
                )}

                {/* Password strength */}
                {password && (
                  <div className={styles.password_strength}>
                    <div className={styles.strength_bars}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`${styles.strength_bar} ${
                            getPasswordStrength() >= level ? getStrengthClass() : ""
                          }`}
                        />
                      ))}
                    </div>
                    <div className={styles.strength_info}>
                      <span className={styles.strength_label}>Password strength</span>
                      <span className={`${styles.strength_text} ${getStrengthClass()}`}>
                        {getStrengthText()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`${styles.submit_button} ${isLoading ? styles.submit_loading : ""}`}
              >
                {isLoading ? (
                  <span className={styles.button_loading}>
                    <svg className={styles.spinner} viewBox="0 0 24 24" fill="none">
                      <circle className={styles.spinner_track} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className={styles.spinner_head} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating your account...
                  </span>
                ) : (
                  <span className={styles.button_content}>
                    Create Account
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                )}
              </button>

              {/* Login link */}
              <p className={styles.login_link}>
                Already have an account?{" "}
                <Link href="/auth/login" className={styles.login_link_anchor}>
                  Sign in
                </Link>
              </p>
            </form>
          </div>

          {/* Footer */}
          <p className={styles.footer}>
            By creating an account, you agree to our{" "}
            <Link href="/terms" className={styles.footer_link}>Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className={styles.footer_link}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}