import { Flex, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { useRouter } from "next/router"
import HomeComponent from "../components/base/HomeComponent"


export default function Home() {
  const token = useSelector((state) => state.user.token)
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()



   useEffect(() => {
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
         console.log(errorMsg)
       }
     }

     fetchInitData()
   }, [token])



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

 