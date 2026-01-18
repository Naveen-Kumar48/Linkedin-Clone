import UserLayout from "@/layout/UserLayout";
import { React, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import styles from "./style.module.css";
const LoginComponent = () => {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const [isLoginMethod, setIsLoginMethod] = useState(false);

  useEffect(() => {
    if (authState.LoggedIn) {
      router.push("/dashboard");
    }
  });

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div  className={styles.cardContainer_left}>
            <p className={styles.cardleft_heading}>{isLoginMethod ? "Login" : "Sign Up"}</p>
          </div>

          <div className={styles.cardContainer_right}></div>
        </div>
      </div>
    </UserLayout>
  );
};

export default LoginComponent;
