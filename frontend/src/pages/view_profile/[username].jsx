import { BASE_URL, clientServer } from "@/config/index";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "@/config/redux/action/postAction";
import { getConnectionsRequest, getMyConnectionRequests } from "@/config/redux/action/authAction";
import { sendConnectionRequest } from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const { username } = router.query;
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postreducer = useSelector((state) => state.posts);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setCurrentUserInConnection] =
    useState(false);

  const [isCurrentionNull, setIsConnectionNull] = useState(true);
  const getUsersPost = async () => {
    await dispatch(getAllPost());
    await dispatch(
      getConnectionsRequest({ token: localStorage.getItem("token") }),
    );
    await dispatch(getMyConnectionRequests({token:localStorage.getItem("token")}))
  };

  useEffect(() => {
    let post = postreducer.posts.filter((post) => {
      return post.userId.username === router.query.username;

      setUserPosts(post);
    });
  }, [postreducer.posts]);

  useEffect(() => {
   
    if(authState.connections.some(user=>user.connectionId._id===userProfile.userId._id)){
      setCurrentUserInConnection(true)
      if(authState.connections.find(user=>user.connectionId._id===userProfile.userId._id).status_accepted===true){
        setIsConnectionNull(false)
      }
    }

    if(authState.connectionRequests.some(user=>user.userId._id===userProfile.userId._id)){
      setCurrentUserInConnection(true)
      if(authState.connectionRequests.find(user=>user.userId._id===userProfile.userId._id).status_accepted===true){
        setIsConnectionNull(false)
      }
    }
  }, [authState.connections,authState.connectionRequests]);

  useEffect(() => {
    getUsersPost();


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
              <div
                style={{
                  display: "flex",
                  width: "fit-content",
                  alignItems: "center",
                  gap: "1.2rem",
                }}
              >
                <h2>{userProfile.userId.name}</h2>

                <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>



                  {isCurrentUserInConnection ? (
                    <button className={styles.connectButton}>{isCurrentionNull ? "Pending" : "Connected"}</button>
                ) : (
                <button
                  onClick={async () => {
                    await dispatch(
                      sendConnectionRequest({
                        token: localStorage.getItem("token"),
                        connectionId: userProfile.userId._id,
                      }),
                    );
                    setCurrentUserInConnection(false);
                  }}
                >
                  Connect
                </button>
                  )}

                <div onClick={async () => {
                  const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`)
                  window.open(`${BASE_URL}/${response.data.message}`, "_blank")
                }} style={{ width: "24px", cursor: "pointer" }} className={styles.iconContainer}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </div>
              </div>
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
                    <p style={{ fontWeight: "700", color: "#2d3748" }}>{work.company}</p>
                    <p style={{ color: "#008080", fontWeight: "600" }}>{work.position}</p>
                    <p style={{ fontSize: "0.9rem", color: "#718096" }}>{work.years}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </UserLayout >
  );
}

export async function getServerSideProps(context) {
 

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
