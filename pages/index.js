import { Flex, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { useRouter } from "next/router"
import HomeComponent from "../components/base/HomeComponent"
import io from "socket.io-client"
 import {logout} from '../store/userInfoSlice'

export default function Home() {
  const token = useSelector((state) => state.user.token)
  const user = useSelector((state) => state.user.user)
  const [homeData, setHomeData] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const dispatch = useDispatch()
  const [fetchData, setFetchData] = useState(false)

useEffect(() => {
  if(!loading) {
    const socket = io(process.env.NEXT_PUBLIC_MAIN_PROXY_RAW, {
      query: { token: token},
    })
    socket.on("posts", (data) => {
      console.log(data)
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


useEffect(() => {
  setFetchData(true)
}, [])

const setupAllData= (post) => {
    // console.log(post)
  setHomeData((prev) => {
    const newArray = [...prev]
    // find if the post already exist
      const indexOfNewPost = newArray.findIndex((item) => item._id == post._id )
    //if exist replace it with the existingone
    if(indexOfNewPost != -1) {
      newArray[indexOfNewPost] = post
    }else{
      newArray.unshift(post)
    }
    //else add it to the array

    return [...new Set(newArray)]
  })
}

// console.log(homeData)

   useEffect(() => {
     if (fetchData) {
       const fetchInitData = async () => {
         try {
           const { data } = await axios(
             `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-posts`,
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
           router.push("/login")
           const errorMsg = e.response && e.response.data.message
           // console.log(errorMsg)
         }
       }

       fetchInitData()
     }

     return(() => {
       setFetchData(false)
     })
   }, [fetchData])



  return (
    <>
      {loading ? (
        <Flex alignItems={"center"} justifyContent="center" height={"80vh"} width={"100%"}>
          <Spinner color={"#ff552f"} size={"xl"} />
        </Flex>
      ) : (
        <HomeComponent homeData={homeData} />
      )}
    </>
  )
}

 