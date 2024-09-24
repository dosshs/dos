import { useState } from "react";
import { URL } from "../../App";
import axios from "axios";
import useToggle from "../hooks/useToggle";

const ForgetPassword = ({
  handleIsAuthModlaOpen,
  handleToggleForgotPassword,
  storedUsernameOrEmail,
}) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  //Recover Account
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverUserId, setRecoverUserId] = useState("");
  const [usernameOrEmail, setUsernameOrEmail] = useState(
    storedUsernameOrEmail ? storedUsernameOrEmail : ""
  );
  const [isAuthModalOpen, toggleIsAuthModalOpen] = useToggle();

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
          handleIsAuthModlaOpen();
        }, 1000);
      } else {
        setErrorMsg("User not found");
      }
    } catch (err) {
      return console.error(err);
    }
  }

  return (
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
      <p
        className="text-loginBlue cursor-pointer hover:underline hover:pointer "
        onClick={() => {
          handleToggleForgotPassword();
        }}
      >
        Return to login
      </p>
      <button
        className="bg-loginBlue text-loginWhite  p-1 w-28 rounded-full shadow-md"
        onClick={handleForgotPassword}
      >
        FIND
      </button>
      <p className="--server-msg">{errorMsg}</p>
      <p className="--server-success-msg">{successMsg}</p>

      {isAuthModalOpen && (
        <>
          <AuthenticationModal
            onCloseAuthentication={toggleIsAuthModalOpen}
            email={recoverEmail}
            recoverUserId={recoverUserId}
          />
        </>
      )}
    </>
  );
};

export default ForgetPassword;
