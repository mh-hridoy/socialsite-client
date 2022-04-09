import React, { useState, useEffect } from "react"
import { Flex, Spinner, useColorModeValue } from "@chakra-ui/react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router"
import WithHeader from "../../components/custom/WithHeader"
import SingleFeed from "../../components/base/SingleFeed"
import axios from "axios"
import io from "socket.io-client"
import { logout } from "../../store/userInfoSlice"
import CommentsOfFeed from "../../components/custom/CommentsOfFeed"
const CommentId = (props) => {
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  const [fetchData, setFetchData] = useState(false)
  const [item, setItem] = useState({})
  const [allComments, setAllComments] = useState([])
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    setLoading(true)
    setFetchData(true)
  }, [])

  useEffect(() => {
    if (loading == false) {
      console.log("working on it ")
      const socket = io(process.env.NEXT_PUBLIC_MAIN_PROXY_RAW, {
        query: { token: token, postId: router.query.postid, userId: user._id },
      })
      socket.on("onePost", (data) => {
        manageData(data)
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
  }, [loading == false])

  const manageData = (data) => {
    setTimeout(() => {
      const oldComments = [...allComments]
      const indexOfNewComment = oldComments.findIndex(
        (item) => item._id == data._id
      )

      if (indexOfNewComment != -1) {
        oldComments[indexOfNewComment] = data
      } else {
        oldComments.unshift(data)
      }

      const modifiedComments = [...new Set(oldComments)]

      setAllComments(modifiedComments)
    }, 2000)
  }

  useEffect(() => {
    const postId = window.location.pathname.split("/")[3]
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
          setItem(data?.post)
          setAllComments([...data?.postComment])
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

  // console.log(item)
  return (
    <>
      <Flex
        borderRight={"1px"}
        borderLeft={"1px"}
        borderColor={useColorModeValue("gray.200", "#333")}
        w={"100%"}
        minHeight="100vh"
      >
        <Flex
          direction="column"
          minWidth={
            user != null ? "100%" : ["100%", "100%", "60%", "50%", "50%"]
          }
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
              <SingleFeed totalComment={allComments.length} item={item} />
              <CommentsOfFeed
                quoteData={props.quoteData}
                totalComment={allComments?.length}
                setQuoteData={props.setQuoteData}
                isCreateModalOpen={props.isCreateModalOpen}
                setIsCreateModalOpen={props.setIsCreateModalOpen}
                setHomeData={props.setHomeData}
                comments={allComments}
                setComments={setAllComments}
                setPost={setItem}
                postId={item?._id}
                item={item}
              />
            </WithHeader>
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default CommentId
