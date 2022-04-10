import React, { useState, useEffect } from "react"
import {
  Flex,
  Spinner,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text
} from "@chakra-ui/react"
import { useSelector } from "react-redux"
import WithHeader from "../components/custom/WithHeader"
import SingleUserCard from "../components/custom/SingleUserCard"
import useHttp from "../components/utils/useHttp"

const PeoplePage = () => {
  const [loading, setLoading] = useState(true)
  const userData = useSelector((state) => state.user.user)
  const [fetchData, setFetchData] = useState(false)
  const [users, setUsers] = useState([])
  const [blockedUser, setBlockedUser] = useState([])
  const [fetchBlocked, setFetchBlocked] = useState(false)

  useEffect(() => {
    setFetchData(true)
    setFetchBlocked(true)
  }, [])

    const { _ } = useHttp({
      fetchNow: fetchData,
      setFetchNow: setFetchData,
      url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-users/${userData?._id}`,
      isAuth: true,
      isSetData: true,
      setData: setUsers,
      epushTo: "/login",
      cb: () => setLoading(false),
      ecb: () => setLoading(false),
    })


    const { isLoading: _blockedData } = useHttp({
      fetchNow: fetchBlocked,
      setFetchNow: setFetchBlocked,
      url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-blocked-users/${userData?._id}`,
      isAuth: true,
      isSetData: true,
      setData: setBlockedUser,
      epushTo: "/login",
      cb: () => setLoading(false),
      ecb: () => setLoading(false),
    })


  return (
    <>
      <Flex w={"100%"} alignItems={"center"} justifyContent="center">
        <Flex direction="column" minWidth={"100%"}>
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
              {/* tabs will be here for all peopl eand blocked people */}
              <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                  <Tab _focus={{ boxShadow: "none" }}>People</Tab>
                  <Tab _focus={{ boxShadow: "none" }}>Blocked List</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel
                    borderRight={"1px"}
                    borderLeft={"1px"}
                    borderColor={useColorModeValue("gray.200", "#333")}
                    widht="100%"
                    minHeight={"100vh"}
                  >
                    <Flex
                      widht="100%"
                      overflowX="hidden"
                      mt={2}
                      // p={2}
                      direction="column"
                      gap={2}
                    >
                      {users?.map((user, inx) => {
                        return (
                          <SingleUserCard
                            userData={userData}
                            key={inx}
                            user={user}
                          />
                        )
                      })}
                    </Flex>
                  </TabPanel>
                  <TabPanel
                    borderRight={"1px"}
                    borderLeft={"1px"}
                    borderColor={useColorModeValue("gray.200", "#333")}
                    minHeight={"100vh"}
                  >
                    <Flex
                      widht="100%"
                      overflowX="hidden"
                      mt={2}
                      // p={2}
                      direction="column"
                      gap={2}
                    >
                      {blockedUser?.map((user, inx) => {
                        return (
                          <SingleUserCard
                            userData={userData}
                            key={inx}
                            user={user}
                          />
                        )
                      })}
                    </Flex>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </WithHeader>
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default PeoplePage
