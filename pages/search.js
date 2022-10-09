import React, { useRef, useState, useEffect } from "react"
import {
  Flex,
  useColorModeValue,
  Button,
  Input,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Spinner,
} from "@chakra-ui/react"
import useHttp from "../components/utils/useHttp"
import {useSelector} from "react-redux"
import FeedCard from '../components/custom/FeedCard'
import SingleUserCard from "../components/custom/SingleUserCard"
import { useTranslation } from "react-i18next"

const SearchPage = ({
  quoteData,
  setQuoteData,
  isCreateModalOpen,
  setIsCreateModalOpen,
  setHomeData,
  homeData,

}) => {
  const [searchValue, setSearchValue] = useState("")
  const [postValue, setPostValue] = useState([])
  const user = useSelector((state) => state.user.user)
  const [usersValue, setUsersValue] = useState([])
  const [searchPost, setSearchPost] = useState(false)
  const [searchUsers, setSearchUsers] = useState(false)
  const toast = useToast({ position: "top", isClosable: true })
  const searchRef = useRef(null)
  const { t } = useTranslation()

  //for post
  const { isLoading: isPostLoading } = useHttp({
    fetchNow: searchPost,
    setFetchNow: setSearchPost,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/search-post/${user?._id}?text=${searchValue}`,
    isSetData: true,
    setData: setPostValue,
    isAuth: true,
    isEToast: false,
  })

  //for people
  const { isLoading: isPeopleLoading } = useHttp({
    fetchNow: searchUsers,
    setFetchNow: setSearchUsers,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/search-user/${user?._id}?user=${searchValue}`,
    isSetData: true,
    setData: setUsersValue,
    isAuth: true,
    isEToast: false,
  })


  useEffect(() => {
    searchRef.current.focus()
  }, [])

  const searchHandler = (e) => {
    e.preventDefault()
    if (!searchValue) {
      return toast({
        status: "error",
        duration: 5000,
        title: "Search cannot be esearchTextmpty!",
      })
    }

    setSearchPost(true)
    setSearchUsers(true)
  }

  return (
    <Flex
      minHeight={"100vh"}
      borderRight={"1px"}
      borderLeft={"1px"}
      direction="column"
      borderColor={useColorModeValue("gray.200", "#333")}
    >
      <Flex
        position="sticky"
        top={0}
        left={0}
        zIndex={100}
        backdropFilter="blur(3px)"
        bg={useColorModeValue("whiteAlpha.800", "#1A202C88")}
        width={"100%"}
        height={45}
        alignItems="center"
      >
        <form
          onSubmit={searchHandler}
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Input
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
            rounded={"full"}
            fontSize={14}
            ref={searchRef}
            placeholder={t("search placeholder")}
            id="search"
            _focus={{ boxShadow: "none" }}
            borderColor={useColorModeValue("#1A202C88", "whiteAlpha.400")}
            width={["80%", "80%", "60%"]}
            size="sm"
          />
          <Button
            isLoading={isPostLoading || isPeopleLoading}
            rounded={"full"}
            type={"submit"}
            size="sm"
            bg="buttonColor"
          >
            Submit
          </Button>
        </form>
      </Flex>

      <Flex>
        <Flex
          justifyContent={"center"}
          alignItems="center"
          mt={10}
          width={"100%"}
        >
          <Tabs width={"100%"} size={"sm"}>
            <TabList _focus={{ boxShadow: "none" }} gap={10}>
              <Tab _focus={{ boxShadow: "none" }}>{t("posts")}</Tab>
              <Tab _focus={{ boxShadow: "none" }}>{t("people")}</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {!isPostLoading && postValue.length == 0 && (
                  <Text
                    mt={10}
                    fontSize={14}
                    opacity={0.8}
                    textAlign={"center"}
                  >
                    {" "}
                    {t("search no result")}
                  </Text>
                )}

                {isPostLoading && (
                  <Flex
                    height="100vh"
                    alignItems={"center"}
                    justifyContent="center"
                    width={"100%"}
                  >
                    <Spinner color={"rgb(29, 155, 240)"} size={"xl"} />
                  </Flex>
                )}
                {/* //feed card will be here */}

                {postValue.length != 0 && (
                  <Flex minWidth={"100%"} direction="column">
                    {postValue.map((item, inx) => {
                      return (
                        <FeedCard
                          key={inx}
                          quoteData={quoteData}
                          setQuoteData={setQuoteData}
                          isCreateModalOpen={isCreateModalOpen}
                          setIsCreateModalOpen={setIsCreateModalOpen}
                          setHomeData={setHomeData}
                          item={item}
                        />
                      )
                    })}
                  </Flex>
                )}
              </TabPanel>
              <TabPanel>
                {!isPeopleLoading && usersValue.length == 0 && (
                  <Text
                    mt={10}
                    fontSize={14}
                    opacity={0.8}
                    textAlign={"center"}
                  >
                    {" "}
                    {t("search no result")}
                  </Text>
                )}

                {isPeopleLoading && (
                  <Flex
                    height="100vh"
                    alignItems={"center"}
                    justifyContent="center"
                    width={"100%"}
                  >
                    <Spinner color={"rgb(29, 155, 240)"} size={"xl"} />
                  </Flex>
                )}

                {/* //user card will be here */}
                {usersValue.length != 0 && (
                  <Flex minWidth={"100%"} direction="column">
                    {usersValue.map((item, inx) => {
                      return (
                        <SingleUserCard userData={user} key={inx} user={item} />
                      )
                    })}
                  </Flex>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SearchPage
