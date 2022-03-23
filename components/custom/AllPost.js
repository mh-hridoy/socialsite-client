import React from 'react'
import FeedCard from './FeedCard'
import {Text} from '@chakra-ui/react'

const AllPost = ({post}) => {

  return (
    <>
      {post && post.length !== 0 ? (
        post.map((item, inx) => (
          <FeedCard key={inx} item={item} />
        ))
      ) : (
        <Text>There's no activity.</Text>
      )}
    </>
  )
}

export default AllPost