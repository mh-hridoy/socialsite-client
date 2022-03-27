import React, { useState } from "react"
import {
  Flex,
  Text,
  Button,
  Avatar,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import { MdVerified } from "react-icons/md"
import axios from "axios"

const UserModel = ({ user }) => {
  const userInfo = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  const router = useRouter()
  const [isVloading, setIsVloading] = useState(false)
  const [isDloading, setIsDloading] = useState(false)
  const toast = useToast({ position: "top", isClosable: true })

  const verifyHandler = async (id) => {
    try {
      setIsVloading(!isVloading)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/verify-account/${userInfo._id}`,
        { userId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      setIsVloading(!isVloading)
      toast({
        status: "success",
        duration: 5000,
        title: data,
      })
      router.reload()
    } catch (e) {
      router.push("/")
      setIsVloading(!isVloading)

      const errorMsg = e.response && e.response.data.message
      toast({
        status: "error",
        duration: 5000,
        title: errorMsg || "Something went wrong!!!",
      })
      // console.log(errorMsg)
    }
  }

  const unVerifyHandler = async (id) => {
     try {
       setIsVloading(!isVloading)
       const { data } = await axios.post(
         `${process.env.NEXT_PUBLIC_MAIN_PROXY}/unverify-account/${userInfo._id}`,
         { userId: id },
         {
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
           },
           withCredentials: true,
         }
       )
       setIsVloading(!isVloading)
       toast({
         status: "success",
         duration: 5000,
         title: data,
       })
       router.reload()
     } catch (e) {
       router.push("/")
       setIsVloading(!isVloading)

       const errorMsg = e.response && e.response.data.message
       toast({
         status: "error",
         duration: 5000,
         title: errorMsg || "Something went wrong!!!",
       })
       // console.log(errorMsg)
     }
  }

  const deleteHandler = async (id) => {
    try {
      setIsDloading(!isDloading)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/delete-account/${userInfo._id}`,
        { userId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      setIsDloading(!isDloading)
      toast({
        status: "success",
        duration: 5000,
        title: data,
      })
      router.reload()
    } catch (e) {
      router.push("/")
      setIsDloading(!isDloading)

      const errorMsg = e.response && e.response.data.message
      toast({
        status: "error",
        duration: 5000,
        title: errorMsg || "Something went wrong!!!",
      })
      // console.log(errorMsg)
    }

  }

  return (
    <Flex
      width={"100%"}
      padding={4}
      boxShadow="sm"
      rounded="md"
      border={"1px"}
      borderColor={useColorModeValue("gray.200", "#333")}
      alignItems={"center"}
      justifyContent="space-between"
    >
      <Flex
        onClick={() =>
          router.push(
            user._id == userInfo._id
              ? `/account/myaccount/${user._id}`
              : `/account/${user._id}`
          )
        }
        gap={2}
        cursor="pointer"
      >
        <Avatar
          _hover={{ border: "2px solid rgb(29, 155, 240)" }}
          cursor="pointer"
          size={"sm"}
          name={user.fullName}
          alignItems={"center"}
          justifyContent="center"
        ></Avatar>
        <Text
          display={"flex"}
          color="rgb(29, 155, 240)"
          alignItems="center"
          gap={2}
          fontWeight={600}
          fontSize={15}
        >
          {user.fullName}{" "}
          {user.isVerified && user.isVerified == true && (
            <MdVerified color="rgb(29, 155, 240)" />
          )}
        </Text>
      </Flex>

      <Flex
        gap={5}
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
      >
        <Button
          isLoading={isVloading}
          onClick={
            user.isVerified
              ? () => unVerifyHandler(user._id)
              : () => verifyHandler(user._id)
          }
          fontSize={12}
          size={"sm"}
          bg="buttonColor"
        >
          {user.isVerified && user.isVerified == true ? "Unverify" : "Verify"}
        </Button>
        {user.role == "admin" ? (
          <Text fontSize={12}>Admin</Text>
        ) : (
          <Button
            isLoading={isDloading}
            onClick={() => deleteHandler(user._id)}
            fontSize={12}
            size={"sm"}
            bg="buttonColor"
          >
            Delete
          </Button>
        )}
      </Flex>
    </Flex>
  )
}

export default UserModel
