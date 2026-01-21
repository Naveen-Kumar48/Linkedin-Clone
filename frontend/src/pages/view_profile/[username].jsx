import { BASE_URL, clientServer } from "@/config/index";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styles from "./index.module.css";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    // console.log("From view: View Profile")
  }, []);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.Container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
            />
            <div className={styles.profileContainer_details}>
                <div style={{ display:"flex",width:"fit-content",alignItems:"center",gap:"1.2rem" }}>
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{color:"grey"}}>@{userProfile.userId.username}</p>
                </div>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.8" }}>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  console.log("From View SSR");

  const { username } = context.query;

  const request = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: { username },
    },
  );

  return {
    props: {
      userProfile: request.data.profile,
    },
  };
}
