import React, { useEffect} from "react"
import { Flex, Avatar, Text, useColorModeValue } from "@chakra-ui/react"
import FeedCard from "../custom/FeedCard"
import { MdVerified, MdCalendarToday } from "react-icons/md"
import dateFormat from "dateformat"

const UserAccount = ({ post, user, setTotalPost }) => {

  useEffect(() => {
    setTotalPost(post.length)
  }, [])


  return (
    <Flex
      borderRight={"1px"}
      borderLeft={"1px"}
      borderColor={useColorModeValue("gray.200", "#333")}
      minWidth={"100%"}
      mb={10}
      gap={4}
      direction="column"
    >
      <Flex direction={"column"} w={"100%"}>
        <Flex
          width={"100%"}
          height={40}
          position="relative"
          bg={useColorModeValue("gray.200", "rgb(29, 155, 240, 0.1)")}
        >
          <Avatar
            // transform={"translateX(-200px) translateY(-50px)"}
            _hover={{ border: "2px solid rgb(29, 155, 240)" }}
            cursor="pointer"
            position={"absolute"}
            border="2px"
            borderColor={useColorModeValue("gray.200", "#333")}
            bottom={-10}
            left={5}
            size={"xl"}
            name={user.fullName}
            // src="https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80"
          ></Avatar>
        </Flex>
      </Flex>

      <Flex p={4} gap={1} direction="column" mt={4}>
        <Text
          display={"flex"}
          alignItems="center"
          gap={1}
          fontWeight={600}
          fontSize={18}
        >
          {user.fullName}{" "}
          {user.isVerified && user.isVerified == true && (
            <MdVerified color="rgb(29, 155, 240)" />
          )}
        </Text>

        <Text display="flex" fontSize={14} alignItems="center" gap={2} opacity={0.8}>
          <MdCalendarToday /> Joined at{" "}
          {user &&
            dateFormat(user.createdAt, "mmmm dS, yyyy")}
        </Text>
      </Flex>

      <Text mr={5} p={2} mt={3} fontWeight={600}>
        Feeds:
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
