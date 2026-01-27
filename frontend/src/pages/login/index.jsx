import UserLayout from "@/layout/UserLayout";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
import styles from "./style.module.css";

import { toast } from "react-toastify";

const LoginComponent = () => {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  const dispath = useDispatch();
  const [isLoginMethod, setIsLoginMethod] = useState(false);
  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authState.LoggedIn) {
      router.push("/dashboard");
    }
  }, [authState.LoggedIn]);


  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, [])

  useEffect(() => {
    dispath(emptyMessage())
  }, [isLoginMethod])


  useEffect(() => {
    if (authState.message && authState.message.message) {
      if (authState.isError) {
        toast.error(authState.message.message);
      } else {
        toast.success(authState.message.message);
      }
      dispath(emptyMessage());
    }
  }, [authState.message, authState.isError, dispath]);

  const handleRegister = () => {

    dispath(
      registerUser({
        username: username,
        password: password,
        email: email,
        name: name

      })
    )
  };


  const handleLogin = () => {

    dispath(
      loginUser({
        email: email,
        password: password,
      })
    )
  };
  return (


    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>{isLoginMethod ? "Login" : "Sign Up"}</p>

            <div className={styles.inputContainer}>
              {
                !isLoginMethod &&
                <div className={styles.inputRow}>
                  <input value={username} onChange={(e) => setUsername(e.target.value)} className={styles.inputField} type="text" placeholder="Username" />
                  <input value={name} onChange={(e) => setName(e.target.value)} className={styles.inputField} type="text" placeholder="Name" />
                </div>



              }
              <input value={email} onChange={(e) => setEmailAddress(e.target.value)} className={styles.inputField} type="email" placeholder="email" />

              <input value={password} onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="password" placeholder="Password" />

              <button onClick={() => {
                if (isLoginMethod) {
                  handleLogin()
                } else {
                  handleRegister()
                }
              }} className={styles.buttonWithOutline} type="submit">

                <p>{isLoginMethod ? "Login" : "Sign Up"}</p>
              </button>
            </div>
          </div>

          <div className={styles.cardContainer_right}>
            <p>{isLoginMethod ? "Don't have an account?" : "Already have an account?"}</p>

            <button onClick={() => {
              setIsLoginMethod(!isLoginMethod)
            }} style={{ color: "black", textAlign: "center" }} className={styles.buttonWithOutline} type="submit">

              <p>{isLoginMethod ? "Sign Up" : "Login"}  </p>
            </button>




          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default LoginComponent;
