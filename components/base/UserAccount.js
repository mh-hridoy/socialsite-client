import React, { useState, useEffect } from "react"
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
  Textarea,
  Spinner,
  FormControl,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormErrorMessage
} from "@chakra-ui/react"
import {
  MdVerified,
  MdCalendarToday,
  MdOutlineLocationOn,
} from "react-icons/md"
import dateFormat from "dateformat"
import AllPost from "../custom/AllPost"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import { MdOutlineFlipCameraIos } from "react-icons/md"
import Resizer from "react-image-file-resizer"
import ReactCrop from "react-image-crop"
import countReaction from "../utils/countReaction"
import useHttp from "../utils/useHttp"
import SingleUserCard from "../custom/SingleUserCard"
import countyCode from "../utils/countyCode"
import Select from "react-select"
import Creatable from "react-select/creatable"

import { changeData } from "../../store/userInfoSlice"
import FeedCard from "../custom/FeedCard"

const UserAccount = ({
  post,
  user,
  totalPage,
  page,
  setPage,
  setHomeData,
  setUserData,
  quoteData,
  setQuoteData,
  isCreateModalOpen,
  setIsCreateModalOpen,
}) => {
  const userAccount = useSelector((state) => state.user.user)
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [nameValue, setNameValue] = useState("")
  const [bioValue, setBioValue] = useState("")
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [profileBeforeProcess, setProfileBeforeProcess] = useState(null)
  const [ImageCrop, setImageCrop] = useState(null)
  const [profileRawFile, setProfileRawFile] = useState(null)
  const [unfollowRequest, setUnfollowRequest] = useState(false)
  const [followRequest, setFollowRequest] = useState(false)
  const [userUploadedData, setUserUploadedData] = useState({})
  const [userDataRequest, setUserDataRequest] = useState(false)
  const [locationValue, setLocationValue] = useState("")
  const [dateOfBirthValue, setDateOfBirthValue] = useState("")
  const [webSiteLinkValue, setWebSiteLinkValue] = useState("")
  const [followData, setFollowData] = useState([])
  const [showFollowData, setShowFollowData] = useState(false)
  const [showFollowingData, setShowFollowingData] = useState(false)
  const [showFollowModal, setShowFollowModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportText, setReportText] = useState("")
  const [sendReport, setSendReport] = useState(false)
  const [language, setLanguage] = useState({})
  const [userTags, setUserTags] = useState([...user?.tagsArr])
  const [tagsVal, setTagsVal] = useState([])
  const [sniperPost, setSniperPost] = useState([])
  const [searchSniper, setSearchSniper] = useState(false)
  const [usernameValue, setUsernameValue] = useState("")
  const [userErrorMessage, setUserErrorMessage] = useState("")

  const isMyAccount = router.pathname == "/account/myaccount/[user]"

  const [crop, setCrop] = useState({
    unit: "%",
    x: 25,
    y: 10,
    width: 50,
    height: 70,
  })

  useEffect(() => {
    setSearchSniper(true)
  }, [])

  const { isLoading: _isSniperLoading } = useHttp({
    fetchNow: searchSniper,
    setFetchNow: setSearchSniper,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/search-sniper/${userAccount?._id}`,
    isAuth: true,
    isSetData: true,
    setData: setSniperPost,
  })

  const selectOption = [
    { value: "general", label: "General" },
    { value: "technology", label: "Technology" },
    { value: "development", label: "Development" },
    { value: "programming", label: "Programming" },
    { value: "places", label: "Places" },
    { value: "universe", label: "Universe" },
    { value: "nature", label: "Nature" },
  ]

  const tagsHandler = (tag) => {
    setUserTags(tag)
    const tags = []
    if (tag.length !== 0) {
      tag.map((item) => tags.push(item.value))
    }
    setTagsVal(tags)
  }

  const customStyles = {
    option: (provided) => ({
      ...provided,
      padding: 10,
      fontSize: 14,
    }),
    menu: (provided) => ({
      ...provided,
      color: "rgb(29, 155, 240)",
      backgroundColor: useColorModeValue("#fff", "#1A202C"),
    }),
    control: () => ({
      marginBottom: 10,
      display: "flex",
      border: `1px solid ${useColorModeValue("#EDF", "#ffffff44")}`,
      borderRadius: "5px",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: 14,
      opacity: 0.6,
    }),

    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1
      const transition = "opacity 300ms"
      const color = useColorModeValue("#000", "#fff")

      return { ...provided, opacity, transition, color }
    },
  }

  // console.log(cropProfileImage)

  const { isLoading } = useHttp({
    fetchNow: unfollowRequest,
    setFetchNow: setUnfollowRequest,
    method: "post",
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/unfollow-user/${userAccount?._id}`,
    body: { followId: user?._id },
    isAuth: true,
    isSetData: true,
    setData: setUserData,
  })

  const unFollowHandler = async () => {
    setUnfollowRequest(true)
  }

  const { isLoading: isFollowLoading } = useHttp({
    fetchNow: followRequest,
    setFetchNow: setFollowRequest,
    method: "post",
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/follow-user/${userAccount?._id}`,
    body: { followId: user?._id },
    isAuth: true,
    isSetData: true,
    setData: setUserData,
  })

  const followHandler = async () => {
    setFollowRequest(true)
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
    setProfileModalOpen(true)
    const file = e.target.files[0]
    setProfileRawFile(file)
    setProfileBeforeProcess(URL.createObjectURL(file))
  }

  const processProfilePic = () => {
    const canvas = document.createElement("canvas")

    const scaleX = ImageCrop.naturalWidth / ImageCrop.width
    const scaleY = ImageCrop.naturalHeight / ImageCrop.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext("2d")
    const pixelRatio = window.devicePixelRatio
    canvas.width = crop.width * pixelRatio
    canvas.height = crop.height * pixelRatio
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    ctx.imageSmoothingQuality = "low"
    ctx.drawImage(
      ImageCrop,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    const base64Image = canvas.toDataURL("image/jpeg")
    setProfileImage({
      name:
        profileRawFile.name.split(".").shift() +
        Date.now() +
        profileRawFile.name.split(".").pop(),
      type: "image/jpeg",
      img: base64Image,
    })

    setProfileModalOpen(false)
  }

  const languageHandler = (e) => {
    setLanguage(e)
  }

  const { isLoading: manageLoading } = useHttp({
    fetchNow: userDataRequest,
    setFetchNow: setUserDataRequest,
    method: "post",
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/manage-account/${userAccount?._id}`,
    body: userUploadedData,
    isAuth: true,
    isSetData: true,
    setData: setUserData,
    isEToast: true,
    isDispatch: true,
    dispatchType: "changeData",
    dispatchFunc: changeData,
    cb: () => {
      setNameValue("")
      setCoverImage(null)
      setProfileImage(null)
      setBioValue("")
      setIsModalOpen(!isModalOpen)
    },

    // ecb: () => setIsModalOpen(!isModalOpen),
  })

  const userDataHandler = async () => {
    const userData = {
      profileImage,
      coverImage,
      nameValue,
      bioValue,
      locationValue,
      dateOfBirthValue,
      webSiteLinkValue,
      language,
      tagsArr: userTags,
      tags: tagsVal,
      usernameValue,
    }

    if (usernameValue != "") {
      if (usernameValue.length <= 4) {
        return setUserErrorMessage(
          "Username must contain more than 4 character "
        );
      } else if (usernameValue.length >= 15) {
        return setUserErrorMessage("Username should not exceed 15 character ");
      }else if(usernameValue.indexOf(" ") != -1) {
        return setUserErrorMessage("Username should not contain empty spaces. ")

      }
    }
    setUserErrorMessage("")
    setUserUploadedData(userData)
    setUserDataRequest(true)
  }

  const { isLoading: showFollowingLoading } = useHttp({
    fetchNow: showFollowingData,
    setFetchNow: setShowFollowingData,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-following/${user?._id}`,
    isAuth: true,
    isSetData: true,
    setData: setFollowData,
    dataTarget: "following",
    isEToast: true,
  })

  const showFollowing = () => {
    setShowFollowingData(true)
    setShowFollowModal(true)
  }

  const { isLoading: showFollowerLoading } = useHttp({
    fetchNow: showFollowData,
    setFetchNow: setShowFollowData,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/get-followers/${user?._id}`,
    isAuth: true,
    isSetData: true,
    setData: setFollowData,
    dataTarget: "follower",
    isEToast: true,
  })

  const showFollower = () => {
    setShowFollowData(true)
    setShowFollowModal(true)
  }

  const { isLoading: reportLoading } = useHttp({
    fetchNow: sendReport,
    setFetchNow: setSendReport,
    method: "post",
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/report/${userAccount?._id}`,
    body: { reason: reportText, reportUser: user._id },
    isAuth: true,
    isToast: true,
    isEToast: true,
    cb: () => {
      setReportText("")
      setShowReportModal(false)
    },
  })

  const reportHandler = () => {
    setShowReportModal(true)
  }

  return (
    <>
      <Modal
        size={"xl"}
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false)
        }}
      >
        <ModalOverlay />
        <ModalContent p={5} py={10}>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <Textarea
            fontSize={14}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            rows={6}
            mb={2}
            required
            p={2}
            placeholder="Why you're reporting?"
            width={"100%"}
            resize="none"
          />
          <Button
            bg="buttonColor"
            isLoading={reportLoading}
            onClick={() => setSendReport(true)}
          >
            Submit
          </Button>
        </ModalContent>
      </Modal>
      {/* show follow and following modal */}
      <Modal
        size={"xl"}
        isOpen={showFollowModal}
        onClose={() => {
          setFollowData([])
          setShowFollowModal(false)
        }}
      >
        <ModalOverlay />
        <ModalContent p={5} py={10}>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <Text textAlign={"center"}>List</Text>
          {showFollowingLoading || showFollowerLoading ? (
            <Flex
              alignItems={"center"}
              justifyContent="center"
              width={"100%"}
              mt={4}
            >
              <Spinner color={"rgb(29, 155, 240)"} size={"xl"} />
            </Flex>
          ) : (
            <Flex direction="column" mt={4} gap={4}>
              {followData?.length != 0 &&
                followData.map((item, inx) => {
                  return (
                    <SingleUserCard userData={user} key={inx} user={item} />
                  )
                })}

              {followData.length == 0 && (
                <Text textarea="center" fontSize={14} opacity={0.8}>
                  Nothing to show
                </Text>
              )}
            </Flex>
          )}
        </ModalContent>
      </Modal>
      {/* show follow and following modal */}
      <Modal
        size={"xl"}
        isOpen={profileModalOpen}
        onClose={() => {
          setProfileImage(null)
          setProfileModalOpen(!profileModalOpen)
        }}
      >
        <ModalOverlay />
        <ModalContent p={5} py={10}>
          <ModalCloseButton _focus={{ boxShadow: "none" }} />
          <ReactCrop
            src={profileBeforeProcess}
            onImageLoaded={setImageCrop}
            crop={crop}
            onChange={setCrop}
          ></ReactCrop>
          <Flex marginTop={5} w={"100%"} justifyContent="end">
            <Button bg="buttonColor" onClick={processProfilePic}>
              Submit
            </Button>
          </Flex>
        </ModalContent>
      </Modal>

      <Modal
        size={"xl"}
        isOpen={isModalOpen}
        onClose={() => {
          setProfileImage(null)
          setUsernameValue("")
          
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
              <FormControl htmlFor="username"> Username </FormControl>
              <Input
                placeholder="username "
                value={
                  usernameValue != "" ? usernameValue : user?.usernameValue
                }
                onChange={(e) => setUsernameValue(e.target.value)}
                id="username"
              />
              {userErrorMessage != "" && (
                <Text fontSize={14} color={"red"}>
                  {" "}
                  {userErrorMessage}{" "}
                </Text>
              )}
              <FormControl htmlFor="bio"> Bio </FormControl>
              <Input
                value={bioValue != "" ? bioValue : user.bio}
                onChange={(e) => setBioValue(e.target.value)}
                id="bio"
              />

              <FormControl htmlFor="location"> Location </FormControl>
              <Input
                value={locationValue != "" ? locationValue : user?.location}
                onChange={(e) => setLocationValue(e.target.value)}
                id="location"
              />

              <FormControl htmlFor="dateOfBirth"> Date Of Birth </FormControl>
              <Input
                type={"date"}
                value={
                  dateOfBirthValue != ""
                    ? dateOfBirthValue
                    : new Date(user?.dateOfBirth)
                }
                onChange={(e) => setDateOfBirthValue(e.target.value)}
                id="dateOfBirth"
              />

              <FormControl htmlFor="websiteLink"> Website </FormControl>
              <Input
                value={
                  webSiteLinkValue != "" ? webSiteLinkValue : user?.websiteLink
                }
                onChange={(e) => setWebSiteLinkValue(e.target.value)}
                id="websiteLink"
              />

              <FormControl htmlFor="language"> Language </FormControl>
              <Select
                defaultValue={{
                  value: user?.userLangVal,
                  label: user?.userLang,
                  nativeName: user?.userLangNative,
                }}
                styles={customStyles}
                placeholder="Select Language..."
                options={countyCode}
                id="language"
                onChange={languageHandler}
              />

              <FormControl htmlFor="tags"> Your Tags </FormControl>
              <Creatable
                styles={customStyles}
                placeholder="Select or Create your tags..."
                id="tags"
                value={userTags}
                isMulti={true}
                onChange={tagsHandler}
                options={selectOption}
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
        minH={"100vh"}
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
            <Flex gap={4}>
              <Button
                onClick={
                  user.follower.includes(userAccount?._id) == true
                    ? unFollowHandler
                    : followHandler
                }
                size="sm"
                isLoading={
                  user.follower.includes(userAccount?._id) == true
                    ? isLoading
                    : isFollowLoading
                }
                fontSize={12}
                variant="outline"
              >
                {user.follower.includes(userAccount?._id) == true
                  ? "Unfollow"
                  : "Follow"}
              </Button>
              <Button
                size="sm"
                fontSize={12}
                variant="outline"
                onClick={reportHandler}
              >
                Report User
              </Button>
            </Flex>
          )}
        </Flex>

        <Flex transform="translateY(-10px)" px={2} gap={1} direction="column">
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
          {user?.userName && <Text fontSize={14} opacity={0.8} >@{user?.userName}</Text>}

          {user?.bio && <Text>{user.bio}</Text>}

          <Flex gap={4}>
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

            {user?.location && (
              <Flex alignItems={"center"} gap={2}>
                <MdOutlineLocationOn sizee={18} />{" "}
                <Text fontSize={16} opacity={0.8}>
                  {user?.location}
                </Text>{" "}
              </Flex>
            )}
          </Flex>

          {user?.websiteLink && (
            <Flex gap={2}>
              <Text fontSize={14}>Website : </Text>
              <a
                onClick={() => window.open(user?.websiteLink)}
                fontSize={14}
                opacity={0.8}
              >
                {user?.websiteLink}
              </a>{" "}
            </Flex>
          )}

          {user?.dateOfBirth && (
            <Flex gap={2}>
              <Text fontSize={14}>Date Of Birth : </Text>
              <Text fontSize={14} opacity={0.8}>
                {dateFormat(user?.dateOfBirth, "mmmm dS, yyyy")}
              </Text>{" "}
            </Flex>
          )}
          {user?.userLang && (
            <Flex gap={2}>
              <Text fontSize={14}>Language : </Text>
              <Text fontSize={14} opacity={0.8}>
                {user?.userLang}
              </Text>{" "}
            </Flex>
          )}

          <Flex mt={5} gap={5}>
            <Text
              cursor="pointer"
              display={"flex"}
              gap={2}
              onClick={showFollowing}
              fontSize={14}
              fontWeight={600}
            >
              {countReaction(user.following?.length)}
              <Text opacity={0.8} fontWeight={200}>
                Followings
              </Text>
            </Text>

            <Text
              cursor="pointer"
              display={"flex"}
              gap={2}
              onClick={showFollower}
              fontSize={14}
              fontWeight={600}
            >
              {countReaction(user.follower?.length)}{" "}
              <Text opacity={0.8} fontWeight={200}>
                Followers
              </Text>
            </Text>
          </Flex>
        </Flex>

        {/* tabs will be here */}
        <Tabs>
          <TabList>
            <Tab _focus={{ boxShadow: "none" }}>Feeds</Tab>
            {isMyAccount && <Tab _focus={{ boxShadow: "none" }}>Sniper</Tab>}
          </TabList>
          <TabPanels>
            <TabPanel>
              <AllPost
                quoteData={quoteData}
                setQuoteData={setQuoteData}
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                setPage={setPage}
                totalPage={totalPage}
                page={page}
                post={post}
                setHomeData={setHomeData}
                user={user}
              />
            </TabPanel>
            {isMyAccount && (
              <TabPanel>
                {searchSniper && (
                  <Flex
                    height="100vh"
                    alignItems={"center"}
                    justifyContent="center"
                    width={"100%"}
                  >
                    <Spinner color={"rgb(29, 155, 240)"} size={"xl"} />
                  </Flex>
                )}

                {!searchSniper && sniperPost.length != 0 && (
                  <Flex minWidth={"100%"} direction="column">
                    {sniperPost.map((item, inx) => {
                      return (
                        <FeedCard
                          key={inx}
                          quoteData={quoteData}
                          setQuoteData={setQuoteData}
                          isCreateModalOpen={isCreateModalOpen}
                          setIsCreateModalOpen={setIsCreateModalOpen}
                          setHomeData={setHomeData}
                          item={item}
                        />
                      )
                    })}
                  </Flex>
                )}
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  )
}

export default UserAccount
