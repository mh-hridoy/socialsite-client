import React from "react"
import { Flex, Avatar, Text } from "@chakra-ui/react"
import { useSelector } from "react-redux"
import {MdVerified} from 'react-icons/md'
import {useRouter} from 'next/router'
import FeedCard from "../custom/FeedCard"

const UserAccount = () => {
  const user = useSelector((state) => state.user.user)
  const router = useRouter()


  

  return (
    <Flex w={"100%"} mb={10} gap={4} direction="column">
      <Flex
        direction={"column"}
        gap={2}
        w={"100%"}
        alignItems={"center"}
        justifyContent="center"
      >
        <Avatar
          _hover={{ border: "2px solid #ff552f" }}
          cursor="pointer"
          size={"xl"}
          name={user && user.fullName}
          src="https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80"
        ></Avatar>
        <Text fontWeight={600} fontSize={25}>
          {user && user.fullName}
        </Text>
      </Flex>

      <Flex
        fontSize={16}
        w={"100%"}
        alignItems={"center"}
        justifyContent="space-evenly"
      >
        <Text fontWeight={600}>Total Post: 100</Text>

        <Text
          alignItems="center"
          justifyContent="center"
          gap={2}
          display="flex"
          fontWeight={600}
        >
          Email Verified:{" "}
          {user && user.isEmailVarified ? (
            <MdVerified size={22} color="#ff552f" />
          ) : (
            <a
              onClick={() =>
                router.push(`/account/verify/${user.emailVerifyCode}`)
              }
            >
              Verify now
            </a>
          )}
        </Text>
      </Flex>

      <Text mr={5} mt={8} fontWeight={600}>
        Posts:
      </Text>

      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>
      <FeedCard/>


    </Flex>
  )
}

export default UserAccount
