import React, { useState } from "react"
import { Flex, Input, Button, Text, useColorModeValue } from "@chakra-ui/react"
import SingleComments from "./SingleComments"
import { useSelector } from "react-redux"
import axios from "axios"
import _ from "underscore"
import CreateReply from "../custom/CreateReply"
import FeedCard from "../custom/FeedCard"

const CommentsOfFeed = ({
  postId,
  setPost,
  comments,
  setHomeData,
  quoteData,
  setQuoteData,
  isCreateModalOpen,
  setIsCreateModalOpen,
  item
}) => {
  const [commentText, setCommentText] = useState("")
  const user = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  const [loading, setLoading] = useState(false)

  const commentHandler = async (e) => {
    e.stopPropagation()
    try {
      setLoading(true)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/create-comment`,
        { userId: user._id, text: commentText, postId: postId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      setCommentText("")
      if (setHomeData != undefined) {
        setHomeData((prev) => {
          const allPost = [...prev]
          const indexOfPost = allPost.findIndex((item) => item._id == postId)
          const currentPost = _.clone(allPost[indexOfPost])
          const postComment = _.clone(currentPost.comments)
          postComment.unshift(data)

          currentPost.comments = [...new Set(postComment)]
          allPost[indexOfPost] = currentPost
          return [...new Set(allPost)]
        })
      }

      setLoading(false)
    } catch (e) {
      setLoading(false)
      const errorMsg = e.response && e.response.data.message
      console.log(e)
    }
  }

  return (
    <Flex
      rounded="md"
      onClick={(e) => e.stopPropagation()}
      px={4}
      direction="column"
      position="relative"
      widht="100%"
      // border="1px solid red"
    >
      <Flex
        onClick={(e) => e.stopPropagation()}
        zIndex={10}
        top={0}
        backgroundColor={useColorModeValue("#fff", "#1A202C")}
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <CreateReply
          hasQuote={true}
          setItem={setPost}
          quoteData={quoteData}
          setQuoteData={setQuoteData}
          isModalOpen={isCreateModalOpen}
          setIsModalOpen={setIsCreateModalOpen}
          name={postId + 1}
          postId={postId}
          item={item}
        />
        {/* <Input
          _focus={{ boxShadow: "none" }}
          size={"sm"}
          onClick={(e) => e.stopPropagation()}
          value={commentText}
          onChange={(e) => {
            e.stopPropagation()
            setCommentText(e.target.value)
          }}
          type="text"
          placeholder="What's in your mind?"
          width={"100%"}
        />
        <Button
          disabled={!commentText}
          isLoading={loading}
          onClick={commentHandler}
          bg={"buttonColor"}
          size="sm"
        >
          Comment
        </Button> */}
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
          comments.map((item, inx) => {
            return (
              <FeedCard
              
                quoteData={quoteData}
                setQuoteData={setQuoteData}
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                setHomeData={setHomeData}
                key={inx}
                item={item}
              />
            )
          })}
      </Flex>
    </Flex>
  )
}

export default CommentsOfFeed
