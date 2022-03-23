import React from "react"
import { Flex, Avatar, Text } from "@chakra-ui/react"
import FeedCard from "../custom/FeedCard"

const UserAccount = ({ post, user }) => {

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
          name={user.fullName}
          // src="https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80"
        ></Avatar>
        <Text fontWeight={600} fontSize={25}>
          {user.fullName}
        </Text>
      </Flex>

      <Flex
        fontSize={16}
        w={"100%"}
        alignItems={"center"}
        justifyContent="space-evenly"
      >
        <Text fontWeight={600}>Total Post: {post.length || 0}</Text>
      </Flex>

      <Text mr={5} mt={8} fontWeight={600}>
        Posts:
      </Text>
      {post && post.length !== 0 ? (
        post.map((item, inx) => <FeedCard key={inx} inx={inx} item={item} />)
      ) : (
        <Text>There's no activity.</Text>
      )}
    </Flex>
  )
}

export default UserAccount
