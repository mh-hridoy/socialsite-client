import React, {useRef} from "react"
import {
  Flex,
  Avatar,
  Text,
  TagLabel,
  Tag,

  useColorModeValue,

} from "@chakra-ui/react"

import Masonry from "react-masonry-css"

import { MdVerified } from "react-icons/md"
import _ from "underscore"
import timeAgo from "../utils/DateConverter"


const SingleFeed = ({ item }) => {
     const videoRef = useRef(null)
     const breakpointColumnsObj = {
       default: 2,
       700: 1,
     }

     if(item == null) {
         return (
             <Text p={4} >Post deleted</Text>
         )
     }


  return (
    <Flex
      width={"100%"}
      direction={"column"}
      gap={4}
      position="relative"
    >
      <Flex
        direction={"column"}
        position={"relative"}
        p={4}
        width={"100%"}
        rounded="md"
      >
        <Flex alignItems="center" gap={2}>
          <Flex gap={2}>
            <Avatar
              size={"sm"}
              name={
                item?.user && item?.user.fullName
                  ? item.user.fullName
                  : "Not A User"
              }
              src={item?.user?.profilePicture?.img}
            ></Avatar>
            <Flex alignItems="center" gap={4}>
              <Text
                display={"flex"}
                alignItems="center"
                fontWeight={600}
                fontSize={16}
              >
                {item?.user ? item?.user.fullName : "Not A User"}{" "}
                {item?.user && item?.user.isVerified == true && (
                  <MdVerified color="rgb(29, 155, 240)" />
                )}
              </Text>
            </Flex>
          </Flex>
          <Text fontSize={12} fontWeight={500} opacity={"0.7"}>
            {timeAgo(item?.createdAt)}
          </Text>
        </Flex>

        <Text pl={10} pr={4} fontSize={15}>
          {item?.text}
        </Text>

        {item?.tags && (
          <Flex marginLeft={10} gap={5}>
            {item.tags.map((item, inx) => {
              return (
                <Tag
                  key={inx}
                  variant="outline"
                  size="md"
                  colorScheme="gray"
                >
                  <TagLabel>#{item}</TagLabel>
                </Tag>
              )
            })}
          </Flex>
        )}
        {item?.images && item?.images.length !== 0 && (
          <Flex
          pt={2}
          >
            <>
              {item.images.length == 1 ? (
                item.images[0].type.includes("image") ? (
                  <img
                    style={{  borderRadius: "20px" }}
                    alt={item.images[0].name}
                    src={item.images[0].img}
                  />
                ) : (
                  item.images[0].type.includes("video") && (
                    <video
                      ref={videoRef}
                      style={{
                        borderRadius: "20px",
                        height: "300px",
                        widht: "100%",
                      }}
                      src={item.images[0].img}
                      controls={true}
                      autoPlay={false}
                    ></video>
                  )
                )
              ) : (
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {item.images.map((image, inx) =>
                    image.type.includes("image") ? (
                      <img
                        style={{
                          margin: 2,
                          borderRadius: "20px",

                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        key={inx}
                        alt={image.name}
                        src={image.img}
                      />
                    ) : (
                      image.type.includes("video") && (
                        <video
                          style={{
                            borderRadius: "20px",

                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          src={image.img}
                          key={inx}
                          controls={true}
                          autoPlay={false}
                        ></video>
                      )
                    )
                  )}
                </Masonry>
              )}
            </>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default SingleFeed
