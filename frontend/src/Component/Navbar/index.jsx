import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
const NavbarComponent = () => {
  const router = useRouter()

  const authState = useSelector((state) => state.auth)
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
                <p>Hey,{authState.user.userId.username}</p>
                <p style={{ cursor: "pointer",fontWeight: "bold" }}>Profile</p>
                {/* <p style={{ cursor: "pointer", fontWeight: "bold" }}>Logout</p> */}
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