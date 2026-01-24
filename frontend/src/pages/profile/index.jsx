import { getAboutUser } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, clientServer } from "@/config";
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
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: ""
  })

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  }

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));

    dispatch(getAllPost());
  }, []);

  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      let post = postReducer.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      console.log(post, authState.user.userId.username)
      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);




  const updateProfilePicture = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("token", localStorage.getItem("token"));
    formData.append("profilePicture", file);

    await clientServer.post("/uploadprofilepic", formData);

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };



  const updateProfileData = async () => {

    const request = await clientServer.post("/userupdate", {
      token: localStorage.getItem("token"),
      name: userProfile.userId?.name || ""
    })
    const response = await clientServer.post("/updateprofile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentWork: userProfile.currentWork,
      currentPost: userProfile.currentPost,
      education: userProfile.education,
      pastwork: userProfile.pastwork,
    })
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }
  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile?.userId && (
          <div className={styles.Container}>
            <div className={styles.backDropContainer}>
              <div className={styles.profileImageWrapper}>
                <label htmlFor="profilePictureUpload" className={styles.backDrop__overlay}>
                  <p>Edit</p>
                </label>
                <input hidden type="file" id="profilePictureUpload" onChange={(e) => updateProfilePicture(e.target.files[0])} />
                <img
                  className={styles.backDrop}
                  src={`${BASE_URL}/${userProfile.userId.profilePicture}?t=${Date.now()}`}
                  alt=""
                />
              </div>
              <div className={styles.profileContainer_details}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <input className={styles.nameEdit} type="text" value={userProfile.userId?.name} onChange={(e) => { setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } }) }} />

                  <p style={{ color: "grey" }}>
                    @{userProfile.userId.username}
                  </p>
                </div>

                <div>
                  <textarea
                    className={styles.bioEdit}
                    value={userProfile.bio}
                    onChange={(e) => setUserProfile({
                      ...userProfile,
                      bio: e.target.value
                    })}
                    rows={Math.max(3, userProfile.bio.length / 80)}//adjust as needded
                  ></textarea>
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
                  <button className={styles.addWorkButton}
                    onClick={() => {
                      setIsModalOpen(true)

                    }}>Add Work</button>
                </div>
              </div>

            </div>
            {
              userProfile != authState.user && (
                <button onClick={() => {
                  updateProfileData()
                }} className={styles.updateButton}>Update</button>
              )
            }
          </div>
        )}



        {isModalOpen && (
          <div
            onClick={() => {
              setIsModalOpen(false);
            }}
            className={styles.commentsContainer}
          >
            <div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={styles.allCommentsContainer}>
                <input onChange={handleWorkInputChange} name="company" type="text" className={styles.inputField} placeholder="Enter Work Space" />
                <input onChange={handleWorkInputChange} name="position" type="text" className={styles.inputField} placeholder="Enter Your Position" />
                <input onChange={handleWorkInputChange} name="years" type="number" className={styles.inputField} placeholder="Enter Years" />
                <div>


                  <button onClick={() => {
                    setUserProfile({
                      ...userProfile,
                      pastwork: [...userProfile.pastwork, inputData]
                    })
                    setIsModalOpen(false);
                  }} className={styles.updateButton}>Add Work</button>

                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
