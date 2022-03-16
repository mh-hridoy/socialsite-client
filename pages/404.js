import React, { useEffect } from "react"
import { Spinner, Flex } from "@chakra-ui/react"
import { useRouter } from "next/router"

const NotFoundPage = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
     router.push("/")
  }, [])

  return (
    <>
        <Flex
        width="100%"
          alignItems={"center"}
          justifyContent="center"
          height={"90vh"}
          widht={"100%"}
        >
          <Spinner size={"xl"} />
        </Flex>
        
    </>
  )
}

export default NotFoundPage
