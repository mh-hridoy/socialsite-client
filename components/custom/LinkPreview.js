import React from "react"
import { Flex, Avatar, Text, TagLabel, Tag } from "@chakra-ui/react"

import Masonry from "react-masonry-css"

import { MdVerified } from "react-icons/md"
import _ from "underscore"
import timeAgo from "../utils/DateConverter"

const LinkPreview = ({ item }) => {
  const breakpointColumnsObj = {
    default: 2,
    700: 1,
  }

  if (item == null) {
    return <Text p={4}>Post deleted</Text>
  }
  return (
    <Flex width={"100%"} direction={"column"} gap={4} position="relative">
      <Flex
        direction={"column"}
        position={"relative"}
        p={4}
        width={"100%"}
        rounded="md"
      >
        <Flex
          width={"100%"}
          alignItems="cenetre"
          justifyContent={"center"}
          pt={2}
        >
          {item.image.type == "image/jpeg" ? (
            <img alt={item.image.title} src={item.image.img} />
          ) : item.image.type == "video" ? (
            <video
              style={{
                height: "300px",
                widht: "100%",
              }}
              src={item.image.img}
              controls={true}
              autoPlay={false}
            ></video>
          ) : null}
        </Flex>
          {/* <a style={{wordBreak: "break-word", fontSize: 14 }} >{item?.link}</a> */}
        <Text
        mt={2}
          pl={10}
          display="flex"
          fontWeight={600}
          alignItems={"center"}
          gap={2}
          pr={4}
          fontSize={15}
        >
          {item?.favIcon && (
            <Avatar
              name={item?.siteName}
              objectFit="contain"
              size="sm"
              src={item?.favIcon}
            ></Avatar>
          )}
          {item?.title}
        </Text>
        <Text pl={10} pr={4} fontSize={15}>
          {item?.desc}
        </Text>
      </Flex>
    </Flex>
  )
}

export default LinkPreview
