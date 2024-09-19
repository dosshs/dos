// import React from "react";

// const SignupForm = (props) => {
//   return {steps === 0 ? (
//     div
//                     //LOG IN
//                     <>
//                       {isInSignInPage && (
//                         <input
//                           type="text"
//                           value={usernameOrEmail}
//                           onChange={(e) => {
//                             setUsernameOrEmail(e.target.value);
//                           }}
//                           placeholder="Enter your username or email "
//                           required
//                         />
//                       )}
//                       {!isInSignInPage && (
//                         <>
//                           <input
//                             type="text"
//                             value={username}
//                             onChange={(e) => {
//                               setUsername(e.target.value);
//                             }}
//                             placeholder="Enter your username  "
//                           />
//                           <input
//                             type="text"
//                             value={email}
//                             onChange={(e) => {
//                               setEmail(e.target.value);
//                             }}
//                             placeholder="Enter your email "
//                           />
//                         </>
//                       )}
//                       {!isForgotPassword && (
//                         <input
//                           type="password"
//                           value={password}
//                           onChange={(e) => {
//                             setPassword(e.target.value);
//                           }}
//                           placeholder="Enter your password"
//                         />
//                       )}
//                       {!isInSignInPage && (
//                         <>
//                           <input
//                             type="password"
//                             value={confirmPass}
//                             onChange={(e) => {
//                               setConfirmPass(e.target.value);
//                             }}
//                             placeholder="Confirm Password  "
//                           />

//                           <p
//                             style={{
//                               fontSize: "0.8rem",
//                               cursor: "pointer",
//                             }}
//                           >
//                             By signing up you agree to the
//                           </p>
//                           <p
//                             style={{
//                               fontSize: "0.8rem",
//                               textDecoration: "underline",
//                               cursor: "pointer",
//                             }}
//                             onClick={() => {
//                               setIsTermsConditionsOpen(true);
//                             }}
//                           >
//                             terms and conditions.
//                           </p>
//                         </>
//                       )}
//                     </>
//                   ) : steps === 1 ? (
//                     <>
//                       <input
//                         type="text"
//                         value={firstName}
//                         onChange={(e) => {
//                           setFisrtName(e.target.value);
//                         }}
//                         placeholder="First Name"
//                       />
//                       {!isInSignInPage && (
//                         <input
//                           type="text"
//                           value={lastName}
//                           onChange={(e) => {
//                             setLastName(e.target.value);
//                           }}
//                           placeholder="Last Name"
//                         />
//                       )}
//                       <select
//                         className="w-5/6 p-2 rounded-full border-t-2 border-loginBlue focus:outline-none"
//                         style={{
//                           borderColor: "#4f709c",
//                           backgroundColor: "white",
//                           color: "#000",
//                         }}
//                         value={branch}
//                         onChange={(e) => {
//                           setBranch(e.target.value);
//                         }}
//                       >
//                         <option value={null}>Branch</option>
//                         <option value={1}>Sta. Mesa</option>
//                       </select>
//                       {branch && (
//                         <select
//                           className="w-5/6 p-2 rounded-full border-t-2 border-loginBlue focus:outline-none"
//                           style={{
//                             borderColor: "#4f709c",
//                             backgroundColor: "white",
//                             color: "#000",
//                           }}
//                           value={department}
//                           onChange={(e) => {
//                             setDepartment(e.target.value);
//                           }}
//                         >
//                           <option value={null}>Department</option>
//                           <option value={1}>CCIS</option>
//                         </select>
//                       )}
//                       {department && (
//                         <select
//                           className="w-5/6 p-2 rounded-full border-t-2 border-loginBlue focus:outline-none"
//                           style={{
//                             borderColor: "#4f709c",
//                             backgroundColor: "white",
//                             color: "#000",
//                           }}
//                           value={course}
//                           onChange={(e) => {
//                             setCourse(e.target.value);
//                           }}
//                         >
//                           <option value={null}>Course</option>
//                           <option value={1}>Computer Science</option>
//                         </select>
//                       )}
//                       {course && (
//                         <select
//                           className="w-5/6 p-2 rounded-full border-t-2 border-loginBlue focus:outline-none"
//                           style={{
//                             borderColor: "#4f709c",
//                             backgroundColor: "white",
//                             color: "#000",
//                           }}
//                           value={section}
//                           onChange={(e) => {
//                             setSection(e.target.value);
//                           }}
//                         >
//                           <option value={null}>Section</option>
//                           <option value={1}>CS 1-1</option>
//                         </select>
//                       )}
//                     </>
//                   ) : (
//                     steps >= 2 && (
//                       <>
//                         <p className="signin-text">
//                           Enter the code sent to {email}
//                           to finalize your account.
//                         </p>
//                         <input
//                           type="text"
//                           className="login-input --white-btn"
//                           style={{
//                             borderColor: "#4f709c",
//                             backgroundColor: "white",
//                             color: "#000",
//                           }}
//                           value={code}
//                           onChange={(e) => {
//                             setCode(e.target.value);
//                           }}
//                           placeholder="Code"
//                         />
//                       </>
//                     )
//                   )}

