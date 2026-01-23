import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { reset } from '../../config/redux/reducer/authReducer'
const NavbarComponent = () => {


  const router = useRouter()
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const postState = useSelector((state) => state.post)

  return (
    <>
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <h1 style={{ cursor: 'pointer' }} onClick={() => {
            router.push('/')

          }}>
            Pro Connect
          </h1>
          <div className={styles.navBaroptionContainer}>

            {authState.profileFetched && <div>
              <div style={{ display: "flex", gap: "1.2rem" }}>
                <p 
                style={{cursor:"pointer"}}
                onClick={()=>{
                  router.push('/profile')
                  
                }} >Hey,{authState.user.userId.username}</p>
                <p onClick={() => {
                  localStorage.removeItem("token")
                  router.push("/login")
                  dispatch(reset())
                }} style={{ cursor: "pointer", fontWeight: "bold" }}>Logout</p>
              </div>
            </div>}

            {!authState.profileFetched &&
              <div onClick={() => {
                router.push('/login')
              }} className={styles.buttonJoin}>

                <p> Be a Part</p>
              </div>}




          </div>
        </nav>
      </div>

    </>
  )
}

export default NavbarComponent