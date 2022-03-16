import {
  Wrap,
  WrapItem,
  useColorModeValue,
  Spinner,
  useToast,
} from "@chakra-ui/react"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useState } from "react"
import {
  MdOutlineFeed,
  MdOutlineRssFeed,
  MdOutlineLogout,
  MdOutlineAccountCircle,
} from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import { logout } from "../../store/userInfoSlice"

const SideBar = () => {
  const router = useRouter()
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const toast = useToast({ position: "top" })
  const [isLoading, setIsLoading] = useState(false)
  const pathName = window.location.pathname

  const item = [
    {
      name: "Feeds",
      Icon: MdOutlineFeed,
      uri: "/",
    },
    {
      name: "My Account",
      Icon: MdOutlineAccountCircle,
      uri: `/account/${user !== null && user._id}`,
    },

    {
      name: "RSS Feed",
      Icon: MdOutlineRssFeed,
      uri: "/rss-feed",
    },
  ]

  const logoutHandler = async () => {
 

    try {
      setIsLoading(true)
      await axios(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/logout`)

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
      {user !== null ? (
        <Wrap
          m={5}
          alignItems="center"
          justifyContent={"center"}
          minW={250}
          spacing={5}
        >
          <Wrap
            position="fixed"
            shadow={"md"}
            transform={"translateX(30%)"}
            p={10}
            maxW={190}
            overflow="hidden"
            bg={useColorModeValue("#fff", "#333")}
            maxH={350}
            m={5}
            rounded="lg"
            direction={"column"}
            spacing={5}
          >
            {item.map((item, inx) => {
              const { Icon, name, uri } = item
              return (
                <WrapItem
                  color={
                    pathName == uri
                      ? useColorModeValue("buttonColor", "buttonColor")
                      : useColorModeValue("dark", "white")
                  }
                  onClick={() => router.push(uri)}
                  fontWeight={700}
                  _hover={{ color: "buttonColor" }}
                  cursor={"pointer"}
                  fontSize={14}
                  gap={2}
                  alignItems={"center"}
                  key={inx}
                >
                  <Icon /> {name}
                </WrapItem>
              )
            })}

            <WrapItem
              onClick={() => logoutHandler()}
              fontWeight={700}
              _hover={{ color: "buttonColor" }}
              cursor={"pointer"}
              fontSize={14}
              rowGap={2}
              gap={2}
              alignItems={"center"}
            >
              <MdOutlineLogout /> {isLoading ? <Spinner size={"sm"} /> : "Logout"}
            </WrapItem>
          </Wrap>
        </Wrap>
      ) : null}
    </>
  )
}

export default SideBar
