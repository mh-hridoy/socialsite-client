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
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react"
import PhoneInput from "react-phone-input-2"

import * as Yup from "yup"

import { useRouter } from "next/router"
import UnAuth from "../components/base/UnAuth"
import useHttp from "../components/utils/useHttp"


const signupSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be 8 character long.")
    .max(20, "Too Long Password!")
    .required("Password cannot be empty!"),
  fullName: Yup.string()
    .min(4, "Full name is too small.")
    .max(40, "Full name is too large!")
    .required("Name cannot be empty!"),
  email: Yup.string()
    .email("Invalid email address!")
    .required("Email address is required!"),
})

const Signup = () => {
  const [sendRequest, setSendRequest] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const router = useRouter()
  const [body, setBody] = useState({})

  // Signup request using custom hook
  const { isLoading } = useHttp(
    {fetchNow : sendRequest,
    setFetchNow : setSendRequest,
    url : `${process.env.NEXT_PUBLIC_MAIN_PROXY}/signup`,
    method : "post",
    body : body,
    isToast : true,
    toastMessage : "data.message",
    isPush : true,
    pushTo: "/login"}
  )

  const phoneNumberHandler = (e) => {
    setPhoneNumber(e)
  }

  const signupHandler = (values) => {
    setBody({ ...values, phoneNumber })
    setSendRequest(true)
  }

  return (
    <UnAuth>
      <Flex
        minH={"100vh"}
        width={"100%"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Create a new account!</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <Formik
                validationSchema={signupSchema}
                initialValues={{
                  email: "",
                  password: "",
                  fullName: "",
                }}
                onSubmit={signupHandler}
              >
                {({ handleSubmit, errors, touched }) => (
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="flex-start">
                      <FormControl>
                        <FormLabel htmlFor="email">Full Name</FormLabel>
                        <Field
                          as={Input}
                          id="fullName"
                          name="fullName"
                          type="text"
                          variant="filled"
                        />
                        {errors.fullName && touched.fullName && (
                          <Alert
                            px={2}
                            py={1}
                            fontSize={12}
                            rounded
                            marginTop={2}
                            status="error"
                          >
                            <AlertIcon />
                            <AlertTitle>{errors.fullName}</AlertTitle>
                          </Alert>
                        )}
                      </FormControl>

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

                      <FormControl>
                        <FormLabel htmlFor="password">Phone Number</FormLabel>
                        <Field
                        
                          value={phoneNumber}
                          as={PhoneInput}
                          onChange={(e) => phoneNumberHandler(e)}
                          id="phone"
                          inputClass="contactClass"
                          dropdownClass="contactDropDown"
                          inputStyle={{
                            border: `1px solid ${useColorModeValue(
                              "#EDF2F7",
                              "transparent"
                            )}`,
                            backgroundColor: useColorModeValue(
                              "#EDF2F7",
                              "#ffffff0A"
                            ),
                            width: "100%",
                            height: 40,
                          }}
                          dropdownStyle={{
                            border: `1px solid ${useColorModeValue(
                              "#EDF2F7",
                              "transparent"
                            )}`,
                            backgroundColor: useColorModeValue(
                              "#EDF2F7",
                              "#1A202C"
                            ),
                            color: useColorModeValue("rgb(29, 155, 240)", "rgb(29, 155, 240)"),
                          }}
                          buttonStyle={{
                            border: `1px solid ${useColorModeValue(
                              "#EDF2F7",
                              "transparent"
                            )}`,
                            backgroundColor: useColorModeValue(
                              "#EDF2F7",
                              "#ffffff0A"
                            ),
                          }}
                          name="phone"
                          type="tel"
                          country={"us"}
                          variant="filled"
                        />
                        {/* phone number error will be here */}
                      </FormControl>

                      <Button
                        isLoading={isLoading}
                        type="submit"
                        bg="buttonColor"
                        isFullWidth
                      >
                        Create Account
                      </Button>
                    </VStack>
                  </form>
                )}
              </Formik>

              <Stack
                mt={5}
                direction={{ base: "column" }}
                align={"start"}
                justify={"center"}
              >
                <p>
                  Already have an account?{" "}
                  <a onClick={() => router.push("/login")}>Login!</a>
                </p>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </UnAuth>
  )
}

export default Signup
