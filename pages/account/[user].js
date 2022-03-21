import React, {useState, useEffect} from 'react'
import { Flex, useToast, Spinner } from "@chakra-ui/react"
import UserAccount from '../../components/base/UserAccount'
import {useSelector} from 'react-redux'
import {useRouter} from 'next/router'
import axios from 'axios'
const UserId = () => {
    const [loading, setLoading] = useState(true)
    const [fetchData, setFetchData] = useState(true)
  const token = useSelector((state) => state.user.token)
  // const user = useSelector((state) => state.user.user)
  const toast = useToast({ position: "top", isClosable: true })
    const [homeData, setHomeData] = useState(null)
    const [userData, setUserData]= useState(null)
  const router = useRouter()

    const userAccountId = router.query.user

  useEffect(() => {
    //
    if (fetchData && token) {
      getUserData()
    }

    return () => setFetchData(!fetchData)
  }, [fetchData && token])

  const fetchInitData = async () => {
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


  const getUserData = async () => {
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
        fetchInitData()
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