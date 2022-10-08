import React, { useState, useEffect } from "react"
import { Flex, useToast, Spinner, Text } from "@chakra-ui/react"
import UserAccount from "./../components/base/UserAccount"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router"
import { logout } from "./../store/userInfoSlice"
import axios from "axios"
import io from "socket.io-client"
import WithHeader from "./../components/custom/WithHeader"
import { useTranslation } from "react-i18next"

const UserId = (props) => {
  const [loading, setLoading] = useState(true)
  const token = useSelector((state) => state.user.token)
  const user = useSelector((state) => state.user.user)
  const toast = useToast({ position: "top", isClosable: true })
  const [homeData, setHomeData] = useState([])
  const [userData, setUserData] = useState(null)
  const router = useRouter()
  const [fetchUser, setFfetchUser] = useState(false)
  const [totalPost, setTotalPost] = useState(0)
  const [totalPage, setTotalPage] = useState(null)
  const [page, setPage] = useState(1)
  const [fetchUserFeed, setFetchUserFeed] = useState(false)
  const [fetchingAgain, setFetchingAgain] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    setFfetchUser(true)
  }, [])

  useEffect(() => {
    //
    if (fetchUser == true) {
      getUserData()
    }
  }, [fetchUser == true])

  useEffect(() => {
    if (fetchUserFeed == true || page > 1) {
      const code = window.location.pathname.split("/")
      const userAccountId = code[code.length - 1]
      const fetchUserFeed = async () => {
        try {
          setFetchingAgain(true)
          const { data } = await axios(
            `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-my-posts/${userAccountId}?page=${page}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          )
          setFetchUserFeed(false)
          const newArray = [...homeData, ...data.post]
          var result = newArray.filter(function (e) {
            var key = Object.keys(e)
              .map((k) => e[k])
              .join("|")
            if (!this[key]) {
              this[key] = true
              return true
            }
          }, {})
          setHomeData([...new Set(result)])
          setTotalPage(data.totalPage)
          setTotalPost(data.postCount)
          setFetchingAgain(false)

          setLoading(false)
        } catch (e) {
          setFetchUserFeed(false)
          setFetchingAgain(false)

          // router.push("/")
          const errorMsg = e.response && e.response.data.message
          console.log(e)
          toast({
            status: "error",
            duration: 5000,
            title: "Invalid user!",
          })
        }
      }
      fetchUserFeed()
    }
  }, [fetchUserFeed == true, page])

  //setup socket
  useEffect(() => {
    if (!loading) {
      const socket = io(process.env.NEXT_PUBLIC_MAIN_PROXY_RAW, {
        query: { token: token, userId: user?.userName },
      })
      socket.on("uesrPosts", (data) => {
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
    setTimeout(() => {
      setHomeData((prev) => {
        const newArray = [...prev]
        // find if the post already exist
        const indexOfNewPost = newArray.findIndex(
          (item) => item._id == post._id
        )
        //if exist replace it with the existingone
        if (indexOfNewPost != -1) {
          newArray[indexOfNewPost] = post
        } else {
          newArray.unshift(post)
        }
        //else add it to the array

        return [...new Set(newArray)]
      })
    }, 1000)
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
      setFetchUserFeed(!fetchUserFeed)
      setFfetchUser(false)
      // fetchInitData(userAccountId)
    } catch (e) {
      setFfetchUser(false)
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

  useEffect(() => {
    props.setHeaderName("My Account")
  }, [])

  return (
    <>
      <Flex w={"100%"} alignItems={"center"} justifyContent="center">
        <Flex w={"100%"}>
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
            <Flex direction={"column"} width={"100%"}>
              <WithHeader totalPost={totalPost} headerName={t("user account")}>
                <UserAccount
                  quoteData={props.quoteData}
                  setQuoteData={props.setQuoteData}
                  isCreateModalOpen={props.isCreateModalOpen}
                  setIsCreateModalOpen={props.setIsCreateModalOpen}
                  post={homeData}
                  setUserData={setUserData}
                  user={userData}
                  page={page}
                  setPage={setPage}
                  totalPage={totalPage}
                  setHomeData={setHomeData}
                />
                {fetchingAgain && (
                  <Flex
                    mt={2}
                    mb={5}
                    alignItems="center"
                    justifyContent={"center"}
                    width={"100%"}
                  >
                    <Spinner color={"rgb(29, 155, 240)"} size={"sm"} />
                  </Flex>
                )}
                {!fetchingAgain && (
                  <Text
                    mb={5}
                    mt={5}
                    textAlign={"center"}
                    fontSize={14}
                    opacity={0.7}
                  >
                    {t("nothing to show")}
                  </Text>
                )}
              </WithHeader>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  )
}
//

export default UserId
export const getServerSideProps = async ({ req, res }) => {
  if (!req.cookies.session) {
    return {
      redirect: {
        destination: "/login",
      },
      props: { isLogin: true },
    }
  }
  return {
    props: { isLogin: false },
  }
}

