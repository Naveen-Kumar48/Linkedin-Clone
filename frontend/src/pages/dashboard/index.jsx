import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { getAllPost } from '@/config/redux/action/postAction'
import { getAboutUser } from '@/config/redux/action/authAction'
import { useSelector } from 'react-redux'
import UserLayout from '../../layout/UserLayout'
import DashboardLayout from '@/layout/DashboardLayout'
function Dashboard() {
  const [isTokenThere, setIsTokenThere] = useState(false)
  const dispatch = useDispatch()
  const authState = useSelector((state) => state.auth)
  const router = useRouter()
  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    }
    setIsTokenThere(true)
  }, [])

  useEffect(() => {

    if (isTokenThere) {
      dispatch(getAllPost())
      dispatch(getAboutUser({ token: localStorage.getItem("token") }))

    }
  }, [isTokenThere])
  return (
    <UserLayout>
      <DashboardLayout>
<div>
    <h1>
        Dashboard
    </h1>
</div>

      </DashboardLayout>
    </UserLayout>
  )
}

export default Dashboard