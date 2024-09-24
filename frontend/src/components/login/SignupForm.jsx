import { useState, useReducer, useEffect, useRef } from "react";
import { URL } from "../../App";
import Cookies from "js-cookie";
import axios from "axios";
import useGetSchoolInfo from "../hooks/useGetSchoolInfo";
// import { jwtDecode } from "jwt-decode";

const SignupForm = ({ handleTermsCondition, handleIsLoggedIn }) => {
  const [steps, setSteps] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [firstName, setFisrtName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userId, setUserId] = useState("");
  const [code, setCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [signUpBtnMsg, setSignUpBtnMsg] = useState("SIGN UP");

  //selection inputs for school
  const [branch, setBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [section, setSection] = useState("");

  // School Details
  // const [departments, setDepartments] = useState([]);
  // const [courses, setCourses] = useState([]);
  // const [sections, setSections] = useState([]);

  //fetch department options when branch changes
  const [departments] = useGetSchoolInfo(
    `${URL}/user/detail?identifier=department`,
    branch
  );

  //fetch courses options when department changed
  const [courses] = useGetSchoolInfo(
    `${URL}/user/detail?identifier=course&branchId=${branch}`,
    department
  );

  //fetch section options when course changed
  const [sections] = useGetSchoolInfo(
    `${URL}/user/detail?identifier=section&courseId=${course}`,
    course
  );

  function validate_email(email) {
    let expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email) == true) {
      return true;
    } else {
      return false;
    }
  }

  async function handleSignUpSubmit(e) {
    e.preventDefault();
    if (steps === 0) {
      setErrorMsg("");
      //don't proceed to next step when form is not filled out

      if (!email || !username || !password || !confirmPass) {
        setErrorMsg("Please fill out the fields.");
        return;
      } else if (
        username === "admin" ||
        username === "Admin" ||
        username === "dashboard" ||
        username === "Dashboard" ||
        username === "dosboard" ||
        username === "Dosboard" ||
        username === "login" ||
        username === "Login" ||
        username === "singup" ||
        username === "Signup" ||
        username === "home" ||
        username === "Home"
      ) {
        setErrorMsg("Invalid Username");
        return;
      } else if (!validate_email(email)) {
        setErrorMsg("Invalid Email");
        return;
      } else if (password.length < 6) {
        setErrorMsg("Password should be atleast 6 characters.");
        return;
      } else if (username.length < 3) {
        setErrorMsg("Username should be atleast 3 characters.");
        return;
      } else if (password !== confirmPass) {
        setErrorMsg("Password didn't match.");
        return;
      } else {
        const newUser = {
          username: username,
          email: email,
          password: password,
        };
        setSignUpBtnMsg("Signing you up...");
        try {
          console.log(newUser);
          const res = await axios.post(`${URL}/auth/signup`, newUser);
          if (res.data.message === "Signed Up Successfully") {
            setUserId(res.data.id);
            Cookies.set("tempToken", res.data.token, {
              expires: 24 * 60 * 60,
            }); // 1 day expiration
          }
        } catch (err) {
          console.error(err);
          setSignUpBtnMsg("NEXT");
          if (err.response.data.err.keyValue.email)
            return setErrorMsg("Email already in use.");
          else if (err.response.data.err.keyValue.username)
            return setErrorMsg("Username is taken.");
          return setErrorMsg(err);
        }
      }
      setSteps((prevStep) => prevStep + 1);
      setSignUpBtnMsg("NEXT");
    } else if (steps === 1) {
      if (
        !firstName ||
        !lastName ||
        branch === undefined ||
        department === undefined ||
        course === undefined ||
        section === undefined
      )
        return setErrorMsg("Please fill out the fields");
      else if (firstName.length < 2 || lastName.length < 2) {
        return setErrorMsg(
          "First Name and Last Name should be atleast 2 characters"
        );
      } else {
        const user = {
          firstname: firstName,
          lastname: lastName,
          branchId: branch,
          departmentId: department,
          courseId: course,
          sectionId: section,
        };
        setSignUpBtnMsg("Sending you a code...");
        try {
          const res = await axios.put(`${URL}/user/${userId}`, user, {
            headers: {
              Authorization: Cookies.get("tempToken"),
            },
          });
          Cookies.set("tempToken", res.data.token, {
            expires: 24 * 60 * 60,
          }); // 1 day expiration
          if (res.data.message === "Account Successfully Updated") {
            const emailRes = await axios.put(`
            ${URL}/mail/signup/${userId}
            `);
            setVerificationCode(emailRes.data.verificationToken);
            setSteps((prevStep) => prevStep + 1);
          }
        } catch (err) {
          setSignUpBtnMsg("NEXT");
          setErrorMsg(err);
          return console.error(err);
        }
      }
      setSignUpBtnMsg("CONFIRM");
    } else if (steps === 2) {
      if (!code) {
        setErrorMsg("Please enter the code sent to your email address");
        return;
      } else if (code !== verificationCode) {
        setErrorMsg("Invalid verification code");

        return;
      } else {
        setSignUpBtnMsg("Creating your account...");
        const verifyRes = await axios.get(`
        ${URL}/verify/email?token=${code}
        `);

        if (
          verifyRes.data.message === "Email Successfully Verified" ||
          verifyRes.data.message === "Account Email already verified"
        ) {
          Cookies.set("token", Cookies.get("tempToken"));
          Cookies.remove("tempToken");
          setIsLoggedIn(true);
        }
      }
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPass("");
      setFisrtName("");
      setLastName("");
      setSection("");
      setCode("");
      setErrorMsg("");
      setSignUpBtnMsg("NEXT");
    }
  }

  return (
    <>
      {steps === 0 ? (
        <>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Enter your username  "
          />
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Enter your email "
          />
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Enter your password"
          />
          <input
            type="password"
            value={confirmPass}
            onChange={(e) => {
              setConfirmPass(e.target.value);
            }}
            placeholder="Confirm Password  "
          />

          <p
            style={{
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            By signing up you agree to the
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={handleTermsCondition}
          >
            terms and conditions.
          </p>
        </>
      ) : steps === 1 ? (
        <>
          <input
            type="text"
            value={firstName}
            onChange={(e) => {
              setFisrtName(e.target.value);
            }}
            placeholder="First Name"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder="Last Name"
          />
          <select
            // className="w-5/6 p-2 rounded-full border-t-2 border-loginBlue focus:outline-none"
            style={{
              borderColor: "#4f709c",
              backgroundColor: "white",
              color: "#000",
            }}
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);
            }}
          >
            <option value={null}>Branch</option>
            <option value={"66e6f1191b7f9e7e693ee751"}>Sta. Mesa</option>
          </select>
          {branch && (
            <select
              // className="w-5/6 p-2 rounded-full border-t-2 border-loginBlue focus:outline-none"
              style={{
                borderColor: "#4f709c",
                backgroundColor: "white",
                color: "#000",
              }}
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
              }}
            >
              <option value={null}>Department</option>
              {departments === null ? (
                <option value={null}>Loading...</option>
              ) : (
                departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </option>
                ))
              )}
            </select>
          )}
          {department && (
            <select
              // className="w-5/6 p-2 rounded-full border-t-2 border-loginBlue focus:outline-none"
              style={{
                borderColor: "#4f709c",
                backgroundColor: "white",
                color: "#000",
              }}
              value={course}
              onChange={(e) => {
                setCourse(e.target.value);
              }}
            >
              <option value={null}>Course</option>
              {courses === null ? (
                <option value={null}>Loading...</option>
              ) : (
                courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.shorthand}
                  </option>
                ))
              )}
            </select>
          )}
          {course && (
            <select
              // className="w-5/6 p-2 rounded-full border-t-2 border-loginBlue focus:outline-none"
              style={{
                borderColor: "#4f709c",
                backgroundColor: "white",
                color: "#000",
              }}
              value={section}
              onChange={(e) => {
                setSection(e.target.value);
              }}
            >
              <option value={null}>Section</option>
              {sections === null ? (
                <option value={null}>Loading...</option>
              ) : (
                sections.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.sectionName}
                  </option>
                ))
              )}
            </select>
          )}
        </>
      ) : (
        steps >= 2 && (
          <>
            <p className="signin-text">
              Enter the code sent to {email}
              to finalize your account.
            </p>
            <input
              type="text"
              className="login-input --white-btn"
              style={{
                borderColor: "#4f709c",
                backgroundColor: "white",
                color: "#000",
              }}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
              placeholder="Code"
            />
          </>
        )
      )}

      <p className="--server-msg">{errorMsg}</p>

      <button
        className="bg-loginBlue text-loginWhite  p-1 w-28 rounded-full shadow-md"
        onClick={handleSignUpSubmit}
      >
        {signUpBtnMsg}
      </button>
    </>
  );
};

export default SignupForm;
