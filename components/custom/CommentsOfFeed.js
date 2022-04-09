import React from "react"
import { Flex, Text, useColorModeValue } from "@chakra-ui/react"
import { useSelector } from "react-redux"
import _ from "underscore"
import CreateReply from "../custom/CreateReply"
import FeedCard from "../custom/FeedCard"
import {useRouter} from "next/router"

const CommentsOfFeed = ({
  postId,
  setPost,
  comments,
  setHomeData,
  quoteData,
  setComments,
  setQuoteData,
  isCreateModalOpen,
  setIsCreateModalOpen,
  item,
}) => {
  const user = useSelector((state) => state.user.user)
  const router = useRouter()

  return (
    <Flex
      rounded="md"
      onClick={(e) => e.stopPropagation()}
      px={4}
      direction="column"
      position="relative"
      widht="100%"
    >
      <Flex
        onClick={(e) => e.stopPropagation()}
        zIndex={10}
        top={0}
        backgroundColor={useColorModeValue("#fff", "#1A202C")}
        mt={5}
        gap={2}
        direction="column"
      >
        <Text display={"flex"} gap={1} fontSize={14} opacity={"0.7"}>
          Reply to{" "}
          <Text
            opacity={"1"}
            fontWeight={600}
            cursor="pointer"
            onClick={(e) => {
              e.stopPropagation()
              router.push(
                item?.user?._id == user?._id
                  ? `/account/myaccount/${item?.user?._id}`
                  : `/account/${item?.user?._id}`
              )
            }}
          >
            {item?.user.fullName}
          </Text>{" "}
        </Text>
        <CreateReply
          hasQuote={true}
          setItem={setPost}
          comments={comments}
          setComments={setComments}
          quoteData={quoteData}
          setQuoteData={setQuoteData}
          isModalOpen={isCreateModalOpen}
          setIsModalOpen={setIsCreateModalOpen}
          name={postId + 1}
          postId={postId}
          item={item}
        />
      </Flex>

      {comments && comments.length == 0 && (
        <>
          <Text marginTop={4} textAlign={"center"} fontSize={14} opacity={0.7}>
            No comments yet!
          </Text>
        </>
      )}

      <Flex mt={4} direction="column">
        {comments &&
          comments.map((iteM, inx) => {
            return (
              <FeedCard
                quoteData={quoteData}
                setQuoteData={setQuoteData}
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                setHomeData={setHomeData}
                key={inx}
                item={iteM}
              />
            )
          })}
      </Flex>
    </Flex>
  )
}

export default CommentsOfFeed
