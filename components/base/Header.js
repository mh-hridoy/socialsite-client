import React, {useState} from 'react'
import {
  Flex,
  Box,
  Heading,
  Button,
  Spacer,
  HStack,
  useColorMode,
  Avatar,
  useColorModeValue,
  Spinner,
  useToast,
  Show,
} from "@chakra-ui/react"
import { MdOutlineDarkMode } from "react-icons/md"
import {useRouter} from 'next/router'
import {
  MdOutlineFeed,
  MdOutlineRssFeed,
  MdOutlineLogout,
} from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { logout } from "../../store/userInfoSlice"

const Header = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const {colorMode, toggleColorMode} = useColorMode()
  const user = useSelector((state) => state.user.user )
  const pathName = global.window && window.location.pathname
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast({position: "top"})


  const logoutHandler = async () => {
    try {
      setIsLoading(true)
      await axios(`${process.env.NEXT_PUBLIC_MAIN_PROXY}/logout`)

      dispatch(logout({ user: null, token: "" }))
      localStorage.removeItem("user")
      setIsLoading(false)

      router.push("/login")
      toast({
        status: "success",
        duration: 3000,
        title: "Succesfully logged out!",
      })
    } catch (e) {
      setIsLoading(false)
      const errorMsg = e.response
        ? e.response.data.message
        : "Something went wrong!!!"

      toast({
        status: "error",
        duration: 5000,
        title: errorMsg,
      })
    }
  }

  return (
    <>
      <Flex
        position="sticky"
        width="100%"
        bg={useColorModeValue("#fff", "#1A202C")}
        top={0}
        left={0}
        padding={2}
        paddingRight={5}
      >
        <Box p="2" cursor={"pointer"} onClick={() => router.push("/")}>
          <Heading color="buttonColor" size="md">
            Logo & Name
          </Heading>
        </Box>
        <Spacer />
        <Box>
          <HStack spacing={[18, 25]}>
            <MdOutlineDarkMode
              color={`${colorMode == "dark" ? "#fff" : "#1A202C"}`}
              onClick={() => toggleColorMode()}
              cursor="pointer"
              size={25}
            />
            {user !== null && (
              <Show below="md">
                <MdOutlineFeed
                  onClick={() => router.push("/")}
                  color={`${
                    pathName == "/"
                      ? useColorModeValue("#ff552f", "#ff552f")
                      : useColorModeValue("#000", "#ffff")
                  }`}
                  cursor="pointer"
                  size={25}
                />
                <MdOutlineRssFeed
                  onClick={() => router.push("/rss-feed")}
                  color={`${
                    pathName == "/rss-feed"
                      ? useColorModeValue("#ff552f", "#ff552f")
                      : useColorModeValue("#000", "#ffff")
                  }`}
                  cursor="pointer"
                  size={25}
                />
              </Show>
            )}
            {user !== null ? (
              <Show below="md">
                <Flex gap={10} alignItems="center" justifyContent={"center"}>
                  <Avatar
                    onClick={() => router.push(`/account/${user._id}`)}
                    cursor={"pointer"}
                    border={pathName.includes(user._id) && "2px solid #ff552f"}
                    size={"sm"}
                    name={user && user.fullName}
                    src="https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80"
                  ></Avatar>
                  {!isLoading ? (
                    <MdOutlineLogout
                      onClick={logoutHandler}
                      color={`${colorMode == "dark" ? "#fff" : "#1A202C"}`}
                      cursor="pointer"
                      size={25}
                    />
                  ) : (
                    <Spinner />
                  )}
                </Flex>
              </Show>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                bgColor="buttonColor"
                mr="4"
              >
                Login/Signup
              </Button>
            )}
          </HStack>
        </Box>
      </Flex>
    </>
  )
}

export default Header