
import React, { useState } from 'react'
import { Flex, Input, Button, Text, useColorModeValue } from "@chakra-ui/react"
import SingleComments from './SingleComments'
import { useSelector } from 'react-redux'
import axios from 'axios'
import _ from "underscore"

const CommentsOfFeed = ({ postId, comments, setHomeData }) => {
  const [commentText, setCommentText] = useState("")
  const user = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  const [loading, setLoading] = useState(false)

  const commentHandler = async () => {
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
      setCommentText("")
      setLoading(false)
    } catch (e) {
      setLoading(false)
      const errorMsg = e.response && e.response.data.message
      console.log(errorMsg)
    }
  }

  return (
    <Flex
      transform={"translateY(-12px)"}
      rounded="md"
      px={4}
      maxHeight={400}
      overflow={"auto"}
      borderBottom="1px"
      borderColor={useColorModeValue("gray.200", "#333")}
      direction="column"
      position="relative"
      widht="100%"
    >
      <Flex
        paddingTop={4}
        position="sticky"
        zIndex={10}
        top={0}
        backgroundColor={useColorModeValue("#fff", "#1A202C")}
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <Input
          _focus={{ boxShadow: "none" }}
          size={"sm"}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
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
        </Button>
      </Flex>

      {comments && comments.length == 0 && (
        <Text marginTop={4} textAlign={"center"} fontSize={14} opacity={0.7}>
          No comments yet!
        </Text>
      )}

      <Flex mt={4} direction="column">
        {comments &&
          comments.map((item, inx) => {
            return <SingleComments key={inx} item={item} />
          })}
      </Flex>
    </Flex>
  )
}

export default CommentsOfFeed