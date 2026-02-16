import { getAboutUser } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, clientServer } from "@/config";
import styles from "./Index.module.css";
import { getAllPost } from "@/config/redux/action/postAction";
import { toast } from "react-toastify";
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

      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);






  const updateProfilePicture = async (file) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("token", localStorage.getItem("token"));
      formData.append("profilePicture", file);

      await clientServer.post("/uploadprofilepic", formData);

      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error("Failed to update profile picture.");
    }
  };



  const updateProfileData = async () => {
    try {
      await clientServer.post("/userupdate", {
        token: localStorage.getItem("token"),
        name: userProfile.userId?.name || ""
      })
      await clientServer.post("/updateprofile_data", {
        token: localStorage.getItem("token"),
        bio: userProfile.bio,
        currentWork: userProfile.currentWork,
        currentPost: userProfile.currentPost,
        education: userProfile.education,
        pastwork: userProfile.pastwork,
      })
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
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
                <div className={styles.profileNameContainer}>
                  <input className={styles.nameEdit} type="text" value={userProfile.userId?.name} onChange={(e) => { setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } }) }} />

                  <p className={styles.username}>
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
                <div style={{ width: "100%" }}>
                  <div>
                    <h3>Recent Activity</h3>
                    <div className={styles.postsGrid}>
                      {userPosts.map((post) => {
                        return (
                          <div key={post._id} className={styles.postCard}>
                            <div className={styles.Card}>
                              <div className={styles.card__profileContainer}>
                                {post.media && post.media !== "" && post.media !== "undefined" ? (
                                  <img src={`${BASE_URL}/uploads/${post.media}`} alt="Post Media" />
                                ) : (
                                  <div
                                    className={styles.postMediaPlaceholder}
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
              </div>


              <div className={styles.workhistory}>
                <h4>work history</h4>

                <div className={styles.workHistoryContainer}>
                  {userProfile.pastwork.map((work, index) => {
                    return (
                      <div key={index} className={styles.workHistoryCard}>
                        <p className={styles.workCompany}>
                          {work.company}
                        </p>
                        <p className={styles.workPosition}>
                          {work.position}
                        </p>
                        <p className={styles.workYears}>
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
