import React, { useState } from "react"
import { Formik, Field } from "formik"
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  useColorModeValue,
  Stack,
  Heading,
  Input,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  Text,
  useToast,
} from "@chakra-ui/react"
import * as Yup from "yup"
import { useRouter } from "next/router"
import axios from "axios"
import { login } from "../store/userInfoSlice"
import UnAuth from "../components/base/UnAuth"
import useHttp from "../components/utils/useHttp"

const loginSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be 8 character long.")
    .max(20, "Too Long Password!")
    .required("Password cannot be empty!"),

  email: Yup.string()
    .email("Invalid email address!")
    .required("Email address is required!"),
})

const resetSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address!")
    .required("Email address is required!"),
})

const Login = () => {
  const [isForget, setIsForget] = useState(false)
  const [sendRequest, setSendRequest] = useState(false)
  const router = useRouter()
  const [verifyMessage, setVerifyMessage] = useState(null)
  const [userID, setUserId] = useState(null)
  const [verifyRequest, setVerifyRequest] = useState(false)
  const [body, setBody] = useState({})
  const [resetBody,setResetBody] = useState({})
  const [resetRequestStart, setResetRequestStart] = useState(false)


 
  //login request
     const loginHandler = (values) => {
       setBody(values)
       setSendRequest(true)
     }
  const { isLoading } = useHttp(
    {fetchNow : sendRequest,
    setFetchNow : setSendRequest,
    isLocalStorage : true,
    url : `${process.env.NEXT_PUBLIC_MAIN_PROXY}/login`,
    method : "post",
    body: body,
    isMessage : true,
    setMessage : setVerifyMessage,
    setUserId : setUserId,
    isDispatch : true,
    dispatchFunc : login,
    isEToast : true,
    isPush : true,
    pushTo : "/",
    }
  )


  //verify email request
  const requestVerify = () => {
    setVerifyRequest(true)
  }
   const { isLoading: verifyLoading } = useHttp({
     fetchNow: verifyRequest,
     setFetchNow: setVerifyRequest,
     url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/request-verify-email`,
     method: "post",
     body: { id: userID },
     isMessage: true,
     setMessage: setVerifyMessage,
     setUserId: setUserId,
     isToast: true,
     isEToast: true,
     
   })

   //reset request
    const requestReset = (values) => {
      setResetBody(values)
      setResetRequestStart(true)
    }
   const { isLoading: resetLoading } = useHttp({
     fetchNow: resetRequestStart,
     setFetchNow: setResetRequestStart,
     url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/reset-request`,
     method: "post",
     body: resetBody,
     isToast: true,
     isEToast: true,
     cb: () => setIsForget(!isForget),
   })


  return (
    <UnAuth>
      <Flex
        width={"100%"}
        minH={"100vh"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>
              {!isForget ? "Log in to your account" : "Forget Password"}
            </Heading>
            {isForget && (
              <Text textAlign={"center"}>
                You'll get an password reset email if you're already a user.
                Otherwise not!
              </Text>
            )}
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            {!isForget ? (
              <Formik
                validationSchema={loginSchema}
                initialValues={{
                  email: "",
                  password: "",
                }}
                onSubmit={loginHandler}
              >
                {({ handleSubmit, errors, touched }) => (
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="flex-start">
                      {verifyMessage !== null && (
                        <Alert fontSize={12} fontWeight={600} status="warning">
                          <AlertIcon />
                          {verifyMessage}
                          {verifyLoading ? (
                            <Spinner size="sm" color="buttonColor" ml={2} />
                          ) : (
                            <a
                              style={{ marginLeft: 2 }}
                              onClick={requestVerify}
                            >
                              verify now
                            </a>
                          )}
                        </Alert>
                      )}
                      <FormControl>
                        <FormLabel htmlFor="email">Email Address</FormLabel>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          variant="filled"
                        />
                        {errors.email && touched.email && (
                          <Alert
                            px={2}
                            py={1}
                            fontSize={12}
                            rounded
                            marginTop={2}
                            status="error"
                          >
                            <AlertIcon />
                            <AlertTitle>{errors.email}</AlertTitle>
                          </Alert>
                        )}
                      </FormControl>

                      <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Field
                          as={Input}
                          id="password"
                          name="password"
                          type="password"
                          variant="filled"
                        />
                        {errors.password && touched.password && (
                          <Alert
                            px={2}
                            py={1}
                            fontSize={12}
                            rounded
                            marginTop={2}
                            status="error"
                          >
                            <AlertIcon />
                            <AlertTitle>{errors.password}</AlertTitle>
                          </Alert>
                        )}
                      </FormControl>

                      <a onClick={() => setIsForget(!isForget)}>
                        Forgot password?
                      </a>

                      <Button
                        isLoading={isLoading}
                        type="submit"
                        bg="buttonColor"
                        isFullWidth
                      >
                        Login
                      </Button>
                    </VStack>
                  </form>
                )}
              </Formik>
            ) : (
              <Formik
                validationSchema={resetSchema}
                initialValues={{
                  email: "",
                }}
                onSubmit={requestReset}
              >
                {({ handleSubmit, errors, touched }) => (
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="flex-start">
                      <FormControl>
                        <FormLabel htmlFor="email">Email Address</FormLabel>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          variant="filled"
                        />
                        {errors.email && touched.email && (
                          <Alert
                            px={2}
                            py={1}
                            fontSize={12}
                            rounded
                            marginTop={2}
                            status="error"
                          >
                            <AlertIcon />
                            <AlertTitle>{errors.email}</AlertTitle>
                          </Alert>
                        )}
                      </FormControl>

                      <a onClick={() => setIsForget(!isForget)}>
                        Back to login?
                      </a>

                      <Button
                        isLoading={resetLoading}
                        type="submit"
                        bg="buttonColor"
                        isFullWidth
                      >
                        Submit
                      </Button>
                    </VStack>
                  </form>
                )}
              </Formik>
            )}

            <Stack
              mt={10}
              direction={{ base: "column" }}
              align={"start"}
              justify={"center"}
            >
              <p>
                Don't have an account?{" "}
                <a onClick={() => router.push("/signup")}>Create one!</a>
              </p>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </UnAuth>
  )
}

export default Login
