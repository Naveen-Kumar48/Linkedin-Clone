import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { getAllPost } from '@/config/redux/action/postAction'
import { getAboutUser } from '@/config/redux/action/authAction'
import { getAllUsers } from '@/config/redux/action/authAction'
import { useSelector } from 'react-redux'
import UserLayout from '../../layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
import { BASE_URL } from '@/config/index.js'
import { useState } from 'react'
import styles from './index.module.css'
import { createPost } from '@/config/redux/action/postAction'

function Dashboard() {
  const dispatch = useDispatch()
  const authState = useSelector((state) => state.auth)
  const postState = useSelector((state) => state.posts)
  const router = useRouter()
  useEffect(() => {

    if (authState.isTokenThere) {
      dispatch(getAllPost())
      dispatch(getAboutUser({ token: localStorage.getItem("token") }))
    }

    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers())
    }
  }, [authState.isTokenThere])




  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();




  const handleUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }))
    setPostContent("");
    setFileContent(null);
  }
  return (
    <UserLayout>
      <DashboardLayout>
        {!authState.user ? (
          <h1>Loading...</h1>
        ) : (
          <div className={styles.scrollComponent}>
            <div className={styles.wrapper}>
              <div className={styles.createPostContainer}>
                <img
                  className={styles.userProfile}
                  src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                  alt="Profile"
                />
                <textarea
                  onChange={(e) => setPostContent(e.target.value)}
                  value={postContent}
                  placeholder="Start a post"
                  className={styles.textAreaOfContent}
                ></textarea>
                <label htmlFor="fileUpload">
                  <div className={styles.fab}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                </label>
                <input
                  type="file"
                  hidden
                  id="fileUpload"
                  onChange={(e) => setFileContent(e.target.files[0])}
                />
                {postContent.length > 0 && (
                  <div onClick={handleUpload} className={styles.uploadButton}>
                    Post
                  </div>
                )}
              </div>

              <div className={styles.postsContainer}>
                {postState.posts.map((post) => {
                  return (
                    <div key={post._id} className={styles.singleCard}>
                      <div className={styles.cardHeader}>
                        <img
                          src={`${BASE_URL}/${post.userId.profilePicture}`}
                          className={styles.avatar}
                          alt="Profile"
                        />
                        <div className={styles.cardInfo}>
                          <h4>{post.userId.name}</h4>
                          <p>@{post.userId.username}</p>
                        </div>
                      </div>

                      <div className={styles.cardBody}>
                        <p>{post.body}</p>
                        {post.media && (
                          <div className={styles.postMediaContainer}>
                            <img src={`${BASE_URL}/${post.media}`} alt="Post Media" />
                          </div>
                        )}
                      </div>

                      <div className={styles.cardFooter}>
                        <div className={styles.actionButton}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.247-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.176.405.278.602.282.543.654.914 1.144.914H8c.55 0 .905-.398 1.022-1.002a7.59 7.59 0 00.125-1.524 3.126 3.126 0 00.312-3.575C8.379 11.121 7.239 10.5 5.904 10.5H5.197" />
                          </svg>
                          <span>Like</span>
                        </div>
                        <div className={styles.actionButton}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                          </svg>
                          <span>Comment</span>
                        </div>
                        <div className={styles.actionButton}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.657 48.657 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                          </svg>
                          <span>Repost</span>
                        </div>
                        <div className={styles.actionButton}>
                          <svg xmlns="http://www.w3.org/2000/svg" transform="rotate(-45)" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                          </svg>
                          <span>Send</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  )
}

export default Dashboard