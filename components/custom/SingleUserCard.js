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
import {
  MdVerified,
  
} from "react-icons/md"
import axios from "axios"

const SingleUserCard = ({ user }) => {
  const userInfo = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  const router = useRouter()
  const toast = useToast({ position: "top", isClosable: true })
  const [isLoading, setIsLoading] = useState(false)
const [buttonText, setButtonText] = useState("Follow")


const unFollowHandler = async () => {
  try {
    setIsLoading(true)
    await axios.post(
      `${process.env.NEXT_PUBLIC_MAIN_PROXY}/unfollow-user/${userInfo._id}`,
      { followId: user._id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    )

    setIsLoading(false)
    setButtonText("Follow")
  } catch (e) {
    setIsLoading(false)
    const errorMsg = e.response && e.response.data.message
    toast({
      status: "error",
      duration: 5000,
      title: "Something went wrong!",
    })
    // console.log(errorMsg)
  }
}

// console.log(user)
const followHandler = async () => {
  try {
    setIsLoading(true)
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_MAIN_PROXY}/follow-user/${userInfo._id}`,
      { followId: user._id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    )

    
    setIsLoading(false)
        setButtonText("Unfollow")

  } catch (e) {

    setIsLoading(false)
toast({
  status: "error",
  duration: 5000,
  title: "Something went wrong!",
})
    const errorMsg = e.response && e.response.data.message
    console.log(errorMsg)
  }
}


  return (
    <>
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
            src={user.profilePicture?.img}
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
            onClick={buttonText == "Follow" ? followHandler : unFollowHandler}
            bg="buttonColor"
            size={"sm"}
            fontSize={14}
            isLoading={isLoading}
          >
            {buttonText}
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default SingleUserCard
