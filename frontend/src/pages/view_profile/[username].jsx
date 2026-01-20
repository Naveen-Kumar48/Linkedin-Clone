import { clientServer } from "@/config/index";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styles from './index.module.css'

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
<img src={userProfile.profilePicture} alt="" />  

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
