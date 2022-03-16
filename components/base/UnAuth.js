import React, { useEffect } from "react"
import { useSelector } from 'react-redux'
import {Spinner, Flex} from '@chakra-ui/react'
import { useRouter } from 'next/router'

const UnAuth = ({children}) => {
    const user = useSelector((state) => state.user.user)
    const router = useRouter()

    useEffect(() => {
      if (user) router.push("/")
    }, [user])

  return (
    <>
      {user !== null ? (
        <Flex
          minW={"100vw"}
          alignItems={"center"}
          justifyContent="center"
          height={"90vh"}
        >
          <Spinner size={"xl"} />
        </Flex>
      ) : (
        children
      )}
    </>
  )
}

export default UnAuth