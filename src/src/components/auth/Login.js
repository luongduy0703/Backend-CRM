import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import './login.css';

const BACKEND_URL = 'http://localhost:8080';

const Login = () => {
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const remember = e.target.remember.checked;
    if (!email || !password) {
      alert('Please enter your email and password!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/req/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const { token } = await res.json();
        if (remember) localStorage.setItem('token', token);
        else sessionStorage.setItem('token', token);

        const userRes = await fetch(`${BACKEND_URL}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          const userWithRole = { ...userData.user, role: userData.role };
          localStorage.setItem('user', JSON.stringify(userWithRole));
          message.success('Đăng nhập thành công');
          navigate('/dashboard');
        } else {
          alert('Không thể lấy thông tin người dùng!');
        }
      } else {
        const msg = await res.text();
        alert(msg);
      }
    } catch (err) {
      alert('Network error!');
    }
    setLoading(false);
  };

  // Social login handlers
  const handleSocial = (provider) => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h1>Đăng nhập</h1>
        <p className="description">Đăng nhập sử dụng email và mật khẩu.</p>
        <form id="login-form" autoComplete="off" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-icon">
              <input type="email" name="email" placeholder="Nhập địa chỉ email" required />
              <span className="icon">@</span>
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-icon">
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                placeholder="Nhập mật khẩu"
                required
              />
              <span
                className="icon toggle-password"
                id="togglePassword"
                style={{ userSelect: 'none' }}
                onClick={() => setShowPw((v) => !v)}
                dangerouslySetInnerHTML={{
                  __html: showPw
                    ? '<img src="/eye-off.svg" alt="Hide password"/>'
                    : '<img src="/eye.svg" alt="Show password"/>'
                }}
              />
            </div>
          </div>
          <div className="options">
            <div className="remember-me">
              <input type="checkbox" id="remember" name="remember" style={{ accentColor: '#ed1b24' }} />
              <label htmlFor="remember">Ghi nhớ tôi</label>
            </div>
            <a href="/forgot-password" className="forgot-password" style={{ color: '#ed1b24' }}>
              Quên mật khẩu?
            </a>
          </div>
          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="create-account">
          <strong>Bạn là người mới?</strong> <a href="/register">Tạo tài khoản</a>
        </div>
        <div className="or-divider">HOẶC</div>
        <div className="social-login">
          <button className="social-btn fb" type="button" onClick={() => handleSocial('facebook')}>
            <img src="/facebook.svg" alt="fb" /> Facebook
          </button>
          <button className="social-btn gg" type="button" onClick={() => handleSocial('google')}>
            <img src="/google.svg" alt="gg" /> Google
          </button>
          <button className="social-btn apple" type="button" onClick={() => handleSocial('apple')}>
            <img src="/apple.svg" alt="apple" /> Apple
          </button>
        </div>
        <div className="footer">Copyright © 2025 - CRMS</div>
      </div>
    </div>
  );
};

export default Login;