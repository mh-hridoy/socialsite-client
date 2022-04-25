import {
  Wrap,
  WrapItem,
  useColorModeValue,
  Spinner,
  useColorMode,
  Avatar,
  Flex,
  Text,
  Show,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  Badge,
  ModalCloseButton,
  Select,
} from "@chakra-ui/react"

import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import {
  MdHome,
  MdOutlineRssFeed,
  MdAdd,
  MdOutlineLogout,
  MdOutlineDarkMode,
  MdOutlineAccountCircle,
  MdPeopleOutline,
  MdSearch,
  MdNotificationsNone,
} from "react-icons/md"
import { BsSun } from "react-icons/bs"
import { useSelector, useDispatch } from "react-redux"
import useHttp from "../utils/useHttp"
import { logout } from "../../store/userInfoSlice"
import { storeData, manageData} from "../../store/notificationSlice"
import CreateNewFeed from "../custom/CreateNewFeed"
import axios from "axios"
import io from "socket.io-client"
import {  useTranslation } from "react-i18next"

const SideBar = ({
  isModalOpen,
  setIsModalOpen,
  quoteData,
  setQuoteData,
  
}) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const router = useRouter()
  const user = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  const pathName = router.pathname
  const [logoutRequest, setLogoutRequest] = useState(false)
  const dispatch = useDispatch()
  const [selectedLanguage, setSelectedLanguage] = useState()
  const {t, i18n } = useTranslation()
  
  const unread = useSelector((state) => state.notifications.unread)
  const myAccountPath = `/${user?.userName}`

  const langs = [
    { value: "ar", label: "Arabic", nativeName: "العربية" },
    { value: "en", label: "English", nativeName: "English" },
    { value: "hi", label: "Hindi", nativeName: "हिन्दी" },
    { value: "es", label: "Spanish", nativeName: "español" },
    { value: "fr", label: "French", nativeName: "français" },
    { value: "zh", label: "Chinese", nativeName: "中文" },
    {
      value: "ja",
      label: "Japanese",
      nativeName: "日本語",
    },
    { value: "it", label: "Italian", nativeName: "Italiano" },
    { value: "ko", label: "Korean", nativeName: "한국어 (韓國語)," },
    { value: "tr", label: "Turkish", nativeName: "Türkçe" },
    { value: "ru", label: "Russian", nativeName: "русский язык" },
  ]

  useEffect(() => {
    const langName = document.cookie.split("i18next=")[1] || "en"
    
    setSelectedLanguage(langName)
  }, [])



  useEffect(() => {
    if (user != null) {
      const socket = io(process.env.NEXT_PUBLIC_MAIN_PROXY_RAW, {
        query: { token: token, userId: user?._id },
      })
      socket.on("notification", (data) => {
        dispatch(manageData(data))
      })

      socket.on("connect_error", async (err) => {
        if (err.message == "Authentication error") {
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
  }, [user != null])


  const item = [
    {
      name: t("Feeds"),
      Icon: MdHome,
      uri: "/",
      path: `/`,
    },
    {
      name: t("Profile"),
      Icon: MdOutlineAccountCircle,
      uri: `/${user?.userName}`,
      path: `/[user]`,
    },
    {
      name: t("People"),
      Icon: MdPeopleOutline,
      uri: `/people`,
      path: `/people`,
    },
    {
      name: t("Search"),
      Icon: MdSearch,
      uri: `/search`,
      path: `/search`,
    },
    {
      name: t("Notifications"),
      Icon: MdNotificationsNone,
      uri: `/notification`,
      path: `/notification`,
    },

    {
      name: t("RSS Feeds"),
      Icon: MdOutlineRssFeed,
      uri: "/rss-feed",
      path: `/rss-feed`,
    },
  ]


  useEffect(() => {
    if (user != null) {
      const fetchNoti = async () => {
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-noti/${user._id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          )
          dispatch(storeData(data))
        } catch (e) {
          console.log(e)
        }
      }

      fetchNoti()
    }
  }, [user != null])

  const { isLoading } = useHttp({
    fetchNow: logoutRequest,
    setFetchNow: setLogoutRequest,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/logout`,
    isLocalStorage: true,
    removeStore: true,
    isDispatch: true,
    dispatchFunc: logout,
    outDispatch: true,
    isEToast: true,
    isPush: true,
    pushTo: "/login",
  })

  const logoutHandler = () => {
    setLogoutRequest(true)
  }

  return (
    <>
      <Modal
        size={"xl"}
        isOpen={isModalOpen}
        onClose={() => {
          setQuoteData(null)
          setIsModalOpen(!isModalOpen)
        }}
      >
        <ModalOverlay />
        <ModalContent padding={10}>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <CreateNewFeed
            quoteData={quoteData}
            setQuoteData={setQuoteData}
            name="file2"
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </ModalContent>
      </Modal>

      {user !== null ? (
        <Flex
          height={"100vh"}
          width={["15%", "15%", "20%", "20%", "35%"]}
          position={"sticky"}
          direction={"column"}
          top={0}
          px={[0, 0, 10]}
        >
          <Wrap
            height={"90vh"}
            direction={"column"}
            gap={5}
            overflowX="hidden"
            overflowY={"auto"}
          >
            <Text
              cursor="pointer"
              onClick={() => router.push("/")}
              px={4}
              fontSize={28}
              color="buttonColor"
              mb={4}
            >
              L
            </Text>
            {item.map((item, inx) => {
              const { Icon, name, uri, path } = item
              return (
                <WrapItem
                  py={3}
                  px={3}
                  rounded="full"
                  onClick={() => router.push(uri)}
                  fontWeight={
                    pathName == path ? 700 : undefined
                  }
                  _hover={{
                    backgroundColor: useColorModeValue("gray.100", "#333333"),
                  }}
                  cursor={"pointer"}
                  fontSize={16}
                  gap={2}
                  alignItems={"center"}
                  key={inx}
                >
                  {path == "/notification" ? (
                    <>
                      <Text display={"flex"}>
                        {" "}
                        <Icon size={26} />
                        {unread > 0 && (
                          <Badge
                            rounded={"full"}
                            position={"absolute"}
                            ml="1"
                            colorScheme="red"
                          >
                            {unread}
                          </Badge>
                        )}
                      </Text>
                      <Show above="xl">{name}</Show>
                    </>
                  ) : (
                    <>
                      <Icon size={26}>
                        <Badge ml="1" colorScheme="green">
                          New
                        </Badge>
                      </Icon>
                      <Show above="xl">{name}</Show>
                    </>
                  )}
                </WrapItem>
              )
            })}

            <WrapItem
              _hover={{
                backgroundColor: useColorModeValue("gray.100", "#333333"),
              }}
              cursor={"pointer"}
              px={3}
              fontSize={16}
              rowGap={2}
              py={2}
              rounded="full"
              gap={2}
              onClick={() => toggleColorMode()}
              alignItems={"center"}
            >
              {colorMode == "dark" ? (
                <>
                  <BsSun
                    color={`${colorMode == "dark" ? "#fff" : "#1A202C"}`}
                    cursor="pointer"
                    size={26}
                  />{" "}
                  <Show above="xl">
                    {" "}
                    <Text>{t("Light Mode")}</Text>
                  </Show>
                </>
              ) : (
                <>
                  <MdOutlineDarkMode
                    color={`${colorMode == "dark" ? "#fff" : "#1A202C"}`}
                    cursor="pointer"
                    size={26}
                  />{" "}
                  <Show above="xl">
                    <Text>{t("Dark Mode")}</Text>{" "}
                  </Show>
                </>
              )}
            </WrapItem>

            <WrapItem
              _hover={{
                backgroundColor: useColorModeValue("gray.100", "#333333"),
              }}
              cursor={"pointer"}
              px={3}
              fontSize={16}
              rowGap={2}
              py={2}
              rounded="full"
              gap={2}
              alignItems={"center"}
            >
              <Select
              dir="ltr"
                size="sm"
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  i18n.changeLanguage(e.target.value);
                   if (e.target.value == "ar") {
                     document.body.dir = "rtl"
                   } else {
                     document.body.dir = "ltr"
                   }
                }}
                defaultValue={selectedLanguage}
              >
                {langs.map((lang, index) => {
                  return (
                    <option key={index} value={lang.value}>
                      {lang.nativeName}
                    </option>
                  )
                })}
              </Select>
            </WrapItem>

            <Button
              onClick={() => setIsModalOpen(!isModalOpen)}
              bg="buttonColor"
              gap={2}
              padding={0}
              width={["20px", "20px", "20px", "20px", "200px"]}
              rounded="full"
            >
              <MdAdd /> <Show above="xl">{t("New")}</Show>
            </Button>
          </Wrap>

          <Flex
            _hover={{
              backgroundColor: useColorModeValue("gray.100", "#333333"),
            }}
            px={2}
            py={2}
            alignItems="center"
            justifyContent={"center"}
            gap={1}
            cursor="pointer"
            rounded="full"
            onClick={() => logoutHandler()}
          >
            <Show above="xl">
              <Avatar
                _hover={{ border: "2px solid rgb(29, 155, 240)" }}
                cursor="pointer"
                size={"sm"}
                name={user && user.fullName ? user?.fullName : "Not A User"}
                src={user?.profilePicture?.img}
              ></Avatar>
            </Show>

            <Show below="xl">
              <MdOutlineLogout size={22} />{" "}
              {isLoading && <Spinner size={"sm"} />}
            </Show>

            <Show above="xl">
              <Text
                display={"flex"}
                alignItems="center"
                gap={2}
                fontWeight={600}
                fontSize={15}
              >
                {user?.fullName}
                {isLoading ? (
                  <Spinner size={"sm"} />
                ) : (
                  <MdOutlineLogout size={22} />
                )}
              </Text>
            </Show>
          </Flex>
        </Flex>
      ) : null}
    </>
  )
}

export default SideBar
