import React, { useEffect } from 'react';
import UserLayout from '../../layout/UserLayout';
import DashboardLayout from '../../layout/DashboardLayout';
import styles from './index.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '@/config/index';
import { acceptConnectionRequest, getMyConnectionRequests } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';

export default function MyConnectionsPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    // Access authState correctly. If state.auth is undefined for some reason, provide default
    const authState = useSelector((state) => state.auth);
    // connections might be undefined initially
    const connections = authState.connections;

    useEffect(() => {
        dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
    }, [dispatch]);

    return (
        <UserLayout>
            <DashboardLayout>
                <div className={styles.container}>
                    <h5 className={styles.title}>My Connections</h5>

                    {/* Empty State */}
                    {connections.length === 0 && (
                        <div className={styles.emptyState}>No connections found</div>
                    )}

                    {/* Pending Requests Section */}
                    {connections.some(c => c.status_accepted === null) && (
                        <>
                            <h6 style={{ marginBottom: '1rem', color: '#718096' }}>Pending Requests</h6>
                            <div className={styles.connectionsGrid}>
                                {connections
                                    .filter(connection => connection.status_accepted === null)
                                    .map((user) => (
                                        <div
                                            key={user._id}
                                            className={styles.usercard}
                                            onClick={() => router.push(`/view_profile/${user.userId.username}`)}
                                        >
                                            <div className={styles.profilepicture}>
                                                <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                                            </div>
                                            <div className={styles.userinfo}>
                                                <h2>{user.userId.name}</h2>
                                                <p>@{user.userId.username}</p>
                                            </div>
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.acceptBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        dispatch(acceptConnectionRequest({
                                                            requestId: user._id,
                                                            token: localStorage.getItem("token"),
                                                            action_type: "accept"
                                                        }));
                                                    }}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className={styles.ignoreBtn}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Implement Ignore logic if needed
                                                    }}
                                                >
                                                    Ignore
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </>
                    )}

                    {/* Accepted Connections Section */}
                    {connections.some(c => c.status_accepted === true) && (
                        <>
                            <h6 style={{ marginTop: '2rem', marginBottom: '1rem', color: '#718096' }}>Active Connections</h6>
                            <div className={styles.connectionsGrid}>
                                {connections
                                    .filter(connection => connection.status_accepted === true)
                                    .map((user) => (
                                        <div
                                            key={user._id}
                                            className={styles.usercard}
                                            onClick={() => router.push(`/view_profile/${user.userId.username}`)}
                                        >
                                            <div className={styles.profilepicture}>
                                                <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="" />
                                            </div>
                                            <div className={styles.userinfo}>
                                                <h2>{user.userId.name}</h2>
                                                <p>@{user.userId.username}</p>
                                            </div>
                                            <div className={styles.actions}>
                                                <button
                                                    className={styles.acceptBtn}
                                                    style={{ backgroundColor: '#718096', cursor: 'default' }}
                                                >
                                                    Connected
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            </DashboardLayout>
        </UserLayout>
    );
}
