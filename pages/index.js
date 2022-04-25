import { Flex, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { useRouter } from "next/router"
import HomeComponent from "../components/base/HomeComponent"
import io from "socket.io-client"
import { logout } from "../store/userInfoSlice"
import { setAllHomeData, setHomeData } from "../store/homeDataSlice"
import WithHeader from "../components/custom/WithHeader"
import { useTranslation } from "react-i18next"

export default function Home(props) {
  const token = useSelector((state) => state.user.token)
  const homeData = useSelector((state) => state.homeData.homeData)
  const [loading, setLoading] = useState(homeData.length > 0 ? false : true)
  const user = useSelector((state) => state.user.user)
  const router = useRouter()
  const dispatch = useDispatch()
  const [fetchData, setFetchData] = useState(false)
  const [totalPage, setTotalPage] = useState(null)
  const [page, setPage] = useState(1)
  const [fetchingHomeData, setFetchingHomeData] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (!loading) {
      const socket = io(process.env.NEXT_PUBLIC_MAIN_PROXY_RAW, {
        query: { token: token, userId: user?._id },
      })
      socket.on("posts", (data) => {
        // console.log(data)
        // console.log(data)
                  dispatch(setHomeData(data))
        // setupAllData(data)
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
          dispatch(setAllHomeData(data.post))
        

          setTotalPage(data.totalPage)
          setFetchingHomeData(false)
          setFetchData(false)
          setLoading(false)
        } catch (e) {
          router.push("/login")
          setFetchData(false)
          setFetchingHomeData(false)

          const errorMsg = e.response && e.response.data.message
        }
      }

      fetchInitData()
    }

  }, [fetchData == true, page])


  return (
    <>
      <Flex w={"100%"}  alignItems={"center"} justifyContent="center">
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
              minWidth="100%"
              direction="column"
            >
              <WithHeader headerName={t("home")}>
                <HomeComponent
                  quoteData={props.quoteData}
                  setQuoteData={props.setQuoteData}
                  isCreateModalOpen={props.isCreateModalOpen}
                  setIsCreateModalOpen={props.setIsCreateModalOpen}
                  fetchingHomeData={fetchingHomeData}
                  totalPage={totalPage}
                  page={page}
                  setPage={setPage}
               
                />
              </WithHeader>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  )
}
