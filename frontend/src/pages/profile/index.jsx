import { getAboutUser } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/config";
import styles from "./Index.module.css";
import { getAllPost } from "@/config/redux/action/postAction";
export default function ProfilePage() {
  const dispatch = useDispatch();
  // const [userProfile,setUserPerofile]=useState({
  //     userId:{
  //         name:"",
  //         username:"",
  //         profilePicture:""

  //     },
  //     bio:"",
  //     pastWork:[]
  // })

  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));

    dispatch(getAllPost());
  }, []);

  useEffect(() => {
      if (authState.user!=undefined) {
        setUserProfile( authState.user);
      let post = postReducer.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
    });
    console.log(post, authState.user.userId.username)
    setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile?.userId && (
          <div className={styles.Container}>
            <div className={styles.backDropContainer}>
              <img
                className={styles.backDrop}
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                alt=""
              />
              <div className={styles.profileContainer_details}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>

                  <p style={{ color: "grey" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>

                <div>
                  <p>{userProfile.bio}</p>
                </div>
                <div style={{ display: "flex", gap: "0.7rem", width: "100%" }}>
                  <div style={{ flex: "1" }}>
                    <h3>Recent Activity</h3>
                    {userPosts.map((post) => {
                      return (
                        <div key={post._id} className={styles.postCard}>
                          <div className={styles.Card}>
                            <div className={styles.card__profileContainer}>
                              {post.media !== "" ? (
                                <img src={`${BASE_URL}/${post.media}`} alt="" />
                              ) : (
                                <div
                                  style={{ width: "3.rem", height: "3.4rem" }}
                                ></div>
                              )}
                              <p>{post.body}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className={styles.workhistory}>
                <h4>work history</h4>
                <div className={styles.workHistoryContainer}>
                  {userProfile.pastwork.map((work, index) => {
                    return (
                      <div key={index} className={styles.workHistoryCard}>
                        <p style={{ fontWeight: "700", color: "#2d3748" }}>
                          {work.company}
                        </p>
                        <p style={{ color: "#008080", fontWeight: "600" }}>
                          {work.position}
                        </p>
                        <p style={{ fontSize: "0.9rem", color: "#718096" }}>
                          {work.years}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
