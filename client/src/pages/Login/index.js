import React, { useEffect, useRef } from "react";
import { Redirect, Link } from "react-router-dom";
import { useStoreContext } from "../../utils/GlobalStore";
import fetchJSON from "../../utils/API";
import OAuth from "../../components/OAuth";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer/index";
import "./index.css";
import Logo from "../../components/Logo/Logo";

function Login() {
  const [{ authOk }, dispatch] = useStoreContext();

  const inputEmail = useRef();
  const inputPassword = useRef();
  const inputRememberMe = useRef();
  const refForm = useRef();

  function userLoginSave({ status, session, userData, message }) {
    // login ok, saving session & saving userData
    console.log(`[userLoginSave] data:`, userData);
    if (!status) {
      // clear any session
      localStorage.session = "";
      dispatch({ type: "ALERT_MESSAGE", message });
      return;
    }
    localStorage.session = session;
    dispatch({ type: "USER_LOGIN", data: userData });
  }

  async function userLogin(e) {
    e.preventDefault();
    console.log("[userLogin]");

    // leverage browser built in + bootstrap features for form validation
    if (!refForm.current.checkValidity()) {
      refForm.current.classList.add("was-validated");
      return;
    }

    const saveData = {
      email: inputEmail.current.value,
      password: inputPassword.current.value,
      rememberMe: inputRememberMe.current.checked,
    };

    if (saveData.email.indexOf("@") < 3 || saveData.password.length < 8) {
      inputEmail.current.focus();
      dispatch({
        type: "ALERT_MESSAGE",
        message: "Please complete your form!",
      });
      return;
    }

    const { status, session, userData, message } = await fetchJSON(
      "/api/users/login",
      "post",
      saveData
    );

    // remember email if user wanted
    if (inputRememberMe && inputRememberMe.current.checked) {
      localStorage.email = inputEmail.current.value;
    } else {
      localStorage.email = "";
    }

    userLoginSave({ status, session, userData, message });
  }

  // at startup we initialize a few things
  useEffect(function () {
    inputEmail.current.value = localStorage.email || "";
    inputRememberMe.current.checked = true;
    document.body.style.backgroundColor = "#39ac73"; // Set the style
  }, []);

  return (
    <>
      <div className="background">
        <NavBar />
        <Logo />
        {authOk ? <Redirect to="/products" /> : ""}
        <form ref={refForm}>
          <div className="card mt-5">
            <div className="card-header bg-light">
              <h2 className="text-center bg-light">LOGIN</h2>
            </div>
            <div className="card-body bg-light">
              <div className="mb-3 bg-light">
                <label for="email" className="form-label bg-light">
                  Email address
                </label>
                <input
                  ref={inputEmail}
                  id="email"
                  type="email"
                  className="form-control bg-light"
                  required
                />
                <div className="invalid-feedback bg-light">
                  Please enter your login email
                </div>
              </div>
              <div className="mb-3 bg-light">
                <label className="bg-light" for="userPassword">Password</label>
                <input
                  ref={inputPassword}
                  id="userPassword"
                  type="password"
                  className="form-control bg-light"
                  pattern=".{8,}"
                  required
                />
                <div className="invalid-feedback bg-light">
                  Please enter your password (8 chars min)
                </div>
              </div>
            </div>
            <div className="card-footer bg-light">
              <button
                onClick={userLogin}
                type="button"
                className="btn mx-1 bg-secondary text-white"
              >
                Login
              </button>
              <Link to="/register" className="btn btn-secondary mx-3" id="register">
                Register
              </Link>
              &nbsp;
              <input ref={inputRememberMe} id="rememberMe" type="checkbox" />
              <label className="text-secondary" for="rememberMe">
                Remember Me
              </label>{" "}
              &nbsp;

            </div>
            <OAuth
              providers={[
                "twitter",
                "facebook",
                "github",
                "google",
                "linkedin",
              ]}
              userLoginComplete={userLoginSave}
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
