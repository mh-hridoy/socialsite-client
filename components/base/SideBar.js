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
ModalCloseButton
} from "@chakra-ui/react"

import { useRouter } from "next/router"
import React, { useState } from "react"
import {
  MdHome,
  MdOutlineRssFeed,
  MdAdd,
  MdOutlineLogout,
  MdOutlineDarkMode,
  MdOutlineAccountCircle,
  MdPeopleOutline,
} from "react-icons/md"
import { BsSun } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import useHttp from "../utils/useHttp"
import { logout } from "../../store/userInfoSlice"
import CreateNewFeed from "../custom/CreateNewFeed"

const SideBar = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const router = useRouter()
  const user = useSelector((state) => state.user.user)
  const pathName = router.pathname
const [isModalOpen, setIsModalOpen] = useState(false)
const [logoutRequest, setLogoutRequest] = useState(false)


  const item = [
    {
      name: "Feeds",
      Icon: MdHome,
      uri: "/",
      path: `/`,
    },
    {
      name: "Profile",
      Icon: MdOutlineAccountCircle,
      uri: `/account/myaccount/${user !== null && user._id}`,
      path: `/account/myaccount/[user]`,
    },
    {
      name: "People",
      Icon: MdPeopleOutline,
      uri: `/people`,
      path: `/people`,
    },

    {
      name: "RSS Feed",
      Icon: MdOutlineRssFeed,
      uri: "/rss-feed",
      path: `/rss-feed`,
    },
  ]


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


  const logoutHandler =  () => {
    setLogoutRequest(true)
  }


  return (
    <>
      <Modal
        size={"xl"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(!isModalOpen)
        }}
      >
        <ModalOverlay />
        <ModalContent maxHeight={"90%"} padding={10}>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <CreateNewFeed
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
            height={"80vh"}
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
                  fontWeight={pathName == path ? 700 : undefined}
                  _hover={{
                    backgroundColor: useColorModeValue("gray.100", "#333333"),
                  }}
                  cursor={"pointer"}
                  fontSize={16}
                  gap={2}
                  alignItems={"center"}
                  key={inx}
                >
                  <Icon size={26} /> <Show above="xl">{name}</Show>
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
                    <Text>Light Mode</Text>
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
                    <Text>Dark Mode</Text>{" "}
                  </Show>
                </>
              )}
            </WrapItem>

            <Button
              onClick={() => setIsModalOpen(!isModalOpen)}
              bg="buttonColor"
              gap={2}
              padding={0}
              width={["20px", "20px", "20px", "20px", "200px"]}
              rounded="full"
            >
              <MdAdd /> <Show above="xl">New</Show>
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
            gap={2}
            cursor="pointer"
            rounded="full"
            onClick={() => logoutHandler()}
          >
            <Show above="xl">
              <Avatar
                _hover={{ border: "2px solid rgb(29, 155, 240)" }}
                cursor="pointer"
                size={"sm"}
                name={user && user.fullName ? user.fullName : "Not A User"}
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
                {user.fullName}
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
