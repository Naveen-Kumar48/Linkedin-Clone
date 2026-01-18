import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout >
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainer_left}>
            <p>Connect with friends without Exaggeration </p>
            <p>A true social media platform ,with stores no bluff!</p>
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}>
              <p>Join Now</p>
            </div>
          </div>
          <div className={styles.mainContainer_right}>
            <img src="images/homemain_Connection.jpg" alt="" />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
