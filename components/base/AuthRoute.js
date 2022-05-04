import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { Spinner, Flex } from "@chakra-ui/react"
import { useRouter } from "next/router"

const AuthRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user)
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push("/login")
  }, [user])

  return (
    <>
      {user == null ? (
        <Flex
          alignItems={"center"}
          justifyContent="center"
          height={"90vh"}
          minW={"100vw"}
        >
          <Spinner size={"xl"} color="rgb(29, 155, 240)" />
        </Flex>
      ) : (
        <div
          style={{ paddingRight: "50px", width: "100%", paddingLeft: "20px" }}
        >
          {children}
        </div>
      )}
    </>
  )
}

export default AuthRoute
