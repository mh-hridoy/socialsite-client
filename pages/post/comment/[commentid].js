import React from 'react'
import {useRouter} from 'next/router'

const CommentShow = () => {
    const router = useRouter()
  return (
    <div>{router.query.commentid}</div>
  )
}

export default CommentShow