import React, { useEffect, useState }  from 'react'
import { useRouter } from 'next/router'

function Dashboard() {
    const [isTokenThere,setIsTokenThere]=useState(false)
  const router = useRouter()
  useEffect(() => {  
    if (localStorage.getItem("token")===null) {
     router.push("/login");
    }
    setIsTokenThere(true)
  },[])

  useEffect(()=>{


    if(isTokenThere){
        if( localStorage.getItem("token")!==null){
            
        }
    }
  },[isTokenThere])
  return (
    <div>Dashboard</div>
  )
} 

export default Dashboard