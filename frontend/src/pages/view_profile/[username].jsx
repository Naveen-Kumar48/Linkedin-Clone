import { BASE_URL, clientServer } from "@/config/index";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllPost } from "@/config/redux/action/postAction";
import { getConnectionsRequest } from "@/config/redux/action/authAction";
import { acceptConnectionRequest } from "@/config/redux/action/authAction";
import { rejectConnectionRequest } from "@/config/redux/action/authAction";
import { removeConnection } from "@/config/redux/action/authAction";
import { sendConnectionRequest } from "@/config/redux/action/authAction";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const { username } = router.query;
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postreducer = useSelector((state) => state.posts);
  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setCurrentUserInConnection] = useState(false);
  const getUsersPost = async () => {
    await dispatch(getAllPost());
    // await dispatch(getConnectionsRequest({ token: localStorage.getItem("token") }))
  }

  useEffect(() => {
    getUsersPost();
  }, [])

  useEffect(() => {
    if (postreducer?.posts) {
      let post = postreducer.posts.filter((post) => {
        return post.userId.username === router.query.username
      })
      setUserPosts(post);
    }
  }, [postreducer?.posts, router.query.username])

  useEffect(() => {
    if (authState.connections && userProfile) {
      if (authState.connections.some(user => user.connectionId._id === userProfile.userId._id)) {
        setCurrentUserInConnection(true);
      }
    }
  }, [authState.connections, userProfile])
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
              <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem" }}>

                <h2>{userProfile.userId.name}</h2>

                <p style={{ color: "grey" }}>@{userProfile.userId.username}</p>

                {isCurrentUserInConnection ? <button>Connected</button> : <button onClick={() => {
                  dispatch(sendConnectionRequest({ token: localStorage.getItem("token"), connectionId: userProfile.userId._id }))
                  console.log("Connection request");
                }} >
                  Connect
                </button>}
              </div>
              <div>

                <p>{userProfile.bio}</p>
              </div>
                <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  {userPosts.map((post) => {
                    return (
                      <div key={post._id} className={styles.postCard}>
                        <div className={styles.Card}>
                          <div className={styles.card__profileContainer}>
                            {
                              post.media!==""?<img src={`${BASE_URL}/${post.media}`} alt="" />: <div style={{width:"3.4rem",height:"3.4rem",borderRadius:"50%",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#efefef"}}>
                                
                                <div style={{width:"100%",height:"100%",backgroundColor:"#efefef"}}/>
                                
                                </div> 
                            }
                          </div>
                          <p>{post.body}</p>
                        </div>
                      </div>
                    )
                  })}
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
