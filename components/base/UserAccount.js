import React from "react"
import { Flex, Avatar, Text } from "@chakra-ui/react"
import { useSelector } from "react-redux"

const UserAccount = () => {
  const user = useSelector((state) => state.user.user)

  return (
  <Flex direction={"column"} gap={4} w={"100%"} alignItems={"center"} justifyContent="center">
        <Avatar
          _hover={{ border: "2px solid #ff552f" }}
          cursor="pointer"
          size={"xl"}
          name={user && user.fullName}
          src="https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80"
        ></Avatar>
        <Text fontWeight={600} fontSize={25} >{user.fullName}</Text>
    </Flex>
     
)
}

export default UserAccount
