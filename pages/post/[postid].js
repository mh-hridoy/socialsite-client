import React, { useState, useEffect } from "react"
import { Flex, Spinner, useColorModeValue } from "@chakra-ui/react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router"
import WithHeader from "../../components/custom/WithHeader"
import SingleFeed from "../../components/base/SingleFeed"
import axios from "axios"
import io from "socket.io-client"
import { logout } from "../../store/userInfoSlice"
import useHttp from "../../components/utils/useHttp"
import CommentsOfFeed from "../../components/custom/CommentsOfFeed"
const PostId = (props) => {
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
        query: { token: token, postId: router.query.postid, userId: user._id },
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

  const { _ } = useHttp({
    fetchNow: fetchData && router.query.postid,
    setFetchNow: setFetchData,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/getone-post/${router.query.postid}`,
    isAuth: true,
    isSetData: true,
    setData: setItem,
    isEToast: true,
    cb: () => setLoading(false),
    ecb: () => setLoading(false),
  })


  return (
    <>
      <Flex
        borderRight={"1px"}
        borderLeft={"1px"}
        borderColor={useColorModeValue("gray.200", "#333")}
        w={"100%"}
        minHeight="95vh"
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
              <SingleFeed item={item.post} />
              <CommentsOfFeed
                quoteData={props.quoteData}
                setQuoteData={props.setQuoteData}
                isCreateModalOpen={props.isCreateModalOpen}
                setIsCreateModalOpen={props.setIsCreateModalOpen}
                setHomeData={props.setHomeData}
                comments={item.postComment}
                setPost={setItem}
                postId={item.post?._id}
                item={item}
              />
            </WithHeader>
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default PostId
