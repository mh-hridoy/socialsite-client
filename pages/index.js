import { Flex, useToast, Spinner } from "@chakra-ui/react"
import CreateNewFeed from "../components/custom/CreateNewFeed";
import { useEffect, useState } from "react";
import {useSelector} from 'react-redux'
import AuthRoute from "../components/base/AuthRoute";
import axios from 'axios'
import AllPost from "../components/custom/AllPost";

export default function Home() {
  const token = useSelector((state) => state.user.token)
    const toast = useToast({ position: "top", isClosable: true })
    const [homeData , setHomeData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [fetchData, setFetchData] = useState(true)
  useEffect(() => {
    //
    if (fetchData && token) {
      fetchInitData()
    }

    return () => setFetchData(!fetchData)
  }, [fetchData && token])

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
      const errorMsg = e.response && e.response.data.message
      setLoading(false)
      console.log(errorMsg)
      toast({
        status: "error",
        duration: 5000,
        title: "Something went wrong!!!",
      })
    }

  }


  return (
    <AuthRoute>
      <Flex
        alignItems={"center"}
        justifyContent="center"
        marginBottom={5}
        w={"100%"}
        pt={5}
      >
        <Flex w={["90%", "90%", "75%"]} direction={"column"} gap={4}>
          <CreateNewFeed />
          {loading ? (
            <Flex alignItems={"center"} justifyContent="center" width={"100%"}>
              <Spinner color={"#ff552f"} size={"xl"} />
            </Flex>
          ) : (
            <AllPost post={homeData} />
          )}
        </Flex>
      </Flex>
    </AuthRoute>
  )
}
