import React from 'react'
import WithHeader from '../components/custom/WithHeader'
import { Flex, useColorModeValue, Text, Avatar } from "@chakra-ui/react"
import {useSelector} from 'react-redux'
import {useRouter} from 'next/router'
import axios from 'axios'

const Notification = () => {
      const notifications = useSelector((state) => state.notifications.notifications)
        const router = useRouter()
        const user = useSelector((state) => state.user.user)
        const token = useSelector((state) => state.user.token)

  const notiReadHandler =async (noti) => {
    if (noti?.read == true) {
      return
    }
    try {
           await axios.get(
             `${process.env.NEXT_PUBLIC_MAIN_PROXY}/read-noti/${user?._id}/${noti?._id}`,
             {
               headers: {
                 "Content-Type": "application/json",
                 Authorization: `Bearer ${token}`,
               },
               withCredentials: true,
             }
           )
        } catch (e) {
          console.log(e)
        }
  }

  return (
    <WithHeader headerName="Notifications">
      <Flex
        minHeight={"100vh"}
        width="100%"
        borderRight={"1px"}
        direction="column"
        borderLeft={"1px"}
        borderColor={useColorModeValue("gray.200", "#333")}
      >
        {notifications.length == 0 && (
          <Flex
            height={"100%"}
            width="100%"
            alignItems={"center"}
            justifyContent="center"
          >
            <Text fontSize={14} opacity={0.8}>
              Notifications will appear here.
            </Text>
          </Flex>
        )}

        {notifications.length != 0 && notifications?.map((item, inx) => {
          return (
            <Flex
              key={inx}
              px={4}
              mx={4}
              rounded="lg"
              my={2}
              py={2}
              onClick={() =>
                {
                  notiReadHandler(item)
                  router.push(
                  item?.postType == "comment"
                    ? `/post/comment/${item?.post?._id}`
                    : `/post/${item?.post?._id}`
                );
                
                }
              }
              boxShadow="sm"
              border={"1px"}
              borderColor="gray.200"
              alignItems={"center"}
              gap={2}
              cursor="pointer"
              bg={item?.read == true ? useColorModeValue("gray.200", "whiteAlpha.400") : undefined}
            >
              <Avatar
                src={item?.by?.profilePicture?.img}
                size="sm"
                name={"name"}
              />
              <Text fontWeight={600}>{item?.by?.fullName}</Text>
              <Text fontStyle={"italic"}>Mentioned you in a post</Text>
            </Flex>
          )
        })}
        
      </Flex>
    </WithHeader>
  )
}

export default Notification