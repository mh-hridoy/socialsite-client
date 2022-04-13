import React, { useEffect, useState } from "react"
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
import _ from 'underscore'

const SingleUserCard = ({ user, userData }) => {
  const userInfo = useSelector((state) => state.user.user)
  const router = useRouter()
  const [unFollowRequest, setUnfollowRequest] = useState(false)
  const [followRequest, setFollowRequest] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)
  const [unblockRequst,setUnblockRequest] = useState(false)
    const [blockRequest, setBlockRequest] = useState(false)

  // unfollow request
  const { isLoading } = useHttp({
    fetchNow: unFollowRequest,
    method: "post",
    body: { followId: currentUser?._id },
    setFetchNow: setUnfollowRequest,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/unfollow-user/${userInfo?._id}`,
    isAuth: true,
    isEToast: true,
    eToastMessage: "Something went wrong!",
    cb: () => {
      const useOldData = currentUser
      const cloneData = _.clone(useOldData)
      
      const follwers = cloneData.follower

      const newFollower = follwers.filter((item) => item != userData._id )
      cloneData.follower = [...new Set(newFollower)]

      setCurrentUser(cloneData)

    },
  })

  useEffect(() => {
    setCurrentUser(user)
  }, [])

  const unFollowHandler = () => {
    setUnfollowRequest(true)
  }

  // follow request
  const { isLoading: followLoading } = useHttp({
    fetchNow: followRequest,
    method: "post",
    body: { followId: currentUser?._id },
    setFetchNow: setFollowRequest,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/follow-user/${userInfo?._id}`,
    isAuth: true,
    isEToast: true,
    eToastMessage: "Something went wrong!",
    cb: () => {
      const useOldData = currentUser
      const cloneData = _.clone(useOldData)

      const follwers = cloneData.follower
      follwers.push(userData._id)

      cloneData.follower = [...new Set(follwers)]

      setCurrentUser(cloneData)

    },
  })

  // console.log(user)
  const followHandler = () => {
    setFollowRequest(true)
  }

  //
    const { isLoading: isUnblocking } = useHttp({
      fetchNow: unblockRequst,
      method: "post",
      body: { blockId: currentUser?._id },
      setFetchNow: setUnblockRequest,
      url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/unblock-user/${userInfo?._id}`,
      isAuth: true,
      isEToast: true,
      eToastMessage: "Something went wrong!",
      isSetData: true,
      setData: setCurrentUser,
    })

  const unblockHandler = () => {
    setUnblockRequest(true)

  }

  //
  const { isLoading: isBlocking } = useHttp({
    fetchNow: blockRequest,
    method: "post",
    body: { blockId: currentUser?._id },
    setFetchNow: setBlockRequest,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/block-user/${userInfo?._id}`,
    isAuth: true,
    isEToast: true,
    eToastMessage: "Something went wrong!",
    isSetData: true,
    setData: setCurrentUser
  })
  const blockHandler = () => {
     setBlockRequest(true)

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
              currentUser?._id == userInfo?._id
                ? `/account/myaccount/${currentUser?._id}`
                : `/account/${currentUser?._id}`
            )
          }
          gap={2}
          cursor="pointer"
        >
          <Avatar
            _hover={{ border: "2px solid rgb(29, 155, 240)" }}
            cursor="pointer"
            size={"sm"}
            name={currentUser.fullName}
            alignItems={"center"}
            justifyContent="center"
            src={currentUser.profilePicture?.img}
          ></Avatar>
          <Text
            display={"flex"}
            color="rgb(29, 155, 240)"
            alignItems="center"
            gap={2}
            fontWeight={600}
            fontSize={15}
          >
            {currentUser.fullName}{" "}
            {currentUser.isVerified && currentUser.isVerified == true && (
              <MdVerified color="rgb(29, 155, 240)" />
            )}
          </Text>
        </Flex>

        {currentUser?._id == userInfo?._id && (
          <Button bg="buttonColor" size="sm" onClick={() => router.push(`/account/myaccount/${userInfo?._id}`)}  >My Account</Button>
        )}

        {currentUser?._id != userInfo?._id && (
          <Flex
            gap={5}
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
          >
            {!currentUser?.blockedBy?.includes(userData?._id) && (
              <Button
                onClick={
                  currentUser?.follower?.includes(userData?._id)
                    ? unFollowHandler
                    : followHandler
                }
                bg="buttonColor"
                size={"sm"}
                fontSize={14}
                isLoading={followLoading || isLoading}
              >
                {currentUser?.follower?.includes(userData?._id)
                  ? "Unfollow"
                  : "Follow"}
              </Button>
            )}

            <Button
              onClick={
                currentUser?.blockedBy?.includes(userData?._id)
                  ? unblockHandler
                  : blockHandler
              }
              bg="buttonColor"
              size={"sm"}
              fontSize={14}
              isLoading={isBlocking || isUnblocking}
            >
              {currentUser?.blockedBy?.includes(userData?._id)
                ? "Unblock"
                : "Block"}
            </Button>
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default SingleUserCard
