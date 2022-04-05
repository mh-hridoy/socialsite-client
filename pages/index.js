import { Flex, Spinner, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { useRouter } from "next/router"
import HomeComponent from "../components/base/HomeComponent"
import io from "socket.io-client"
import { logout } from "../store/userInfoSlice"
import { storeFeed } from "../store/feedSlice"
import WithHeader from "../components/custom/WithHeader"

export default function Home(props) {
  const token = useSelector((state) => state.user.token)
  const [homeData, setHomeData] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user.user)
  const router = useRouter()
  const dispatch = useDispatch()
  const [fetchData, setFetchData] = useState(false)
  const [totalPage, setTotalPage] = useState(null)
  const [page, setPage] = useState(1)
  const [fetchingHomeData, setFetchingHomeData] = useState(false)

  useEffect(() => {
    if (!loading) {
      const socket = io(process.env.NEXT_PUBLIC_MAIN_PROXY_RAW, {
        query: { token: token, userId: user?._id },
      })
      socket.on("posts", (data) => {
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
            // console.log(e)
          }
        } else {
          socket.connect()
        }
      })
    }
  }, [!loading])

  useEffect(() => {
    setFetchData(true)
  }, [])

  useEffect(() => {
    props.setHeaderName("Home")
  }, [])

  const setupAllData = (post) => {
    setTimeout(() => {
      // console.log("socket running")
      setHomeData((prev) => {
        const newArray = [...prev]
        // find if the post already exist
        const indexOfNewPost = newArray.findIndex(
          (item) => item._id == post._id
        )
        // console.log(indexOfNewPost)
        //if exist replace it with the existing-one
        if (indexOfNewPost != -1) {
          newArray[indexOfNewPost] = post
        } else {
          newArray.unshift(post)
        }
        //else add it to the array
        dispatch(storeFeed({ data: [...new Set(newArray)] }))

        return [...new Set(newArray)]
      })
    }, 3500)
  }

  // console.log(homeData)

  useEffect(() => {
    if (fetchData == true || page > 1) {
      const fetchInitData = async () => {
        setFetchingHomeData(true)
        try {
          const { data } = await axios(
            `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-posts/${user?._id}?page=${page}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          )
          const newArray = [...homeData, ...data.post]
          const withoutDup = [...new Set(newArray)]
          setHomeData(withoutDup)
          dispatch(storeFeed({ data: newArray }))

          setTotalPage(data.totalPage)
          setFetchingHomeData(false)

          setLoading(false)
        } catch (e) {
          router.push("/login")
          setFetchingHomeData(false)

          const errorMsg = e.response && e.response.data.message
        }
      }

      fetchInitData()
    }

    return () => setFetchData(false)
  }, [fetchData == true, page])

  return (
    <>
      <Flex w={"100%"} alignItems={"center"} justifyContent="center">
        <Flex minWidth={"100%"}>
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
            <Flex
              // border={"1px solid red"}
              minWidth="100%"
              direction="column"
            >
              <WithHeader headerName={props.headerName}>
                <HomeComponent
                  fetchingHomeData={fetchingHomeData}
                  totalPage={totalPage}
                  page={page}
                  setPage={setPage}
                  homeData={homeData}
                  setHomeData={setHomeData}
                />
              </WithHeader>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  )
}
