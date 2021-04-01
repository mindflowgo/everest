import React, { useRef, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import { useStoreContext } from "../../utils/GlobalStore";
import fetchJSON from "../../utils/API";
import "./index.css";
import paw from "./Assets/greenPaw.png";
import Footer from "../../components/Footer/index.js"

function Register() {
  const [{ authOk }, dispatch] = useStoreContext();

  const inputEmail = useRef();
  const inputPassword = useRef();
  const inputName = useRef();
  const refForm = useRef();

  async function registerUser(e) {
    e.preventDefault();

    // leverage browser built in + bootstrap features for form validation
    if (!refForm.current.checkValidity()) {
      refForm.current.classList.add("was-validated");
      return;
    }

    const regData = {
      name: inputName.current.value.trim(),
      email: inputEmail.current.value.trim(),
      password: inputPassword.current.value.trim(),
    };
    // double-check the browser form validation
    if (
      regData.name.length < 3 ||
      regData.email.indexOf("@") < 3 ||
      regData.password.length < 8
    ) {
      inputName.current.focus();
      dispatch({
        type: "ALERT_MESSAGE",
        message: "Please complete your reg info",
      });
      return;
    }

    const { status, session, userData, message } = await fetchJSON(
      "/api/users/register",
      "post",
      regData
    );
    if (!status) {
      // clear any session
      localStorage.session = "";
      dispatch({ type: "ALERT_MESSAGE", message });
      return;
    }

    // notify user message; set user session/data
    localStorage.session = session;
    dispatch({ type: "USER_LOGIN", data: userData, message });
  }

  useEffect(function () {
    // if remembered email, insert
    inputEmail.current.value = localStorage.email || "";
   document.body.style.backgroundColor = "white"; // Set the style
   }, []);

  return (
    <>
      {authOk ? <Redirect to="/products" /> : ""}
      <div id="background">
      <form ref={refForm}>
        <h1 id="logo" className="container">
          <img src={paw}></img>
          Woofr
        </h1>
        <div id="userR" className="card mt-5">
          <div className="card-header">
            <h2 id="reg">User Registration</h2>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="title" for="name">First Name</label>
              <input
                ref={inputName}
                type="text"
                id="name"
                className="form-control"
                required
              />
              <div className="invalid-feedback">Please enter a name</div>
            </div>
            <div className="mb-3">
              <label className="title" for="email">Email Address</label>
              <input
                ref={inputEmail}
                id="email"
                type="email"
                className="form-control"
                required
              />
              <div className="invalid-feedback">Please enter an email</div>
            </div>
            <div className="mb-3">
              <label className="title" for="userPassword">Password</label>
              <input
                ref={inputPassword}
                id="userPassword"
                type="password"
                className="form-control"
                pattern=".{8,}"
                required
              />
              <div className="invalid-feedback">
                Please enter a password (8 chars min)
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button onClick={registerUser} className="btn btn-secondary mx-1">
              Register
            </button>
            <Link
              to="/login"
              className="font-weight-light mx-3"
              id="register"
            >
              Already Registered?
            </Link>
          </div>
        </div>
      </form>
      </div>
    </>
  );
}

export default Register;
