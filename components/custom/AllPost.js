import React, { useState, useCallback, useRef } from "react"
import FeedCard from "./FeedCard"
import { Text, Flex } from "@chakra-ui/react"
import { useSelector } from "react-redux"
import { RiShareForwardBoxFill } from "react-icons/ri"
import { AiOutlineConsoleSql } from "react-icons/ai"
const AllPost = ({
  post,
  setPage,
  page,
  totalPage,
  setHomeData,
  user,
  quoteData,
  setQuoteData,
  isCreateModalOpen,
  setIsCreateModalOpen,
}) => {
  const feedRef = useRef(null)
  const userData = useSelector((state) => state.user.user)


  const lastFeedRef = useCallback(
    (node) => {
      // console.log(node)
      if (feedRef.current) feedRef.current.disconnect()
      feedRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // setFetchData(true)
          setPage(page >= totalPage ? page : page + 1)
          feedRef.current.disconnect()
        }
      })

      if (node) {
        feedRef.current.observe(node)
      }
    },
    [page]
  )


  return (
    <>
      <Flex minWidth={"100%"} direction="column">
        {post && post.length !== 0 ? (
          [...new Set(post)].map((item, inx) => {
            if (
              item?.sharedBy?.includes(user?._id) &&
              item.postType != "quote" &&
              post.length != inx + 1
            ) {
              return (
                <Flex key={inx} direction="column">
                  <Text
                    pl={4}
                    transform="translateY(10px)"
                    display={"flex"}
                    mb={5}
                    gap={2}
                    alignItems="center"
                    fontSize={14}
                    fontWeight={600}
                  >
                    <RiShareForwardBoxFill size={18} />
                    Shared by{" "}
                    {userData?._id == user?._id ? "YOU" : user?.fullName}
                  </Text>
                  <FeedCard
                    quoteData={quoteData}
                    setQuoteData={setQuoteData}
                    isCreateModalOpen={isCreateModalOpen}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    setHomeData={setHomeData}
                    item={item}
                  />
                </Flex>
              )
            } else if (
              item?.sharedBy?.includes(user?._id) &&
              item.postType != "quote" &&
              post?.length == inx + 1
            ) {
              return (
                <Flex key={inx} direction="column">
                  <Text
                    pl={4}
                    mb={5}
                    transform="translateY(10px)"
                    display={"flex"}
                    pt={10}
                    gap={2}
                    alignItems="center"
                    fontSize={14}
                    fontWeight={600}
                  >
                    <RiShareForwardBoxFill />
                    Shared by{" "}
                    {userData?._id == user?._id ? "YOU" : user?.fullName}
                  </Text>
                  <FeedCard
                    quoteData={quoteData}
                    setQuoteData={setQuoteData}
                    isCreateModalOpen={isCreateModalOpen}
                    setIsCreateModalOpen={setIsCreateModalOpen}
                    setHomeData={setHomeData}
                    lastFeedRef={lastFeedRef}
                    key={inx}
                    item={item}
                  />
                </Flex>
              )
            } else if (item.postType == "quote" && post?.length != inx + 1) {
              return (
                <FeedCard
                  hasQuote={true}
                  quoteData={quoteData}
                  setQuoteData={setQuoteData}
                  isCreateModalOpen={isCreateModalOpen}
                  setIsCreateModalOpen={setIsCreateModalOpen}
                  setHomeData={setHomeData}
                  key={inx}
                  item={item}
                />
              )
            } else if (item.postType == "quote" && post?.length == inx + 1) {
              return (
                <FeedCard
                  hasQuote={true}
                  quoteData={quoteData}
                  setQuoteData={setQuoteData}
                  isCreateModalOpen={isCreateModalOpen}
                  setIsCreateModalOpen={setIsCreateModalOpen}
                  setHomeData={setHomeData}
                  lastFeedRef={lastFeedRef}
                  key={inx}
                  item={item}
                />
              )
            } else if (post?.length == inx + 1) {
              return (
                <FeedCard
                  quoteData={quoteData}
                  setQuoteData={setQuoteData}
                  isCreateModalOpen={isCreateModalOpen}
                  setIsCreateModalOpen={setIsCreateModalOpen}
                  setHomeData={setHomeData}
                  lastFeedRef={lastFeedRef}
                  key={inx}
                  item={item}
                />
              )
            } else {
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
            }
          })
        ) : (
            <Text fontSize={16} mt={10} opacity={0.8} textAlign="center" >Currently there's no post to show! Follow some people to view their posts or create some post.</Text>
        )}
      </Flex>
    </>
  )
}

export default AllPost
