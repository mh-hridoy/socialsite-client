import React, { useState, useCallback, useRef } from "react"
import FeedCard from "./FeedCard"
import { Text } from "@chakra-ui/react"

const AllPost = ({ post, setPage, page, totalPage }) => {
  const feedRef = useRef(null)

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

    // console.log(page)
  return (
    <>
      {post && post.length !== 0 ? (
        post.map((item, inx) => {
          if (post.length == inx + 1) {
            return <FeedCard lastFeedRef={lastFeedRef} key={inx} item={item} />
          } else {
            return <FeedCard key={inx} item={item} />
          }
        })
      ) : (
        <Text>There's no activity.</Text>
      )}
    </>
  )
}

export default AllPost
