import React, {useState, useEffect} from 'react'
import { Flex, useToast, Spinner } from "@chakra-ui/react"
import UserAccount from '../../components/base/UserAccount'
import {useSelector, useDispatch} from 'react-redux'
import {useRouter} from 'next/router'
import {logout} from '../../store/userInfoSlice'
import axios from 'axios'
import io from "socket.io-client"


const UserId = () => {
    const [loading, setLoading] = useState(true)
  const token = useSelector((state) => state.user.token)
  const user = useSelector((state) => state.user.user)
  const toast = useToast({ position: "top", isClosable: true })
    const [homeData, setHomeData] = useState(null)
    const [userData, setUserData]= useState(null)
  const router = useRouter()
  const [fetchUser, setFfetchUser] = useState(false)
  const dispatch = useDispatch()


  useEffect(() => {
    setFfetchUser(true)

  }, [])

  useEffect(() => {
    //
    if (fetchUser) {
      getUserData()
    }

    return () => setFfetchUser(false)
  }, [fetchUser])

  const fetchInitData = async (userAccountId) => {
    try {
      const { data } = await axios(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-my-posts/${userAccountId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      setHomeData(data)
      setLoading(false)
    } catch (e) {
      router.push("/")
      const errorMsg = e.response && e.response.data.message
      console.log(errorMsg)
      toast({
        status: "error",
        duration: 5000,
        title: "Invalid user!",
      })
    }
  }

  useEffect(() => {
  const isUser=router.query.user == user._id
    if (fetchUser && isUser) router.push(`/account/myaccount/${user._id}`)
  }, [fetchUser])

  //setup socket
useEffect(() => {
  if (!loading) {
    const socket = io(process.env.NEXT_PUBLIC_MAIN_PROXY_RAW, {
      query: { token: token, userId: user._id },
    })
    socket.on("uesrPosts", (data) => {
      // console.log(data)
      setupAllData(data)
    })

    socket.on("connect_error", async (err) => {
      if (loading == false && err.message == "Authentication error") {
        try {
          await axios(`${process.env.NEXT_PUBLIC_MAIN_PROXY}/logout`)

          dispatch(logout({ user: null, token: "" }))
          localStorage.removeItem("user")

          router.push("/login")
        } catch (e) {
          console.log(e)
        }
      } else {
        socket.connect()
      }
    })
  }
}, [!loading])

const setupAllData = (post) => {
  // console.log(post)
  setHomeData((prev) => {
    const newArray = [...prev]
    const indexOfNewPost = newArray.findIndex((item) => item._id == post._id)
    if (indexOfNewPost != -1) {
      newArray[indexOfNewPost] = post
    } else {
      newArray.unshift(post)
    }
    return [...new Set(newArray)]
  })
}

  const getUserData = async () => {
  const code = window.location.pathname.split("/")
  const userAccountId = code[code.length - 1]
      try {
        const { data } = await axios(
          `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-user-info/${userAccountId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        )
        setUserData(data)
        fetchInitData(userAccountId)
      } catch (e) {
        router.push("/login")
        const errorMsg = e.response && e.response.data.message
        console.log(errorMsg)
        toast({
          status: "error",
          duration: 5000,
          title: "Invalid user!",
        })
      }
  }


  return (
    <>
      <Flex alignItems={"center"} justifyContent="center" w={"100%"} pt={5}>
        <Flex w={["90%", "90%", "75%"]}>
          {loading ? (
            <Flex alignItems={"center"} justifyContent="center" width={"100%"}>
              <Spinner color={"#ff552f"} size={"xl"} />
            </Flex>
          ) : (
            <UserAccount post={homeData} user={userData} />
          )}
        </Flex>
      </Flex>
    </>
  )
}
// 

export default UserId