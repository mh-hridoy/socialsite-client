import { Button, Flex, Heading, Stack, Spinner, useToast } from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import axios from 'axios'

import {useRouter} from 'next/router'

const VerifyPage = () => {
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast({ position: "top" })
  const router = useRouter()
const code = window.location.pathname.split("/")
const veriCode = code[code.length - 1]

const verifyEmailHandler = async()=> {
  setIsLoading(true)
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_MAIN_PROXY}/verify-email`,
      { verifyCode: veriCode },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      setIsLoading(false)
      toast({
        status: "success",
        duration: 5000,
        title: "Email verified successfully.",
      })
      router.push("/")
  } catch (e) {
    router.push("/login")
    const errorMsg = e.response
      ? e.response.data.message
      : "Something went wrong!!!"

    toast({
      status: "error",
      duration: 5000,
      title: errorMsg,
    })
  }

}

useEffect(() => {
  checkCode()
}, [])

const checkCode = async () => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_MAIN_PROXY}/check-verify-email`,
      { verifyCode: veriCode },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    setLoading(false)
  } catch (e) {
    router.push("/login")
    const errorMsg = e.response
      ? e.response.data.message
      : "Something went wrong!!!"

    toast({
      status: "error",
      duration: 5000,
      title: errorMsg,
    })
  }
}



  return (
    <>
      {loading ? (
        <Flex
          minW={"100vw"}
          alignItems={"center"}
          justifyContent="center"
          height={"90vh"}
        >
          <Spinner size={"xl"} />
        </Flex>
      ) : (
        <Flex
          width={"100%"}
          minH={"100vh"}
          mt={"20vh"}
          justifyContent={"center"}
        >
          <Stack spacing={15} align={"center"}>
            <Heading fontSize={"4xl"}>
              Click on "Verify" button to verify your email!
            </Heading>

            <Button
              isLoading={isLoading}
              onClick={verifyEmailHandler}
              bg="buttonColor"
            >
              Verify Now
            </Button>
          </Stack>
        </Flex>
      )}
    </>
  )
}

export default VerifyPage