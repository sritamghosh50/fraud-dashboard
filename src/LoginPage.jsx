import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { api } from './api';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  /*
   * =========================================================
   * GOOGLE / GITHUB OAUTH
   * =========================================================
   *
   * IMPORTANT:
   * We are NOT using Firebase here.
   *
   * The request goes directly to our Spring Boot backend:
   *
   * Google:
   * http://localhost:8080/oauth2/authorization/google
   *
   * GitHub:
   * http://localhost:8080/oauth2/authorization/github
   *
   * Spring Boot handles the provider login and then redirects
   * back to:
   *
   * http://localhost:5173/oauth2/callback
   */
  function handleOAuthLogin(provider) {
    if (oauthLoading || loading) {
      return;
    }

    setError('');
    setOauthLoading(provider);

    window.location.href =
      `http://localhost:8080/oauth2/authorization/${provider}`;
  }

  /*
   * =========================================================
   * EMAIL / PASSWORD LOGIN
   * =========================================================
   */
  async function handleSubmit(e) {
    e.preventDefault();

    if (loading || oauthLoading) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result =
        mode === 'login'
          ? await api.login(email, password)
          : await api.register(
              email,
              password,
              fullName
            );

      const savedEmail =
        result.email || email;

      const savedFullName =
        result.fullName ||
        fullName ||
        email.split('@')[0];

      login(
        result.token,
        savedEmail,
        savedFullName
      );

      navigate('/');
    } catch (err) {
      setError(
        err?.message ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * =========================================================
   * LOGIN / SIGNUP SWITCH
   * =========================================================
   */
  function switchMode() {
    if (loading || oauthLoading) {
      return;
    }

    setMode(
      mode === 'login'
        ? 'signup'
        : 'login'
    );

    setError('');
    setPassword('');
  }

  return (
    <div className="auth-page">

      <div className="auth-shell">

        {/* =====================================================
            LEFT BRAND PANEL
        ====================================================== */}

        <section className="brand-panel">

          {/* Logo */}
          <div className="brand-header">

            <div className="brand-logo">
              <ShieldIcon />
            </div>

            <div>

              <div className="brand-name">
                FraudGuard <span>AI.</span>
              </div>

              <div className="brand-tagline">
                Detect&nbsp;&nbsp;·&nbsp;&nbsp;Analyze&nbsp;&nbsp;·&nbsp;&nbsp;Prevent
              </div>

            </div>

          </div>

          {/* Main content */}
          <div className="brand-main">

            <div className="brand-text">

              <h1>
                Smarter Fraud
                <br />
                Detection
                <br />
                for a Safer
                <br />
                Tomorrow
              </h1>

              <p>
                Detect fraud in real time across links,
                messages, and images. Powered by AI,
                ML, and LLMs, FraudGuard helps everyone
                stay safe online.
              </p>

            </div>

            {/* Illustration */}
            <div className="illustration">

              <div className="illustration-glow glow-a"></div>
              <div className="illustration-glow glow-b"></div>

              {/* Link bubble */}
              <div className="floating-bubble bubble-link">
                <LinkIcon />
              </div>

              {/* Message bubble */}
              <div className="floating-bubble bubble-message">
                <MessageIcon />
              </div>

              {/* Image bubble */}
              <div className="floating-bubble bubble-image">
                <ImageIcon />
              </div>

              {/* Laptop */}
              <div className="laptop">

                <div className="laptop-screen">

                  <div className="browser-bar">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="browser-content">

                    <div className="mini-screen-shield">
                      <ShieldIcon small />
                    </div>

                    <div className="screen-lines">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>

                  </div>

                </div>

                <div className="laptop-base">
                  <div className="laptop-trackpad"></div>
                </div>

              </div>

              {/* Large shield */}
              <div className="hero-shield">
                <ShieldIcon large />
              </div>

              {/* Shield check */}
              <div className="shield-check">
                <CheckIcon />
              </div>

            </div>

          </div>

          {/* Bottom features */}
          <div className="feature-row">

            <Feature
              icon={<ShieldIcon small />}
              title="Detect"
              subtitle="Scams"
            />

            <Feature
              icon={<LinkIcon />}
              title="Verify"
              subtitle="Links"
            />

            <Feature
              icon={<MessageIcon />}
              title="Analyze"
              subtitle="Messages"
            />

            <Feature
              icon={<ImageIcon />}
              title="Check"
              subtitle="Images"
            />

          </div>

          {/* Bottom slogan */}
          <div className="safe-world">
            <ShieldIcon tiny />
            <span>
              Together for a Safer Digital World
            </span>
          </div>

        </section>


        {/* =====================================================
            RIGHT LOGIN PANEL
        ====================================================== */}

        <section className="login-panel">

          <div className="login-card">

            {/* Small shield */}
            <div className="login-icon">
              <ShieldIcon small />
            </div>

            <h2>
              {mode === 'login'
                ? 'Welcome Back 👋'
                : 'Create Your Account'}
            </h2>

            <p className="login-subtitle">
              {mode === 'login'
                ? 'Login to your account to continue'
                : 'Join FraudGuard AI in a few seconds'}
            </p>


            {/* =================================================
                LOGIN / SIGNUP FORM
            ================================================== */}

            <form onSubmit={handleSubmit}>

              {/* Full name */}
              {mode === 'signup' && (
                <div className="form-field">

                  <label>
                    Full Name
                  </label>

                  <div className="input-box">

                    <UserIcon />

                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) =>
                        setFullName(e.target.value)
                      }
                      placeholder="Enter your full name"
                      required
                    />

                  </div>

                </div>
              )}


              {/* Email */}
              <div className="form-field">

                <label>
                  Email Address
                </label>

                <div className="input-box">

                  <MailIcon />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    required
                  />

                </div>

              </div>


              {/* Password */}
              <div className="form-field">

                <div className="password-header">

                  <label>
                    Password
                  </label>

                  {mode === 'login' && (
                    <button
                      type="button"
                      className="forgot-password"
                      onClick={() =>
                        setError(
                          'Password reset is not available yet.'
                        )
                      }
                    >
                      Forgot password?
                    </button>
                  )}

                </div>


                <div className="input-box">

                  <LockIcon />

                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />


                  <button
                    type="button"
                    className="eye-button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon />
                    ) : (
                      <EyeIcon />
                    )}
                  </button>

                </div>

              </div>


              {/* Remember me */}
              {mode === 'login' && (
                <label className="remember">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) =>
                      setRemember(e.target.checked)
                    }
                  />

                  <span className="checkbox"></span>

                  <span>
                    Remember me
                  </span>

                </label>
              )}


              {/* Error */}
              {error && (
                <div className="error-box">

                  <span>!</span>

                  <p>
                    {error}
                  </p>

                </div>
              )}


              {/* Submit */}
              <button
                type="submit"
                className="login-button"
                disabled={
                  loading ||
                  Boolean(oauthLoading)
                }
              >

                <span>
                  {loading
                    ? 'Please wait...'
                    : mode === 'login'
                      ? 'Login'
                      : 'Create Account'}
                </span>

                {!loading && (
                  <span className="arrow">
                    →
                  </span>
                )}

              </button>

            </form>


            {/* =================================================
                SWITCH ACCOUNT
            ================================================== */}

            <div className="switch-account">

              <span>
                {mode === 'login'
                  ? "Don't have an account?"
                  : 'Already have an account?'}
              </span>

              <button
                type="button"
                onClick={switchMode}
                disabled={
                  loading ||
                  Boolean(oauthLoading)
                }
              >
                {mode === 'login'
                  ? 'Sign Up'
                  : 'Login'}
              </button>

            </div>


            {/* =================================================
                OR
            ================================================== */}

            <div className="divider">

              <span></span>

              <small>
                OR
              </small>

              <span></span>

            </div>


            {/* =================================================
                GOOGLE / GITHUB
            ================================================== */}

            <div className="social-row">

              {/* Google */}
              <button
                type="button"
                onClick={() =>
                  handleOAuthLogin('google')
                }
                disabled={
                  loading ||
                  Boolean(oauthLoading)
                }
              >

                <GoogleIcon />

                <span>
                  {oauthLoading === 'google'
                    ? 'Connecting...'
                    : 'Google'}
                </span>

              </button>


              {/* GitHub */}
              <button
                type="button"
                onClick={() =>
                  handleOAuthLogin('github')
                }
                disabled={
                  loading ||
                  Boolean(oauthLoading)
                }
              >

                <GithubIcon />

                <span>
                  {oauthLoading === 'github'
                    ? 'Connecting...'
                    : 'GitHub'}
                </span>

              </button>

            </div>

          </div>

        </section>

      </div>


      {/* =======================================================
          CSS
      ======================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        /* =====================================================
           PAGE
        ====================================================== */

        .auth-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;

          padding: 12px;

          background:
            radial-gradient(
              circle at 10% 20%,
              rgba(80, 135, 255, 0.10),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 80%,
              rgba(112, 75, 240, 0.09),
              transparent 32%
            ),
            linear-gradient(
              135deg,
              #edf4ff 0%,
              #f7f9ff 50%,
              #f3efff 100%
            );

          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;

          color: #13255d;
        }


        /* =====================================================
           MAIN CONTAINER
        ====================================================== */

        .auth-shell {
          width: 100%;
          max-width: 1400px;

          min-height: 700px;
          height: calc(100vh - 24px);

          max-height: 850px;

          display: grid;
          grid-template-columns: 52% 48%;

          overflow: hidden;

          border-radius: 17px;

          background: rgba(255,255,255,0.84);

          border: 1px solid rgba(255,255,255,0.95);

          box-shadow:
            0 25px 70px rgba(53, 77, 135, 0.13),
            0 2px 10px rgba(53, 77, 135, 0.05);

          backdrop-filter: blur(20px);
        }


        /* =====================================================
           LEFT PANEL
        ====================================================== */

        .brand-panel {
          position: relative;

          overflow: hidden;

          padding:
            38px
            42px
            25px;

          background:
            radial-gradient(
              circle at 78% 30%,
              rgba(75, 145, 255, 0.12),
              transparent 27%
            ),
            radial-gradient(
              circle at 32% 85%,
              rgba(117, 78, 245, 0.09),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              #fafdff 0%,
              #eef5ff 55%,
              #f8f4ff 100%
            );

          border-right:
            1px solid #dfe7f5;
        }


        /* =====================================================
           BRAND HEADER
        ====================================================== */

        .brand-header {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .brand-logo {
          width: 38px;
          height: 43px;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-name {
          font-size: 23px;
          font-weight: 750;

          letter-spacing: -0.7px;

          color: #162963;
        }

        .brand-name span {
          color: #5361f4;
        }

        .brand-tagline {
          margin-top: 3px;

          font-size: 10px;

          color: #64739d;

          letter-spacing: 0.35px;
        }


        /* =====================================================
           BRAND MAIN
        ====================================================== */

        .brand-main {
          position: relative;

          height: 485px;

          margin-top: 5px;
        }

        .brand-text {
          position: absolute;

          z-index: 10;

          left: 0;
          top: 62px;

          width: 43%;
        }

        .brand-text h1 {
          margin: 0;

          font-size:
            clamp(
              31px,
              3.05vw,
              45px
            );

          line-height: 1.13;

          letter-spacing: -1.9px;

          font-weight: 760;

          color: #12255f;
        }

        .brand-text p {
          margin:
            27px
            0
            0;

          width: 100%;

          max-width: 420px;

          font-size: 13px;

          line-height: 1.8;

          color: #40527e;
        }


        /* =====================================================
           ILLUSTRATION
        ====================================================== */

        .illustration {
          position: absolute;

          right: -5px;
          top: 40px;

          width: 57%;
          height: 390px;
        }

        .illustration-glow {
          position: absolute;

          border-radius: 50%;

          filter: blur(1px);
        }

        .glow-a {
          width: 300px;
          height: 300px;

          right: 12px;
          top: 42px;

          background:
            radial-gradient(
              circle,
              rgba(72,139,255,0.16),
              rgba(72,139,255,0)
            );
        }

        .glow-b {
          width: 220px;
          height: 220px;

          right: 95px;
          top: 100px;

          background:
            radial-gradient(
              circle,
              rgba(123,78,245,0.11),
              rgba(123,78,245,0)
            );
        }


        /* =====================================================
           LAPTOP
        ====================================================== */

        .laptop {
          position: absolute;

          right: 18px;
          bottom: 17px;

          width: 255px;
          height: 185px;

          transform: rotate(-2deg);

          z-index: 3;
        }

        .laptop-screen {
          position: absolute;

          left: 17px;
          top: 0;

          width: 220px;
          height: 147px;

          border:
            7px solid #293d7d;

          border-radius:
            11px
            11px
            5px
            5px;

          background: #e8f0ff;

          overflow: hidden;

          box-shadow:
            0 15px 30px
            rgba(48, 70, 135, 0.20);
        }

        .browser-bar {
          height: 19px;

          display: flex;
          align-items: center;

          gap: 4px;

          padding-left: 8px;

          background: #f7f9ff;
        }

        .browser-bar span {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #a8b6d5;
        }

        .browser-content {
          height: 121px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 15px;

          background:
            linear-gradient(
              135deg,
              #dceaff,
              #f5f8ff
            );
        }

        .mini-screen-shield {
          width: 45px;
          height: 54px;
        }

        .screen-lines {
          display: flex;

          flex-direction: column;

          gap: 7px;
        }

        .screen-lines div {
          width: 52px;
          height: 6px;

          border-radius: 5px;

          background: #b5c6ec;
        }

        .screen-lines div:nth-child(2) {
          width: 39px;
        }

        .screen-lines div:nth-child(3) {
          width: 46px;
        }

        .laptop-base {
          position: absolute;

          left: 0;
          bottom: 0;

          width: 255px;
          height: 20px;

          border-radius:
            0
            0
            26px
            26px;

          background:
            linear-gradient(
              180deg,
              #8799c1,
              #61729e
            );

          box-shadow:
            0 9px 17px
            rgba(47,66,116,0.18);
        }

        .laptop-trackpad {
          width: 45px;
          height: 3px;

          border-radius: 4px;

          background: rgba(255,255,255,0.35);

          margin: 7px auto 0;
        }


        /* =====================================================
           LARGE SHIELD
        ====================================================== */

        .hero-shield {
          position: absolute;

          left: 42px;
          top: 68px;

          width: 128px;
          height: 148px;

          z-index: 5;

          filter:
            drop-shadow(
              0 15px 18px
              rgba(68,74,165,0.25)
            );
        }

        .shield-check {
          position: absolute;

          left: 83px;
          top: 119px;

          width: 51px;
          height: 51px;

          z-index: 7;

          display: flex;
          align-items: center;
          justify-content: center;

          color: white;
        }


        /* =====================================================
           FLOATING ICONS
        ====================================================== */

        .floating-bubble {
          position: absolute;

          width: 57px;
          height: 57px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background:
            rgba(255,255,255,0.93);

          border:
            1px solid #e2eaff;

          box-shadow:
            0 10px 25px
            rgba(64,95,164,0.14);

          z-index: 8;
        }

        .bubble-link {
          left: 28px;
          top: 26px;

          color: #3f70ff;
        }

        .bubble-message {
          right: -3px;
          top: 75px;

          color: #6750e8;
        }

        .bubble-image {
          right: 0;
          bottom: 50px;

          color: #23aa91;
        }


        /* =====================================================
           FEATURES
        ====================================================== */

        .feature-row {
          position: absolute;

          left: 42px;
          bottom: 58px;

          z-index: 20;

          display: flex;

          gap: 34px;
        }

        .feature {
          width: 65px;

          display: flex;
          flex-direction: column;

          align-items: center;

          text-align: center;
        }

        .feature-icon {
          width: 44px;
          height: 44px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: white;

          border:
            1px solid #dce5f8;

          color: #365eff;

          box-shadow:
            0 6px 16px
            rgba(72,98,155,0.09);
        }

        .feature-title {
          margin-top: 8px;

          font-size: 10px;

          font-weight: 700;

          color: #1e3066;
        }

        .feature-subtitle {
          margin-top: 2px;

          font-size: 10px;

          color: #66769e;
        }


        /* =====================================================
           SAFE WORLD
        ====================================================== */

        .safe-world {
          position: absolute;

          left: 42px;
          bottom: 18px;

          display: flex;

          align-items: center;

          gap: 7px;

          font-size: 11px;

          font-style: italic;

          color: #435578;
        }


        /* =====================================================
           RIGHT PANEL
        ====================================================== */

        .login-panel {
          display: flex;

          justify-content: center;
          align-items: center;

          padding:
            40px
            55px;

          background:
            rgba(255,255,255,0.88);
        }

        .login-card {
          width: 100%;
          max-width: 475px;
        }

        .login-icon {
          width: 47px;
          height: 47px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 14px;

          background:
            #edf2ff;

          margin-bottom: 17px;
        }

        .login-card h2 {
          margin: 0;

          font-size: 31px;

          line-height: 1.2;

          letter-spacing: -1px;

          font-weight: 750;

          color: #12245d;
        }

        .login-subtitle {
          margin:
            9px
            0
            35px;

          font-size: 14px;

          color: #7583a4;
        }


        /* =====================================================
           FORM
        ====================================================== */

        .form-field {
          margin-bottom: 19px;
        }

        .form-field label {
          display: block;

          margin-bottom: 8px;

          font-size: 12px;

          font-weight: 700;

          color: #293961;
        }

        .password-header {
          display: flex;

          justify-content: space-between;

          align-items: center;
        }

        .forgot-password {
          border: none;

          background: transparent;

          padding: 0;

          font-size: 11px;

          color: #4b4cff;

          cursor: pointer;
        }

        .input-box {
          height: 52px;

          display: flex;

          align-items: center;

          padding:
            0
            14px;

          background: white;

          border:
            1px solid #d9e1ef;

          border-radius: 10px;

          transition: 0.2s ease;
        }

        .input-box:focus-within {
          border-color: #5b5af5;

          box-shadow:
            0 0 0 3px
            rgba(91,90,245,0.08);
        }

        .input-box > svg {
          flex-shrink: 0;

          color: #91a0bd;
        }

        .input-box input {
          width: 100%;
          height: 100%;

          border: none;
          outline: none;

          background: transparent;

          padding:
            0
            10px;

          font-size: 13px;

          color: #26375f;
        }

        .input-box input::placeholder {
          color: #a4afc5;
        }

        .eye-button {
          border: none;

          background: transparent;

          color: #8796b4;

          cursor: pointer;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 2px;
        }


        /* =====================================================
           REMEMBER
        ====================================================== */

        .remember {
          display: flex;

          align-items: center;

          gap: 8px;

          margin:
            -3px
            0
            21px;

          color: #7382a2;

          font-size: 11px;

          cursor: pointer;
        }

        .remember input {
          display: none;
        }

        .checkbox {
          width: 15px;
          height: 15px;

          border:
            1px solid #d1d9ea;

          border-radius: 4px;

          background: white;
        }

        .remember input:checked + .checkbox {
          background: #5656f3;

          border-color: #5656f3;

          box-shadow:
            inset 0 0 0 3px white;
        }


        /* =====================================================
           ERROR
        ====================================================== */

        .error-box {
          display: flex;

          align-items: center;

          gap: 9px;

          padding:
            10px
            12px;

          margin-bottom: 16px;

          border:
            1px solid #ffd7de;

          border-radius: 8px;

          background: #fff3f5;

          color: #c52c48;

          font-size: 11px;
        }

        .error-box span {
          width: 17px;
          height: 17px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #e64d68;

          color: white;

          font-weight: 700;
        }

        .error-box p {
          margin: 0;
        }


        /* =====================================================
           LOGIN BUTTON
        ====================================================== */

        .login-button {
          width: 100%;
          height: 52px;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 8px;

          border: none;

          border-radius: 10px;

          background:
            linear-gradient(
              90deg,
              #515df4,
              #743de8
            );

          color: white;

          font-size: 13px;

          font-weight: 700;

          cursor: pointer;

          box-shadow:
            0 11px 23px
            rgba(83,72,224,0.20);

          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);

          box-shadow:
            0 14px 28px
            rgba(83,72,224,0.25);
        }

        .login-button:disabled {
          opacity: 0.65;

          cursor: not-allowed;
        }

        .arrow {
          font-size: 18px;

          line-height: 1;
        }


        /* =====================================================
           SWITCH ACCOUNT
        ====================================================== */

        .switch-account {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 5px;

          margin-top: 20px;

          font-size: 11px;

          color: #7b88a5;
        }

        .switch-account button {
          border: none;

          background: transparent;

          color: #4b4cff;

          font-size: 11px;

          font-weight: 700;

          cursor: pointer;
        }

        .switch-account button:disabled {
          opacity: 0.5;

          cursor: not-allowed;
        }


        /* =====================================================
           DIVIDER
        ====================================================== */

        .divider {
          display: flex;

          align-items: center;

          gap: 13px;

          margin:
            25px
            0
            17px;
        }

        .divider span {
          height: 1px;

          flex: 1;

          background: #e4e8f0;
        }

        .divider small {
          font-size: 9px;

          color: #a1abc0;
        }


        /* =====================================================
           SOCIAL
        ====================================================== */

        .social-row {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 11px;
        }

        .social-row button {
          height: 44px;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 8px;

          border:
            1px solid #dce3ee;

          border-radius: 9px;

          background: white;

          color: #344260;

          font-size: 11px;

          font-weight: 650;

          cursor: pointer;

          transition: 0.2s ease;
        }

        .social-row button:hover:not(:disabled) {
          background: #f8faff;

          border-color: #cbd6eb;
        }

        .social-row button:disabled {
          opacity: 0.6;

          cursor: not-allowed;
        }


        /* =====================================================
           RESPONSIVE
        ====================================================== */

        @media (max-width: 1050px) {

          .auth-shell {
            grid-template-columns: 1fr 1fr;
          }

          .brand-panel {
            padding-left: 30px;
            padding-right: 25px;
          }

          .brand-text {
            width: 48%;
          }

          .brand-text h1 {
            font-size: 34px;
          }

          .illustration {
            width: 57%;
            right: -20px;
          }

          .login-panel {
            padding:
              35px
              35px;
          }

        }


        @media (max-width: 800px) {

          .auth-page {
            padding: 0;
          }

          .auth-shell {
            height: auto;

            min-height: 100vh;

            max-height: none;

            border-radius: 0;

            grid-template-columns: 1fr;
          }

          .brand-panel {
            min-height: 650px;

            border-right: none;

            border-bottom:
              1px solid #dfe7f5;
          }

          .login-panel {
            min-height: 650px;
          }

        }


        @media (max-width: 560px) {

          .brand-panel {
            padding:
              25px
              22px;
          }

          .brand-main {
            height: 500px;
          }

          .brand-text {
            position: relative;

            top: 35px;

            width: 100%;
          }

          .brand-text h1 {
            font-size: 32px;
          }

          .brand-text p {
            max-width: 350px;
          }

          .illustration {
            top: 210px;

            right: -20px;

            width: 100%;

            transform: scale(0.78);

            transform-origin: top right;
          }

          .feature-row {
            left: 15px;

            gap: 15px;

            bottom: 58px;
          }

          .safe-world {
            display: none;
          }

          .login-panel {
            padding:
              35px
              22px;
          }

        }

      `}</style>

    </div>
  );
}


/* =========================================================
   FEATURE
========================================================= */

function Feature({
  icon,
  title,
  subtitle
}) {
  return (
    <div className="feature">

      <div className="feature-icon">
        {icon}
      </div>

      <div className="feature-title">
        {title}
      </div>

      <div className="feature-subtitle">
        {subtitle}
      </div>

    </div>
  );
}


/* =========================================================
   SHIELD
========================================================= */

function ShieldIcon({
  small = false,
  tiny = false,
  large = false
}) {
  const size =
    tiny
      ? 18
      : small
        ? 30
        : large
          ? 128
          : 39;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >

      <defs>

        <linearGradient
          id="shieldGradient"
          x1="20"
          y1="10"
          x2="80"
          y2="105"
          gradientUnits="userSpaceOnUse"
        >

          <stop
            stopColor="#5572FF"
          />

          <stop
            offset="0.55"
            stopColor="#5550EA"
          />

          <stop
            offset="1"
            stopColor="#7444E7"
          />

        </linearGradient>

      </defs>


      <path
        d="
          M50 5
          L91 20
          V53
          C91 79 74 101 50 110
          C26 101 9 79 9 53
          V20
          L50 5Z
        "
        fill="url(#shieldGradient)"
        stroke="#D4DEFF"
        strokeWidth="3"
      />


      <path
        d="
          M50 17
          L79 28
          V53
          C79 71 68 87 50 96
          C32 87 21 71 21 53
          V28
          L50 17Z
        "
        fill="rgba(255,255,255,0.12)"
      />


      {!tiny && (
        <path
          d="
            M35 56
            L45 66
            L66 43
          "
          stroke="white"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

    </svg>
  );
}


/* =========================================================
   CHECK
========================================================= */

function CheckIcon() {
  return (
    <svg
      width="31"
      height="31"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12l4 4L19 6" />
    </svg>
  );
}


/* =========================================================
   LINK
========================================================= */

function LinkIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
      />

      <path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
      />

    </svg>
  );
}


/* =========================================================
   MESSAGE
========================================================= */

function MessageIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <path
        d="M21 11.5a8.38 8.38 0 0 1-9 8.5a8.5 8.5 0 0 1-4-.98L3 21l1.98-4A8.5 8.5 0 1 1 21 11.5Z"
      />

      <path d="M8 11h.01" />
      <path d="M12 11h.01" />
      <path d="M16 11h.01" />

    </svg>
  );
}


/* =========================================================
   IMAGE
========================================================= */

function ImageIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
      />

      <circle
        cx="8.5"
        cy="8.5"
        r="1.5"
      />

      <path
        d="M21 15l-5-5L5 21"
      />

    </svg>
  );
}


/* =========================================================
   USER
========================================================= */

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path
        d="M4 21a8 8 0 0 1 16 0"
      />

    </svg>
  );
}


/* =========================================================
   MAIL
========================================================= */

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path
        d="M3 7l9 6l9-6"
      />

    </svg>
  );
}


/* =========================================================
   LOCK
========================================================= */

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <rect
        x="4"
        y="10"
        width="16"
        height="11"
        rx="2"
      />

      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
      />

    </svg>
  );
}


/* =========================================================
   EYE
========================================================= */

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <path
        d="
          M2 12
          S5.5 5 12 5
          S22 12 22 12
          S18.5 19 12 19
          S2 12 2 12Z
        "
      />

      <circle
        cx="12"
        cy="12"
        r="3"
      />

    </svg>
  );
}


/* =========================================================
   EYE OFF
========================================================= */

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <path d="M3 3l18 18" />

      <path
        d="
          M10.6 10.6
          A2 2 0 0 0
          13.4 13.4
        "
      />

      <path
        d="
          M9.9 5.2
          A10.8 10.8 0 0 1
          12 5
          C18.5 5 22 12 22 12
          A17.3 17.3 0 0 1
          19 15.8
        "
      />

      <path
        d="
          M6.6 6.6
          C3.6 8.5 2 12 2 12
          S5.5 19 12 19
          A10.8 10.8 0 0 0
          16.2 18.2
        "
      />

    </svg>
  );
}


/* =========================================================
   GOOGLE
========================================================= */

function GoogleIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
    >

      <path
        fill="#4285F4"
        d="
          M21.35 12.27
          C21.35 11.56 21.29 10.88 21.17 10.23
          H12V14.09
          H17.23
          A4.47 4.47 0 0 1 15.29 17.02
          V19.45
          H18.43
          C20.27 17.76 21.35 15.27 21.35 12.27Z
        "
      />

      <path
        fill="#34A853"
        d="
          M12 21.75
          C14.63 21.75 16.83 20.88 18.43 19.4
          L15.29 16.97
          C14.42 17.55 13.31 17.89 12 17.89
          C9.47 17.89 7.33 16.18 6.56 13.88
          H3.32
          V16.38
          A9.71 9.71 0 0 0 12 21.75Z
        "
      />

      <path
        fill="#FBBC05"
        d="
          M6.56 13.88
          A5.84 5.84 0 0 1 6.25 12
          C6.25 11.35 6.36 10.71 6.56 10.12
          V7.62
          H3.32
          A9.72 9.72 0 0 0 2.25 12
          C2.25 13.57 2.63 15.05 3.32 16.38
          L6.56 13.88Z
        "
      />

      <path
        fill="#EA4335"
        d="
          M12 6.11
          C13.43 6.11 14.72 6.6 15.73 7.57
          L18.53 4.77
          C16.82 3.2 14.62 2.25 12 2.25
          A9.71 9.71 0 0 0 3.32 7.62
          L6.56 10.12
          C7.33 7.82 9.47 6.11 12 6.11Z
        "
      />

    </svg>
  );
}


/* =========================================================
   GITHUB
========================================================= */

function GithubIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
    >

      <path
        d="
          M12 .5
          A11.5 11.5 0 0 0
          8.36 22.9
          C8.94 23 9.15 22.65 9.15 22.34
          V20.18
          C5.95 20.88 5.28 18.83
          5.28 18.83
          C4.75 17.49 3.98 17.13 3.98 17.13
          C2.92 16.4 4.06 16.41 4.06 16.41
          C5.23 16.49 5.85 17.61 5.85 17.61
          C6.89 19.4 8.58 18.88 9.25 18.58
          C9.35 17.82 9.66 17.31 9.99 17.02
          C7.44 16.73 4.76 15.74 4.76 11.34
          C4.76 10.09 5.21 9.07 5.96 8.27
          C5.84 7.97 5.44 6.82 6.07 5.25
          C6.07 5.25 7.05 4.94 9.24 6.42
          C11.05 5.92 12.95 5.92 14.76 6.42
          C16.96 4.94 17.93 5.25 17.93 5.25
          C18.56 6.82 18.16 7.97 18.04 8.27
          C18.79 9.07 19.24 10.09 19.24 11.34
          C19.24 15.75 16.55 16.73 14 17.01
          C14.42 17.37 14.79 18.07 14.79 19.15
          V22.32
          C14.79 22.63 15 22.98 15.59 22.88
          A11.5 11.5 0 0 0
          12 .5Z
        "
      />

    </svg>
  );
}