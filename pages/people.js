import React, { useState, useEffect } from "react"
import { Flex, Spinner, useColorModeValue } from "@chakra-ui/react"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import WithHeader from "../components/custom/WithHeader"
import axios from "axios"
import SingleUserCard from "../components/custom/SingleUserCard"

const PeoplePage = () => {
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  const [fetchData, setFetchData] = useState(false)
  const [users, setUsers] = useState([])
  const router = useRouter()

  useEffect(() => {
    setFetchData(true)
  }, [])

  useEffect(() => {
    if (fetchData == true) {
      const fetchPeople = async () => {
        try {
          const { data } = await axios(
            `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-users/${user?._id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          )
          setUsers([...data])
        //   console.log(data)
          setLoading(!loading)
          setFetchData(!fetchData)
        } catch (e) {
          setLoading(!loading)
          router.push("/login")
          setFetchData(!fetchData)
          const errorMsg = e.response && e.response.data.message
          console.log(errorMsg)
        }
      }
      fetchPeople()
    }
  }, [fetchData == true])


  return (
    <>
      <Flex w={"100%"} alignItems={"center"} justifyContent="center">
        <Flex
          direction="column"
          minWidth={"100%"}
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
            <WithHeader headerName="People you may know">
              <Flex
                borderRight={"1px"}
                borderLeft={"1px"}
                borderColor={useColorModeValue("gray.200", "#333")}
                minHeight={"90vh"}
                widht="100%"
                overflowX="hidden"
                mt={2}
                p={2}
                direction="column"
                gap={2}
              >

              {users?.map((user, inx) => {
                  return (
                      <SingleUserCard key={inx} user={user} />
                  )
              })}
                
              </Flex>
            </WithHeader>
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default PeoplePage
