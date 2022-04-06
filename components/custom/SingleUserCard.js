import React, { useState } from "react"
import {
  Flex,
  Text,
  Button,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import {
  MdVerified,
  
} from "react-icons/md"
import useHttp from "../utils/useHttp"

const SingleUserCard = ({ user }) => {
  const userInfo = useSelector((state) => state.user.user)
  const router = useRouter()
  const [buttonText, setButtonText] = useState("Follow")
  const [unFollowRequest, setUnfollowRequest] = useState(false)
  const [followRequest, setFollowRequest] = useState(false)

  // unfollow request
  const { isLoading } = useHttp({
    fetchNow: unFollowRequest,
    method: "post",
    body: { followId: user._id },
    setFetchNow: setUnfollowRequest,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/unfollow-user/${userInfo._id}`,
    isAuth: true,
    isEToast: true,
    eToastMessage: "Something went wrong!",
    cb: () => setButtonText("Follow"),
  })

  const unFollowHandler = () => {
    setUnfollowRequest(true)
  }

  // follow request
  const { isLoading: followLoading } = useHttp({
    fetchNow: followRequest,
    method: "post",
    body: { followId: user._id },
    setFetchNow: setFollowRequest,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/follow-user/${userInfo._id}`,
    isAuth: true,
    isEToast: true,
    eToastMessage: "Something went wrong!",
    cb: () => setButtonText("Unfollow"),
  })

  // console.log(user)
  const followHandler = () => {
    setFollowRequest(true)
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
            isLoading={buttonText == "Follow" ? followLoading : isLoading}
          >
            {buttonText}
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default SingleUserCard
