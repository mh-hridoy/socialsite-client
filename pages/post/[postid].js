import React, { useState, useEffect } from "react"
import { Flex, Spinner, Text } from "@chakra-ui/react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router"
import WithHeader from "../../components/custom/WithHeader"
import SingleFeed from "../../components/base/SingleFeed"
import axios from "axios"
import io from "socket.io-client"
import {logout} from '../../store/userInfoSlice'

const PostId = () => {
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  const [fetchData, setFetchData] = useState(false)
  const [item, setItem] = useState({})
  const router = useRouter()
    const dispatch = useDispatch()
    
  useEffect(() => {
    setFetchData(true)
  }, [])

  useEffect(() => {
    if (fetchData == false && user != null) {
      const socket = io(process.env.NEXT_PUBLIC_MAIN_PROXY_RAW, {
        query: { token: token, postId: router.query.postid },
      })
      socket.on("onePost", (data) => {
        setItem(data)
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
  }, [fetchData == false && user != null])

  

  useEffect(() => {
    const postId = window.location.pathname.split("/")[2]
    if (fetchData == true) {
      // if (user == null) router.push("/login")
      const fetchPostData = async () => {
        try {
          const { data } = await axios(
            `${process.env.NEXT_PUBLIC_MAIN_PROXY}/getone-post/${postId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          )
          setItem(data)
          setLoading(!loading)
          setFetchData(!fetchData)
        } catch (e) {
          setLoading(!loading)
          setFetchData(!fetchData)
          // router.push("/login")
          const errorMsg = e.response && e.response.data.message
          console.log(errorMsg)
        }
      }
      fetchPostData()
    }
  }, [fetchData == true])


  return (
    <>
      <Flex w={"100%"} alignItems={"center"} justifyContent="center">
        <Flex
          direction="column"
          minWidth={user != null ? "100%" : ["100%", "100%", "60%", "50%", "50%"]}
        >
          {loading ? (
            <Flex
              height="100vh"
              alignItems={"center"}
              justifyContent="center"
              width={"100%"}
            >
              <Spinner color={"rgb(29, 155, 240)"} size={"xl"} />
            </Flex>
          ) : (
            <WithHeader headerName="Feed">
              <SingleFeed item={item} />
            </WithHeader>
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default PostId
