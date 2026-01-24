import React from "react";
import UserLayout from "../../layout/UserLayout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "@/config/index.js";
import { useSelector } from "react-redux";
import styles from "./index.module.css";
import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "../../layout/DashboardLayout";
import { useRouter } from "next/router";
export default function DiscoverPage() {
  const dispatch = useDispatch();
  const router = useRouter()

  const authState = useSelector((state) => state.auth);
  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers({ token: localStorage.getItem("token") }));
    }
  }, [authState.all_profile_fetched]);
  return (
    <div>
      <UserLayout>
        <DashboardLayout>
          <div>
            <h1>
              Discover Page
              <div className={styles.allUserProfile}>
                {authState.all_profiles_fetched &&
                  authState.all_users.map((user) => (
                    <div onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`)
                    }} key={user._id} className={styles.userCard}>
                      <img
                        className={styles.userCard_image}
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt="Profile"
                      />
                      <div>
                        <h1>{user.userId.name}</h1>
                        <p>{user.userId.username}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </h1>
          </div>
        </DashboardLayout>
      </UserLayout>
    </div>
  );
}
