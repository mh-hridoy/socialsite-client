import React from 'react'
import { Flex, Avatar, Text, useColorModeValue } from "@chakra-ui/react"
import { useSelector } from "react-redux"
import {useRouter} from "next/router"
import { MdVerified } from "react-icons/md"
import timeAgo from "../utils/DateConverter"


const SingleComments = ({item}) => {
    const user = useSelector((state) => state.user.user)
    const router = useRouter()
    // console.log(item)

  return (
    <Flex
    onClick={(e) => e.stopPropagation()}
      marginBottom={3}
      paddingBottom={2}
      borderBottom="1px"
      borderColor={useColorModeValue("gray.200", "#333")}
      direction={"column"}
    >
      <Flex
        columnGap={2}
        cursor="pointer"
        onClick={(e) =>{
          e.stopPropagation();
          router.push(
            item.user._id == user._id
              ? `/account/myaccount/${item.user._id}`
              : `/account/${item.user._id}`
          )}
        }
      >
        <Avatar
          _hover={{ border: "2px solid rgb(29, 155, 240)" }}
          cursor="pointer"
          size={"sm"}
          name={item.user.fullName}
          src={item.user?.profilePicture?.img}
        ></Avatar>
        <Flex marginBottom={2} direction="column">
          <Text
            display={"flex"}
            alignItems="center"
            gap={2}
            fontWeight={600}
            fontSize={15}
          >
            {item.user.fullName}{" "}
            {item.user.isUserVerified && item.user.isUserVerified == true && (
              <MdVerified color="rgb(29, 155, 240)" />
            )}
          </Text>

          <Text fontSize={12} opacity={"0.7"}>
            {timeAgo(item.createdAt)}
          </Text>
        </Flex>
      </Flex>
      <Text paddingLeft={10} fontSize={14}>
        {item.text}
      </Text>
    </Flex>
  )
}
// 
export default SingleComments