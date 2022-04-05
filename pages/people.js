import React, { useState, useEffect } from "react"
import { Flex, Spinner, useColorModeValue } from "@chakra-ui/react"
import { useSelector } from "react-redux"
import WithHeader from "../components/custom/WithHeader"
import SingleUserCard from "../components/custom/SingleUserCard"
import useHttp from "../components/utils/useHttp"

const PeoplePage = () => {
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user.user)
  const [fetchData, setFetchData] = useState(false)
  const [users, setUsers] = useState([])

  useEffect(() => {
    setFetchData(true)
  }, [])

    const { _ } = useHttp({
      fetchNow: fetchData,
      setFetchNow: setFetchData,
      url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-users/${user?._id}`,
      isAuth: true,
      isSetData: true,
      setData: setUsers,
      epushTo: "/login",
      cb: () => setLoading(false),
      ecb: () => setLoading(false),
    })


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
