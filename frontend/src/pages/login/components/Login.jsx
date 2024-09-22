import { useState, useEffect } from "react";
import useToggle from "../../../components/hooks/useToggle";
import { Navigate } from "react-router-dom";

import "../stylesheets/Login.css";

import { Helmet, HelmetProvider } from "react-helmet-async";
import { jwtDecode } from "jwt-decode";
import AuthenticationModal from "../../../reusable-components/edituser/AuthenticationModal";
import TermsConditions from "../../../components/login/TermsConditions";
import { URL } from "../../../App";

import LoginForm from "../../../components/login/LoginForm";
import SignupForm from "../../../components/login/SignupForm";

export default function Login({}) {
  const storedValue = localStorage.getItem("isInSignInPage");
  const [isInSignInPage, setIsInSignInPage] = useState(
    storedValue === null ? true : JSON.parse(storedValue)
  );

  const [isTermsConditionsOpen, toggleIsTermsConditionOpen] = useToggle();
  const [isLoggedIn, toggleIsLoggedIn] = useToggle();

  //Recover Account
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverUserId, setRecoverUserId] = useState("");

  function validate_email(email) {
    let expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email) == true) {
      return true;
    } else {
      return false;
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const user = await axios.get(
        `${URL}/auth/find?account=${usernameOrEmail}`
      );

      if (user.status === 200) {
        setSuccessMsg("User Found!");
        setRecoverEmail(user.data.other.email);
        setRecoverUserId(user.data.other._id);
        setTimeout(() => {
          setIsAuthModalOpen(true);
        }, 1000);
      } else {
        setErrorMsg("User not found");
      }
    } catch (err) {
      return console.error(err);
    }
  }

  // Fetch departments when branch changes

  useEffect(() => {
    localStorage.setItem("isInSignInPage", isInSignInPage);
  }, [isInSignInPage]);

  if (isLoggedIn) {
    return (location.href = "/");
  } else {
    return (
      <HelmetProvider>
        <Helmet>
          <title>DOS</title>
          <meta property="og:title" content="Login or Sign up" />
        </Helmet>
        <div className="bg-loginBg w-screen h-screen">
          <div
            className="flex flex-col justify-between p-2 w-10/12 max-w-[480px] min-h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl md:flex-row md:w-5/6 md:h-[30rem]  md:bg-loginWhite md:max-w-[770px] md:p-0 lg:min-w-63rem lg:max-w-[73rem] lg:h-[37rem]"
            style={{ position: "relative" }}
          >
            <div
              className={`flex flex-col items-center justify-center h-[30rem] bg-loginWhite rounded-3xl p-4 pb-8 z-10 shadow-md shadow-black/30 ${
                isInSignInPage ? "md:left-0" : "md:left-full"
              } ${
                isInSignInPage ? "md:translate-x-0" : "md:-translate-x-full"
              } md:h-full md:w-3/5 md:rounded-2xl md:shadow-none md:absolute md:z-0 md:transition-all md:ease-out md:duration-300 lg:p-28 lg:h-full`}
            >
              <form className="h-full w-full flex flex-col justify-between items-center text-xs">
                <div className="w-full flex flex-col items-center space-y-4">
                  <h1 className="text-2xl font-bold lg:text-5xl">
                    {isInSignInPage ? "Hello World!" : "Create Account"}
                  </h1>
                  <p className="text-xs font-bold lg:text-lg lg:font-normal">
                    {isForgotPassword
                      ? "Recover your Account"
                      : isInSignInPage
                      ? "Sign into your DOS Account"
                      : "Join DOS Now!"}
                  </p>
                  {isInSignInPage ? (
                    <LoginForm handleIsLoggedIn={toggleIsLoggedIn} />
                  ) : (
                    <SignupForm
                      handleTermsCondition={toggleIsTermsConditionOpen}
                    />
                  )}
                  <div className="text-loginBlue">
                    <p className="inline-block">
                      {isInSignInPage
                        ? "Not yet joined with DOS?"
                        : "Already have an account?"}{" "}
                    </p>
                    <button
                      className="hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsInSignInPage(!isInSignInPage);
                        setSteps(0);
                        setEmail("");
                        setUsername("");
                        setPassword("");
                        setFisrtName("");
                        setLastName("");
                        setSection("");
                        setCode("");
                        setErrorMsg("");
                      }}
                    >
                      {" "}
                      {isInSignInPage ? `Create an account` : `Login`}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div
              className={`relative h-[16rem] w-full p-2 rounded-3xl bg-loginBlue text-loginWhite text-xs shadow-2xl shadow-black -translate-y-4 md:translate-y-0 md:absolute ${
                isInSignInPage ? "md:right-0 " : "md:right-full"
              } ${
                !isInSignInPage && "md:translate-x-full"
              } md:transition-all md:duration-300 md:ease-out md:h-full md:w-2/5 md:shadow-none md:rounded-2xl lg:h-full `}
            >
              <div className="absolute p-4 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full lg:p-8 ">
                <h2 className="font-bold text-lg text-center mb-2 lg:text-4xl lg:pb-8 ">
                  {isInSignInPage ? "Welcome Back!" : "Welcome to DOS"}
                </h2>
                <p className="text-justify lg:text-[14px]">
                  {isInSignInPage
                    ? "DOS, a dynamic and engaging platform designed for PUPSHS Students. With a friendly interface, a safe, moderated environment, DOS is the perfect space to share your thoughts and connect with your fellow students. Whether you want to post anonymously or publicly, DOS offers a variety of ways to share your personal reflections, funny anecdotes, or motivational messages. With the ability to post announcements, DOS is also a valuable tool to help keep everyone in the loop."
                    : "New to DOS? Create an account now and experience a dynamic and engaging platform designed for PUPSHS Students. With a friendly interface, a safe, moderated environment, DOS is the perfect space to share your thoughts and connect with your fellow students. Whether you want to post anonymously or publicly, DOS offers a variety of ways to share your personal reflections, funny anecdotes, or motivational messages. With the ability to post announcements, DOS is also a valuable tool to help keep everyone in the loop. So why not join DOS today?"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {isTermsConditionsOpen && (
          <>
            <TermsConditions onCloseModal={toggleIsTermsConditionOpen} />
            <div className="overlay"></div>
          </>
        )}
        {isAuthModalOpen && (
          <>
            <AuthenticationModal
              onCloseAuthentication={() => setIsAuthModalOpen(!isAuthModalOpen)}
              email={recoverEmail}
              recoverUserId={recoverUserId}
            />
          </>
        )}
        {isAuthModalOpen && <div className="overlay"></div>}
      </HelmetProvider>
    );
  }
}
