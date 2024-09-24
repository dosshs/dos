import { useState } from "react";
import { URL } from "../../App";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import ForgetPassword from "./ForgetPasswordForm";

const LoginForm = ({
  handleIsLoggedIn,
  isForgotPassword,
  handleToggleForgotPassword,
}) => {
  const storedUsernameOrEmail = Cookies.get("emailOrUsername");
  const [usernameOrEmail, setUsernameOrEmail] = useState(
    storedUsernameOrEmail ? storedUsernameOrEmail : ""
  );
  const [loginBtnMsg, setLoginBtnMsg] = useState("LOG IN");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [userId, setUserId] = useState("");
  const [isRememberMe, setIsRememberMe] = useState(false);

  async function handleLogInSubmit(e) {
    setErrorMsg("");
    setSuccessMsg("");
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      setErrorMsg("Please fill out the fields");
      return;
    }

    const user = {
      emailOrUsername: usernameOrEmail,
      password: password,
    };

    try {
      setLoginBtnMsg("LOGGING IN");

      const res = await axios.post(`${URL}/auth/login`, user);
      const User = jwtDecode(res.data.token);
      const parsedUser = JSON.parse(User.user);
      console.log(parsedUser);
      if (parsedUser.nameValid && parsedUser.emailValid) {
        Cookies.set("token", res.data.token, { expires: 30 * 24 * 60 * 60 }); // 30 day expiration
        Cookies.set("userId", parsedUser._id, { expires: 30 * 24 * 60 * 60 }); // 30 day expiration
        if (isRememberMe)
          Cookies.set("emailOrUsername", usernameOrEmail, {
            expires: 30 * 24 * 60 * 60,
          });
        setSuccessMsg("Logged In Successfully");
        setTimeout(() => {
          handleIsLoggedIn();
        }, 1000);
      } else if (!parsedUser.nameValid) {
        Cookies.set("tempToken", res.data.token, {
          expires: 24 * 60 * 60,
        }); // 1 day expiration
        setUserId(parsedUser._id);
        setEmail(parsedUser.email);
        setUsername(parsedUser.username);
        setErrorMsg("");
      } else if (!parsedUser.emailValid) {
        Cookies.set("tempToken", res.data.token, {
          expires: 24 * 60 * 60,
        }); // 1 day expiration
        setUserId(parsedUser._id);
        try {
          const emailRes = await axios.put(`
            ${URL}/mail/signup/${userId}
              `);
          setVerificationCode(emailRes.data.verificationToken);
        } catch (err) {
          return console.error(err);
        }
        setEmail(parsedUser.email);
        setUsername(parsedUser.username);
        setCode("");
      }
    } catch (err) {
      setLoginBtnMsg("LOG IN");
      setErrorMsg("something went wrong");
      return setErrorMsg(err.response.data.message);
    }
  }

  return (
    <>
      {isForgotPassword ? (
        <ForgetPassword
          storedUsernameOrEmail={storedUsernameOrEmail}
          handleToggleForgotPassword={handleToggleForgotPassword}
        />
      ) : (
        <>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => {
              setUsernameOrEmail(e.target.value);
            }}
            placeholder="Enter your username or email "
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Enter your password"
          />

          <div className="utils-container">
            <label htmlFor="remember-me">
              {" "}
              <input
                className="accent-loginBlue"
                type="checkbox"
                name="isRememberMe"
                id="remember-me"
                value={isRememberMe}
                onChange={(e) => {
                  setIsRememberMe(e.target.checked);
                }}
              />{" "}
              Remember Me
            </label>
            <p
              className="cursor-pointer text-loginBlue hover:underline"
              onClick={handleToggleForgotPassword}
            >
              {!isForgotPassword ? "Forgot Password" : "Return to Login"}
            </p>
          </div>

          <p className="--server-msg">{errorMsg}</p>
          <p className="--server-success-msg">{successMsg}</p>

          <button
            className="bg-loginBlue text-loginWhite  p-1 w-28 rounded-full shadow-md"
            onClick={handleLogInSubmit}
          >
            {loginBtnMsg}
          </button>
        </>
      )}
    </>
  );
};

export default LoginForm;