//                   <div className="utils-container">
//                     {isInSignInPage && (
//                       <>
//                         {!isForgotPassword && (
//                           <>
//                             <label htmlFor="remember-me">
//                               {" "}
//                               <input
//                                 className="accent-loginBlue"
//                                 type="checkbox"
//                                 name="isRememberMe"
//                                 id="remember-me"
//                                 value={isRememberMe}
//                                 onChange={(e) => {
//                                   setIsRememberMe(e.target.checked);
//                                 }}
//                               />{" "}
//                               Remember Me
//                             </label>
//                           </>
//                         )}

//                         <p
//                           className="cursor-pointer text-loginBlue hover:underline"
//                           onClick={() => setIsForgotPassword(!isForgotPassword)}
//                         >
//                           {!isForgotPassword
//                             ? "Forgot Password"
//                             : "Return to Login"}
//                         </p>
//                       </>
//                     )}
//                   </div>
//                   <p className="--server-msg">{errorMsg}</p>
//                   <p className="--server-success-msg">{successMsg}</p>
//                 </div>

//                 <div className="text-mediumBlue text-xs text-center space-y-2">
//                   {isForgotPassword ? (
//                     <button
//                       className="bg-loginBlue text-loginWhite  p-1 w-28 rounded-full shadow-md"
//                       onClick={handleForgotPassword}
//                     >
//                       FIND
//                     </button>
//                   ) : isInSignInPage ? (
//                     <button
//                       className="bg-loginBlue text-loginWhite  p-1 w-28 rounded-full shadow-md"
//                       onClick={handleLogInSubmit}
//                     >
//                       {loginBtnMsg}
//                     </button>
//                   ) : (
//                     <button
//                       className="bg-loginBlue text-loginWhite  p-1 w-28 rounded-full shadow-md"
//                       onClick={handleSignUpSubmit}
//                     >
//                       {signUpBtnMsg}
//                     </button>
//                   )}
//                   <div className="text-loginBlue">
//                     <p className="inline-block">
//                       {isInSignInPage
//                         ? "Not yet joined with DOS?"
//                         : "Already have an account?"}{" "}
//                     </p>
//                     <button
//                       className="hover:underline"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         setIsInSignInPage(!isInSignInPage);
//                         setSteps(0);
//                         setEmail("");
//                         setUsername("");
//                         setPassword("");
//                         setFisrtName("");
//                         setLastName("");
//                         setSection("");
//                         setCode("");
//                         setErrorMsg("");
//                       }}
//                     >
//                       {" "}
//                       {isInSignInPage ? `Create an account` : `Login`}
//                     </button>
//                   </div>;
// };

// export default SignupForm;
