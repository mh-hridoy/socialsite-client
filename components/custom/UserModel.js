import React, { useState } from "react"
import {
  Flex,
  Text,
  Button,
  Avatar,
  useToast,
  useColorModeValue,
  Modal,
ModalOverlay,
ModalContent,
ModalCloseButton,
FormControl, Input

} from "@chakra-ui/react"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import {
  MdVerified,
  MdDeleteOutline,
  MdOutlineModeEditOutline,
} from "react-icons/md"
import axios from "axios"

const UserModel = ({ user }) => {
  const userInfo = useSelector((state) => state.user.user)
  const token = useSelector((state) => state.user.token)
  const router = useRouter()
  const [isVloading, setIsVloading] = useState(false)
  const [isDloading, setIsDloading] = useState(false)
  const toast = useToast({ position: "top", isClosable: true })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [emailValue, setEmailValue] = useState("")
  const [nameValue, setNameValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const [phoneValue, setPhoneValue] = useState("")
  const [isChangeLoading, setIsChangeLoading] = useState(false)

  const verifyHandler = async (id) => {
    try {
      setIsVloading(!isVloading)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/verify-account/${userInfo._id}`,
        { userId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      setIsVloading(!isVloading)
      toast({
        status: "success",
        duration: 5000,
        title: data,
      })
      router.reload()
    } catch (e) {
      router.push("/")
      setIsVloading(!isVloading)

      const errorMsg = e.response && e.response.data.message
      toast({
        status: "error",
        duration: 5000,
        title: errorMsg || "Something went wrong!!!",
      })
      // console.log(errorMsg)
    }
  }

  const unVerifyHandler = async (id) => {
     try {
       setIsVloading(!isVloading)
       const { data } = await axios.post(
         `${process.env.NEXT_PUBLIC_MAIN_PROXY}/unverify-account/${userInfo._id}`,
         { userId: id },
         {
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
           },
           withCredentials: true,
         }
       )
       setIsVloading(!isVloading)
       toast({
         status: "success",
         duration: 5000,
         title: data,
       })
       router.reload()
     } catch (e) {
       router.push("/")
       setIsVloading(!isVloading)

       const errorMsg = e.response && e.response.data.message
       toast({
         status: "error",
         duration: 5000,
         title: errorMsg || "Something went wrong!!!",
       })
       // console.log(errorMsg)
     }
  }

  const deleteHandler = async (id) => {
    try {
      setIsDloading(!isDloading)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/delete-account/${userInfo._id}`,
        { userId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      setIsDloading(!isDloading)
      toast({
        status: "success",
        duration: 5000,
        title: data,
      })
      router.reload()
    } catch (e) {
      router.push("/")
      setIsDloading(!isDloading)

      const errorMsg = e.response && e.response.data.message
      toast({
        status: "error",
        duration: 5000,
        title: errorMsg || "Something went wrong!!!",
      })
      // console.log(errorMsg)
    }

  }

  const adminManageHandler = async () => {
    try {
      setIsChangeLoading(!isDloading)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/admin-manage-account/${userInfo._id}`,
        {
          fullName: nameValue,
          email: emailValue,
          phoneNumber: phoneValue,
          password: passwordValue,
          userId : user._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      setIsChangeLoading(!isDloading)
      toast({
        status: "success",
        duration: 5000,
        title: data,
      })
      router.reload()
    } catch (e) {
      router.push("/")
      setIsChangeLoading(!isDloading)

      const errorMsg = e.response && e.response.data.message
      toast({
        status: "error",
        duration: 5000,
        title: errorMsg || "Something went wrong!!!",
      })
      console.log(errorMsg)
    }

  }

  return (
    <>
      <Modal
        size={"xl"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(!isModalOpen)
        }}
      >
        <ModalOverlay />
        <ModalContent p={4}>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />

          <Flex gap={2} mb={4} mt={2} width={"100%"} direction="column">
            <FormControl htmlFor="fullName"> Full Name </FormControl>
            <Input
              value={nameValue != "" ? nameValue : user.fullName}
              onChange={(e) => setNameValue(e.target.value)}
              id="fullName"
            />

            <FormControl htmlFor="email"> Email </FormControl>
            <Input
              value={emailValue != "" ? emailValue : user.email}
              onChange={(e) => setEmailValue(e.target.value)}
              id="email"
            />

            <FormControl htmlFor="phone"> Phone Number </FormControl>
            <Input
              value={phoneValue != "" ? phoneValue : user.phoneNumber}
              onChange={(e) => setPhoneValue(e.target.value)}
              id="phone"
            />

            <FormControl htmlFor="password"> Password </FormControl>
            <Input
              value={passwordValue != "" ? passwordValue : user.password}
              onChange={(e) => setPasswordValue(e.target.value)}
              id="password"
            />

            <Button
            bg={"buttonColor"}
            isLoading={isChangeLoading}
              onClick={adminManageHandler}
            >
              Save
            </Button>
          </Flex>
        </ModalContent>
      </Modal>

      <Flex
        width={"100%"}
        padding={4}
        boxShadow="sm"
        rounded="md"
        border={"1px"}
        borderColor={useColorModeValue("gray.200", "#333")}
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Flex
          onClick={() =>
            router.push(
              user._id == userInfo._id
                ? `/account/myaccount/${user._id}`
                : `/account/${user._id}`
            )
          }
          gap={2}
          cursor="pointer"
        >
          <Avatar
            _hover={{ border: "2px solid rgb(29, 155, 240)" }}
            cursor="pointer"
            size={"sm"}
            name={user.fullName}
            alignItems={"center"}
            justifyContent="center"
            src={user.profilePicture?.img}
          ></Avatar>
          <Text
            display={"flex"}
            color="rgb(29, 155, 240)"
            alignItems="center"
            gap={2}
            fontWeight={600}
            fontSize={15}
          >
            {user.fullName}{" "}
            {user.isVerified && user.isVerified == true && (
              <MdVerified color="rgb(29, 155, 240)" />
            )}
          </Text>
        </Flex>

        <Flex
          gap={5}
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
        >
            <Button
              isLoading={isVloading}
              fontSize={12}
              size={"sm"}
              bg="buttonColor"
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              <MdOutlineModeEditOutline size={16} />
            </Button>
          
          <Button
            isLoading={isVloading}
            onClick={
              user.isVerified
                ? () => unVerifyHandler(user._id)
                : () => verifyHandler(user._id)
            }
            fontSize={12}
            size={"sm"}
            bg="buttonColor"
          >
            <MdVerified size={16} />
          </Button>
          {user.role == "admin" ? (
            <Text fontSize={12}>Admin</Text>
          ) : (
            <Button
              isLoading={isDloading}
              onClick={() => deleteHandler(user._id)}
              fontSize={12}
              size={"sm"}
              bg="buttonColor"
            >
              <MdDeleteOutline size={16} />
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  )
}

export default UserModel
