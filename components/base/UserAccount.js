import React, { useState } from "react"
import {
  Flex,
  Avatar,
  Text,
  useColorModeValue,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  FormLabel,
  Input,
  Image,
  FormControl,
} from "@chakra-ui/react"
import { MdVerified, MdCalendarToday } from "react-icons/md"
import dateFormat from "dateformat"
import AllPost from "../custom/AllPost"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import axios from "axios"
import { MdOutlineFlipCameraIos } from "react-icons/md"
import Resizer from "react-image-file-resizer"

const UserAccount = ({
  post,
  user,
  totalPage,
  page,
  setPage,
  setHomeData,
  setUserData,
}) => {
  const userAccount = useSelector((state) => state.user.user)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const token = useSelector((state) => state.user.token)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [nameValue, setNameValue] = useState("")
  const [bioValue, setBioValue] = useState("")
  const [manageLoading, setManageLoading] = useState(false)

  const unFollowHandler = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/unfollow-user/${userAccount._id}`,
        { followId: user._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )

      setUserData(data)
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)

      const errorMsg = e.response && e.response.data.message
      console.log(errorMsg)
    }
  }

  // console.log(user)
  const followHandler = async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/follow-user/${userAccount._id}`,
        { followId: user._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )

      setUserData(data)
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)

      const errorMsg = e.response && e.response.data.message
      console.log(errorMsg)
    }
  }

  const coverImageHandler = (e) => {
    const file = e.target.files[0]
    Resizer.imageFileResizer(
      file,
      600,
      600,
      "JPEG",
      100,
      0,
      (uri) => {
        return setCoverImage({
          name:
            file.name.split(".").shift() +
            Date.now() +
            file.name.split(".").pop(),
          type: file.type || "image/jpeg",
          img: uri,
        })
      },
      "base64"
    )
  }
  const profileImageHandler = (e) => {
    const file = e.target.files[0]
    Resizer.imageFileResizer(
      file,
      600,
      600,
      "JPEG",
      100,
      0,
      (uri) => {
        return setProfileImage({
          name:
            file.name.split(".").shift() +
            Date.now() +
            file.name.split(".").pop(),
          type: file.type || "image/jpeg",
          img: uri,
        })
      },
      "base64"
    )
  }

  // console.log(coverImage)

  const userDataHandler = async () => {
    const userData = {profileImage, coverImage, nameValue, bioValue }
       try {
         setManageLoading(true)
         const { data } = await axios.post(
           `${process.env.NEXT_PUBLIC_MAIN_PROXY}/manage-account/${userAccount._id}`,
           userData,
           {
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
             },
             withCredentials: true,
           }
         )

         setUserData(data)
         setManageLoading(false)
         setNameValue("")
         setCoverImage(null)
         setProfileImage(null)
         setBioValue("")
         setIsModalOpen(!isModalOpen)
       } catch (e) {
         setManageLoading(false)
        setIsModalOpen(!isModalOpen)
         const errorMsg = e.response && e.response.data.message
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
        <ModalContent px={5}>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <Flex paddingRight={10} justifyContent="flex-end">
            <Button
              isLoading={manageLoading}
              size="sm"
              fontSize={14}
              rounded="full"
              m={4}
              bg="buttonColor"
              onClick={userDataHandler}
            >
              Save
            </Button>
          </Flex>
          <Flex direction="column" mb={20}>
            <Flex direction={"column"} w={"100%"}>
              <Flex
                width={"100%"}
                height={40}
                alignItems="center"
                justifyContent={"center"}
                position="relative"
                bg={useColorModeValue("gray.200", "rgb(29, 155, 240, 0.1)")}
              >
                <Image
                  width={"100%"}
                  height="100%"
                  objectFit={"cover"}
                  objectPosition="center"
                  src={
                    coverImage != null ? coverImage.img : user.profileCover?.img
                  }
                />
                <FormLabel
                  position={"absolute"}
                  bg="white"
                  padding={5}
                  _hover={{ color: "rgb(29, 155, 240)" }}
                  rounded="full"
                  htmlFor="cover"
                  cursor="pointer"
                >
                  <MdOutlineFlipCameraIos
                    size={25}
                    color={useColorModeValue("#000", "#000")}
                  />{" "}
                </FormLabel>
                <Input
                  onChange={coverImageHandler}
                  type="file"
                  accept="image/*"
                  hidden
                  id="cover"
                />
                <Avatar
                  _hover={{ border: "2px solid rgb(29, 155, 240)" }}
                  cursor="pointer"
                  position={"absolute"}
                  border="2px"
                  borderColor={useColorModeValue("gray.200", "#333")}
                  bottom={-10}
                  left={5}
                  size={"xl"}
                  name={user.fullName}
                  src={
                    profileImage != null
                      ? profileImage.img
                      : user.profilePicture?.img
                  }
                >
                  <FormLabel
                    bg={"white"}
                    _hover={{ color: "rgb(29, 155, 240)" }}
                    htmlFor="profile"
                    padding={2}
                    cursor="pointer"
                    rounded="full"
                    zIndex={100}
                    position="absolute"
                    transform="translateX(5px)"
                  >
                    {" "}
                    <MdOutlineFlipCameraIos size={25} color="black" />
                  </FormLabel>
                  <Input
                    onChange={profileImageHandler}
                    type="file"
                    accept="image/*"
                    hidden
                    id="profile"
                  />
                </Avatar>
              </Flex>
            </Flex>
            <Flex gap={2} mt={14} direction={"column"}>
              <FormControl htmlFor="name"> Full Name </FormControl>
              <Input
                value={nameValue != "" ? nameValue : user.fullName}
                onChange={(e) => setNameValue(e.target.value)}
                id="name"
              />
              <FormControl htmlFor="bio"> Bio </FormControl>
              <Input
                value={bioValue != "" ? bioValue : user.bio}
                onChange={(e) => setBioValue(e.target.value)}
                id="bio"
              />
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>

      <Flex
        borderRight={"1px"}
        borderLeft={"1px"}
        borderColor={useColorModeValue("gray.200", "#333")}
        minWidth={"100%"}
        mb={10}
        gap={4}
        direction="column"
      >
        <Flex direction={"column"} w={"100%"}>
          <Flex
            width={"100%"}
            height={40}
            position="relative"
            bg={useColorModeValue("gray.200", "rgb(29, 155, 240, 0.1)")}
          >
            {user.profilePicture && (
              <Image
                width={"100%"}
                height="100%"
                objectFit={"cover"}
                objectPosition="center"
                src={user.profileCover?.img}
              />
            )}
            <Avatar
              // transform={"translateX(-200px) translateY(-50px)"}
              _hover={{ border: "2px solid rgb(29, 155, 240)" }}
              cursor="pointer"
              position={"absolute"}
              border="2px"
              borderColor={useColorModeValue("gray.200", "#333")}
              bottom={-10}
              left={5}
              size={"xl"}
              name={user.fullName}
              src={user.profilePicture?.img}
            ></Avatar>
          </Flex>
        </Flex>

        <Flex justifyContent="flex-end" paddingRight={5}>
          {userAccount?._id == router.query.user ? (
            <Button
              onClick={() => setIsModalOpen(!isModalOpen)}
              size="sm"
              fontSize={12}
              variant="outline"
            >
              Manage Account
            </Button>
          ) : (
            <Button
              onClick={
                user.follower.includes(userAccount._id) == true
                  ? unFollowHandler
                  : followHandler
              }
              size="sm"
              isLoading={isLoading}
              fontSize={12}
              variant="outline"
            >
              {user.follower.includes(userAccount._id) == true
                ? "Unfollow"
                : "Follow"}
            </Button>
          )}
        </Flex>

        <Flex px={2} gap={1} direction="column">
          <Text
            display={"flex"}
            alignItems="center"
            gap={1}
            fontWeight={600}
            fontSize={18}
          >
            {user.fullName}{" "}
            {user.isVerified && user.isVerified == true && (
              <MdVerified color="rgb(29, 155, 240)" />
            )}
          </Text>

          <Text
            display="flex"
            fontSize={14}
            alignItems="center"
            gap={2}
            opacity={0.8}
          >
            <MdCalendarToday /> Joined at{" "}
            {user && dateFormat(user.createdAt, "mmmm dS, yyyy")}
          </Text>

          <Text>{user.bio && user.bio}</Text>

          <Flex mt={5} gap={5}>
            <Text display={"flex"} gap={2} fontSize={14} fontWeight={600}>
              {user.following?.length}{" "}
              <Text opacity={0.8} fontWeight={200}>
                Followings
              </Text>
            </Text>

            <Text display={"flex"} gap={2} fontSize={14} fontWeight={600}>
              {user.follower?.length}{" "}
              <Text opacity={0.8} fontWeight={200}>
                Followers
              </Text>
            </Text>
          </Flex>
        </Flex>

        <Text mr={5} p={2} mt={3} fontWeight={600}>
          Feeds:
        </Text>
        <AllPost
          setPage={setPage}
          totalPage={totalPage}
          page={page}
          post={post}
          setHomeData={setHomeData}
        />
      </Flex>
    </>
  )
}

export default UserAccount
