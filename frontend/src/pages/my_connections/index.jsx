import React, { useEffect } from "react";
import UserLayout from "../../layout/UserLayout";
import DashboardLayout from "../../layout/DashboardLayout";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/config/index";
import {
    acceptConnectionRequest,
    getMyConnectionRequests,
    getAllUsers,
} from "@/config/redux/action/authAction";
import { useRouter } from "next/router";

export default function MyConnectionsPage() {
    const dispatch = useDispatch();
    const router = useRouter();

    const authState = useSelector((state) => state.auth);

    const connections = authState.connections;

    useEffect(() => {
        dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
    }, []);

    useEffect(() => {
        if (authState.connections.length != 0) {
        }
    }, [authState.connections]);

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <UserLayout>
            <DashboardLayout>
        <div style={{display:"flex",flexDirection:"column",gap:"1.7rem"}}>
                    <h4>My connections</h4>
                    {authState.connections.length === 0 && (
                        <h1> No Connection Request Pending</h1>
                    )}
                    {authState.connections.length != 0 &&
                        authState.connections
                            .filter((connection) => connection.status_accepted == null)
                            .map((user) => {
                                return (
                                    <div
                                        onClick={() => {
                                            router.push(`/view_profile/${user.userId.username}`);
                                        }}
                                        key={user._id}
                                        className={styles.userCard}
                                    >
                                        <div>
                                            <div className={styles.profilePicture}>
                                                <img
                                                    src={`${BASE_URL}/${user.userId.profilePicture}`}
                                                    alt="Profile-picture"
                                                />
                                            </div>
                                            <div className={styles.userInfo}>
                                                <h3>{user.userId.name}</h3>
                                                <h3>{user.userId.username}</h3>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dispatch(
                                                        acceptConnectionRequest({
                                                            connectionId: user._id,
                                                            token: localStorage.getItem("token"),
                                                            action: "accept",
                                                        }),
                                                    );
                                                }}
                                                className={styles.connectBtn}
                                            >
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                    <h4> My Network </h4>
                    
                    {authState.connections.filter((connection) => connection.status_accepted !== null).map((user) => {
                        return (
                            <div
                                onClick={() => {
                                    router.push(`/view_profile/${user.userId.username}`);
                                }}
                                key={user._id}
                                className={styles.userCard}
                            >
                                <div>
                                    <div className={styles.profilePicture}>
                                        <img
                                            src={`${BASE_URL}/${user.userId.profilePicture}`}
                                            alt="Profile-picture"
                                        />
                                    </div>
                                    <div className={styles.userInfo}>
                                        <h3>{user.userId.name}</h3>
                                        <h3>{user.userId.username}</h3>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </DashboardLayout>
        </UserLayout>
    );
}
