import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const BACKEND_URL = "http://localhost:8080";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter your email!");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/req/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        alert("If your email exists, you will receive password reset instructions.");
        navigate("/login");
      } else {
        const msg = await res.text();
        alert(msg);
      }
    } catch {
      alert("Network error!");
    }
    setSubmitting(false);
  };

  // Social login handlers
  const handleSocial = (provider) => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="login-container">
      <h1>Quên mật khẩu?</h1>
      <p className="description">
        Chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu qua email của bạn
      </p>
      <form id="forgot-form" autoComplete="off" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <div className="input-icon">
            <input
              type="email"
              id="email"
              placeholder="Nhập email của bạn"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <button type="submit" className="signin-btn" disabled={submitting}>
          {submitting ? "Nhập..." : "Nhập"}
        </button>
      </form>
      <div className="create-account">
        Quay về{" "}
        <a
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            navigate("/login");
          }}
        >
          đăng nhập
        </a>
      </div>
      <div className="or-divider">HOẶC</div>
      <div className="social-login">
        <button className="social-btn fb" type="button" onClick={() => handleSocial("facebook")}>
          <img src="/facebook.svg" alt="fb" /> Facebook
        </button>
        <button className="social-btn gg" type="button" onClick={() => handleSocial("google")}>
          <img src="/google.svg" alt="gg" /> Google
        </button>
        <button className="social-btn apple" type="button" onClick={() => handleSocial("apple")}>
          <img src="/apple.svg" alt="apple" /> Apple
        </button>
      </div>
      <div className="footer">Copyright © 2025 - CRMS</div>
    </div>
  );
};

export default ForgotPassword;