import React from 'react'
import UserLayout from '../../layout/UserLayout'
import { useEffect } from 'react'       
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { getAllUsers } from '@/config/redux/action/authAction'
import DashboardLayout from '../../layout/DashboardLayout'
export default function DiscoverPage() {

    const dispatch = useDispatch()
    const authState=useSelector((state)=>state.auth)
    useEffect(() => {
    if(!authState.all_profile_fetched){
        dispatch(getAllUsers())
    }
    }, [authState.all_profile_fetched])
    return (    
        <div>
            <UserLayout>
                <DashboardLayout>
                    <div>
                        <h1>
                            Discover Page
                        </h1>
                    </div>

                </DashboardLayout>
            </UserLayout>

        </div>
    )
}
