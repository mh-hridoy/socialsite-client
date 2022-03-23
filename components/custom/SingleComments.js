import React from 'react'
import { Flex, Avatar, Text } from "@chakra-ui/react"
import { useSelector } from "react-redux"
import dateFormat from "dateformat"
import {useRouter} from "next/router"


const SingleComments = ({item}) => {
    const user = useSelector((state) => state.user.user)
    const router = useRouter()

  return (
    <Flex marginBottom={3} paddingBottom={2} borderBottom="1px"
        borderColor="gray.200" direction={"column"}>
      <Flex
        columnGap={2}
        cursor="pointer"
        onClick={() =>
          router.push(
            item.user == user._id
              ? `/account/myaccount/${item.user}`
              : `/account/${item.user}`
          )
        }
      >
        <Avatar
          _hover={{ border: "2px solid #ff552f" }}
          cursor="pointer"
          size={"sm"}
          name={item.userName}
          // src="https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80"
        ></Avatar>
        <Flex marginBottom={2} direction="column">
          <Text color="buttonColor" fontWeight={600} fontSize={15}>
            {item.userName}
          </Text>
          <Text fontSize={12} opacity={"0.7"}>
            {dateFormat(item.createdAt, "dddd, mmmm dS, yyyy, h:MM TT")}
          </Text>
        </Flex>
      </Flex>
      <Text paddingLeft={10} fontSize={14}>
        {item.text}
      </Text>
    </Flex>
  )
}

export default SingleComments