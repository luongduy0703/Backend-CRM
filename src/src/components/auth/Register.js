import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const BACKEND_URL = "http://localhost:8080";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword, terms } = form;
    if (!username || !email || !password || !confirmPassword) {
      alert("Hãy điền đầy đủ thông tin!");
      return;
    }
    if (!terms) {
      alert("Bạn phải đồng ý với điều khoản và dịch vụ");
      return;
    }
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/req/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (res.ok) {
        alert("Đăng ký thành công! Hãy kiểm tra email để xác minh tài khoản.");
        navigate("/login");
      } else {
        const msg = await res.text();
        alert(msg);
      }
    } catch {
      alert("Mạng lỗi!");
    }
    setSubmitting(false);
  };

  // Social login handlers
  const handleSocial = (provider) => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="login-container">
      <h1>Đăng ký</h1>
      <p className="description">Tạo tài khoản</p>
      <form id="register-form" autoComplete="off" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <div className="input-icon">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Hãy điền username"
              required
              value={form.username}
              onChange={handleChange}
              autoFocus
            />
          </div>
        </div>
        <div className="form-group">
          <label>Địa chỉ email</label>
          <div className="input-icon">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Hãy điền email của bạn"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="input-icon">
            <input
              type={showPw ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              required
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="icon toggle-password"
              id="togglePassword"
              style={{ userSelect: "none" }}
              onClick={() => setShowPw((v) => !v)}
              dangerouslySetInnerHTML={{
                __html: showPw
                  ? '<img src="/eye-off.svg" alt="Hide password"/>'
                  : '<img src="/eye.svg" alt="Show password"/>',
              }}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Xác nhận mật khẩu</label>
          <div className="input-icon">
            <input
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Xác nhận mật khảu của bạn"
              required
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <span
              className="icon toggle-password"
              id="toggleConfirmPassword"
              style={{ userSelect: "none" }}
              onClick={() => setShowConfirm((v) => !v)}
              dangerouslySetInnerHTML={{
                __html: showConfirm
                  ? '<img src="/eye-off.svg" alt="Hide password"/>'
                  : '<img src="/eye.svg" alt="Show password"/>',
              }}
            />
          </div>
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={form.terms}
            onChange={handleChange}
            required
          />
          <label htmlFor="terms">
            Tôi đồng ý với <a href="#">Điều khoản & dịch vụ</a>
          </label>
        </div>
        <button type="submit" className="signin-btn" disabled={submitting}>
          {submitting ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
      <div className="create-account">
        Đã có tài khoản?{" "}
        <a
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            navigate("/login");
          }}
        >
          Đăng nhập
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

export default Register;