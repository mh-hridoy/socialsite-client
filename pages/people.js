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
import { useTranslation } from "react-i18next"

const PeoplePage = () => {
  const [loading, setLoading] = useState(true)
  const userData = useSelector((state) => state.user.user)
  const [fetchData, setFetchData] = useState(false)
  const [users, setUsers] = useState([])
  const [blockedUser, setBlockedUser] = useState([])
  const [fetchBlocked, setFetchBlocked] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setFetchData(true)
    setFetchBlocked(true)
  }, [])

    const { isLoading: userDataLoading } = useHttp({
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


    const { isLoading: blockedDataLoading } = useHttp({
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
            <WithHeader headerName={t("people you know")}>
              {/* tabs will be here for all peopl eand blocked people */}
              <Tabs
                borderRight={"1px"}
                borderLeft={"1px"}
                borderColor={useColorModeValue("gray.200", "#333")}
              >
                <TabList mb="1em">
                  <Tab _focus={{ boxShadow: "none" }}>{t("people")}</Tab>
                  <Tab _focus={{ boxShadow: "none" }}>{t("Blocked")}</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel
                    borderRight={"1px"}
                    borderLeft={"1px"}
                    borderColor={useColorModeValue("gray.200", "#333")}
                    widht="100%"
                    minHeight={"100vh"}
                  >
                    {userDataLoading && (
                      <Flex
                        height="100vh"
                        alignItems={"center"}
                        justifyContent="center"
                        width={"100%"}
                      >
                        <Spinner color={"rgb(29, 155, 240)"} size={"xl"} />
                      </Flex>
                    )}
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

                      {!userDataLoading && users?.length == 0 && (
                        <Flex
                          height={"80vh"}
                          width="100%"
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <Text fontSize={14} opacity={0.8}>
                            {t("nothing to show")}
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                  </TabPanel>
                  <TabPanel
                    borderRight={"1px"}
                    borderLeft={"1px"}
                    borderColor={useColorModeValue("gray.200", "#333")}
                    minHeight={"100vh"}
                  >
                    {blockedDataLoading && (
                      <Flex
                        height="100vh"
                        alignItems={"center"}
                        justifyContent="center"
                        width={"100%"}
                      >
                        <Spinner color={"rgb(29, 155, 240)"} size={"xl"} />
                      </Flex>
                    )}
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
                      {!blockedDataLoading && blockedUser?.length == 0 && (
                        <Flex
                          height={"80vh"}
                          width="100%"
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <Text fontSize={14} opacity={0.8}>
                            {t("nothing to show")}
                          </Text>
                        </Flex>
                      )}
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


