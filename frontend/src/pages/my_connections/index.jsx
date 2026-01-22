import React from 'react'
import UserLayout from '../../layout/UserLayout'
import DashboardLayout from '../../layout/DashboardLayout'
import styles from './index.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { BASE_URL } from '@/config/index'

import { getMyConnectionRequests } from '@/config/redux/action/authAction'
export default function MyConnectionsPage() {
    const dispatch = useDispatch()
    const authState = useSelector((state) => state.auth)
    useEffect(() => {
        dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }))
    }, [])

    useEffect(() => {
        if (authState.connections.length != 0) {
            console.log(authState.connections)
        }
    }, [authState.connections])
    return (
        <div>

            <UserLayout>
                <DashboardLayout>
                    <div>
                        <h1>
                            My Connections
                        </h1>
                        <div>
                            {authState.connections.length != 0 ? (
                                authState.connections.map((user) => (
                                   <div className={styles.usercard} key={user._id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px",margin:"10px",border:"1px solid #ccc",borderRadius:"10px"}}>
                                    <div className={styles.profilepicture}>
                                        <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                                    </div>
                                    <div className={styles.userinfo}>
                                        <h2>{user.userId.name}</h2>
                                        <p>{user.userId.username}</p>
                                    </div>
                                    
                                   
                                   </div>
                                ))
                            ) : (
                                <p>No connections found</p>
                            )}
                        </div>
                    </div>

                </DashboardLayout>
            </UserLayout>

        </div>
    )
}
