import React, { useState, useEffect, useRef } from "react"
import {
  Flex,
  Avatar,
  Text,
  TagLabel,
  Tag,
  useToast,
  useColorModeValue,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Textarea,
  Input,
} from "@chakra-ui/react"
import { BsHeart, BsHeartFill, BsChatQuote } from "react-icons/bs"
import { RiStackshareLine } from "react-icons/ri"
import { FiShare } from "react-icons/fi"
import { AiOutlineComment } from "react-icons/ai"
import Masonry from "react-masonry-css"
import GalleryModal from "./GalleryModal"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { MdVerified } from "react-icons/md"
import _ from "underscore"
import timeAgo from "../utils/DateConverter"
import { BsThreeDotsVertical } from "react-icons/bs"
import countReaction from "../utils/countReaction"
import useHttp from "../utils/useHttp"
import SingleFeed from "../custom/SingleFeed"
import LinkPreview from "./LinkPreview"
import { find as FindURL } from "linkifyjs"
import parse from "html-react-parser"
import LanguageDetect from "languagedetect"
import axios from 'axios'
const FeedCard = (props) => {
  const [currentImageArray, setCurrentImageArray] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(0)
  const user = useSelector((state) => state.user.user)
  const router = useRouter()
  const toast = useToast({ position: "top", isClosable: true })
  const [item, setItem] = useState(props.item)
  const [showComment, setShowComment] = useState(false)
  const [postDeleteId, setPostDeleteId] = useState(null)
  const [postDelRequest, setPostDelRequest] = useState(false)
  const [sendShareRequest, setSendShareRequest] = useState(false)
  const [reactRequest, setReactRequest] = useState(false)
  const [unlikeRequest, setUnlikeRequest] = useState(false)
  const [sendUnshareRequest, setSendUnshareRequest] = useState(false)
  const [adminDeleteNow, setAdminDeleteNow] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportText, setReportText] = useState("")
  const [sendReport, setSendReport] = useState(false)
  const [postLanguage, setPostLanguage] = useState(null)
  const [isOpenTranslate, setIsOpenTranslate] = useState(false)
  const [getTranslate, setGetTranslate] = useState(false)
  const [translateText, setTranslateText] = useState("")
  const videoRef = useRef(null)
  const pathName = router.pathname
  const lngDetector = new LanguageDetect()

  const isShowQuote =
    props.hasQuote == true && pathName.indexOf("/post/[postid]") == 0

  const breakpointColumnsObj = {
    default: 2,
    700: 1,
  }

  useEffect(() => {
    if (getTranslate == true) {
      const getTrans = async () => {
        try {
          const { data } = await axios.post(
            "https://translate.argosopentech.com/translate",
            { q: props?.item?.text, source: "auto", target: user?.userLangVal },
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "*",
                Authorization: "authorize",
              },
            }
          )
          setGetTranslate(false)
          setTranslateText(data?.translatedText)
        } catch (e) {
                    setGetTranslate(false)

          const errorMsg = e.response
            ? e.response.data.message
            : "Something went wrong!!!"
          setTranslateText(errorMsg)
        }
      }

      getTrans()
    }
  }, [getTranslate == true])

  // console.log(props.hasQuote)

  useEffect(() => {
    if (props?.item?.text) {
      const postLlang = lngDetector.detect(props?.item?.text)
      if(postLlang.length != 0){
        setPostLanguage(postLlang[0][0])
      }
    }
  }, [props?.item?.text])

  const PostText = () => {
    const allLinks = FindURL(props?.item?.text)
    let text = props?.item?.text

    if (allLinks.length != 0) {
      allLinks.forEach((link) => {
        const indexOfUrl = text.indexOf(link.value)
        if (indexOfUrl >= 0) {
          text =
            text.substring(0, indexOfUrl) +
            `<a href=${link.value} target="_blank">` +
            text.substring(indexOfUrl, indexOfUrl + link.value.length) +
            "</a>" +
            text.substring(indexOfUrl + link.value.length)
        }
      })
    } else {
      text = `<p>${text}</p>`
    }

    return <div> {parse(text)} </div>
  }

  // console.log(PostText)
  const quoteHandler = () => {
    props.setQuoteData(item)
    props.setIsCreateModalOpen(true)
  }

  // console.log(item)
  useEffect(() => {
    setItem(props.item)
  }, [props.item])

  const galleryHandler = (inx) => {
    setIsModalOpen(!isModalOpen)
    setSelectedItem(inx)
    setCurrentImageArray([...item.images])
  }

  // console.log(item)

  const likeHandler = async (e) => {
    e.stopPropagation()
    const modItem = _.clone(item)
    modItem.totalReact = modItem.totalReact + 1

    const reactedByUser = [...modItem.reactedByUser]

    reactedByUser.push(user._id)
    modItem.reactedByUser = [...new Set(reactedByUser)]

    setItem(modItem)
    setReactRequest(true)
  }

  //like request
  const { isLoading: _likeLoading } = useHttp({
    fetchNow: reactRequest,
    setFetchNow: setReactRequest,
    method: "post",
    body: { userId: user?._id, postId: item?._id },
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/post-like`,
    isAuth: true,
  })

  //share feed request
  const { isLoading: _isShareLoading } = useHttp({
    fetchNow: sendShareRequest,
    setFetchNow: setSendShareRequest,
    method: "post",
    body: { userId: user?._id, postId: item?._id },
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/post-share`,
    isAuth: true,
  })

  const shareHandler = () => {
    const modItem = _.clone(item)

    const sharedByUser = [...modItem.sharedBy]

    sharedByUser.push(user?._id)
    modItem.sharedBy = [...new Set(sharedByUser)]

    setItem(modItem)

    setSendShareRequest(true)
  }

  //unshare feed request
  const { isLoading: _isunShareLoading } = useHttp({
    fetchNow: sendUnshareRequest,
    setFetchNow: setSendUnshareRequest,
    method: "post",
    body: { userId: user?._id, postId: item?._id },
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/post-unshare`,
    isAuth: true,
  })

  const unSharehandler = () => {
    const modItem = _.clone(item)

    const sharedByUser = [...modItem.sharedBy]

    const newArr = sharedByUser.filter((item) => item != user?._id)
    modItem.sharedBy = [...new Set(newArr)]

    setItem(modItem)
    setSendUnshareRequest(true)
  }

  const unLikeHandler = async (e) => {
    e.stopPropagation()
    const modItem = _.clone(item)
    modItem.totalReact = modItem.totalReact - 1

    const reactedByUser = [...modItem.reactedByUser]
    const indexOfUser = reactedByUser.indexOf((item) => item == user._id)
    reactedByUser.splice(indexOfUser, 1)
    modItem.reactedByUser = [...new Set(reactedByUser)]

    setItem(modItem)
    setUnlikeRequest(true)
  }

  //unLike request
  const { isLoading: _unlikeLoading } = useHttp({
    fetchNow: unlikeRequest,
    setFetchNow: setUnlikeRequest,
    method: "post",
    body: { userId: user?._id, postId: item?._id },
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/post-unlike`,
    isAuth: true,
  })

  //post delete request
  const { isLoading: isPostDeleting } = useHttp({
    fetchNow: postDelRequest,
    setFetchNow: setPostDelRequest,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/delete-post/${user?._id}/${item?._id}`,
    isAuth: true,
    isEToast: true,
    cb: () => {
      props.setHomeData((prev) => {
        const allPost = [...prev]
        const indexOfPost = allPost.findIndex((itm) => itm?._id == item?._id)
        allPost.splice(indexOfPost, 1)
        return [...new Set(allPost)]
      })
    },
  })

  const postDeleteHandler = async () => {
    setPostDeleteId(item._id)
    setPostDelRequest(true)
  }

  //admin post delete request
  const { isLoading: isAdminPostDeleting } = useHttp({
    fetchNow: adminDeleteNow,
    setFetchNow: setAdminDeleteNow,
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/admin-delete-post/${user?._id}/${item?._id}`,
    isAuth: true,
    isEToast: true,
    cb: () => {
      props.setHomeData((prev) => {
        const allPost = [...prev]
        const indexOfPost = allPost.findIndex((itm) => itm?._id == item?._id)
        allPost.splice(indexOfPost, 1)
        return [...new Set(allPost)]
      })
    },
  })

  const deleteByAdmin = () => {
    setPostDeleteId(item._id)
    setAdminDeleteNow(true)
  }

  const { isLoading: reportLoading } = useHttp({
    fetchNow: sendReport,
    setFetchNow: setSendReport,
    method: "post",
    url: `${process.env.NEXT_PUBLIC_MAIN_PROXY}/report/${user?._id}`,
    body: {
      reason: reportText,
      reportUser: item?.user?._id,
      reportedPost: item?._id,
    },
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

      <GalleryModal
        isModalOpen={isModalOpen}
        setCurrentImageArray={setCurrentImageArray}
        setIsModalOpen={setIsModalOpen}
        currentImageArray={currentImageArray}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
      <Flex
        position={"relative"}
        width={"100%"}
        cursor={"pointer"}
        onClick={() => {
          if (item.postType == "comment") {
            router.push(`/post/comment/${item._id}`)
          } else {
            router.push(`/post/${item._id}`)
          }
        }}
        ref={props.lastFeedRef ? props.lastFeedRef : null}
        direction={"column"}
        gap={4}
        // borderTop="1px"
        borderTop="1px"
        borderColor={useColorModeValue("gray.200", "#333")}
      >
        <Flex
          direction={"column"}
          position={"relative"}
          p={4}
          width={"100%"}
          rounded="md"
        >
          <Flex alignItems="center" gap={2}>
            <Flex
              gap={2}
              onClick={(e) => {
                e.stopPropagation()
                router.push(
                  item.user._id == user._id
                    ? `/account/myaccount/${item?.user?._id}`
                    : `/account/${item && item?.user?._id}`
                )
              }}
            >
              <Avatar
                _hover={{ border: "2px solid rgb(29, 155, 240)" }}
                cursor="pointer"
                size={"sm"}
                name={
                  item?.user && item?.user.fullName
                    ? item?.user.fullName
                    : "Not A User"
                }
                src={item?.user?.profilePicture?.img}
              ></Avatar>
              <Flex alignItems="center" gap={4}>
                <Text
                  display={"flex"}
                  alignItems="center"
                  // gap={2}
                  fontWeight={600}
                  fontSize={16}
                  color={
                    item?.user?._id == user?._id
                      ? "rgb(29, 155, 240)"
                      : undefined
                  }
                >
                  {item?.user ? item?.user.fullName : "Not A User"}{" "}
                  {item?.user && item?.user.isVerified == true && (
                    <MdVerified color="rgb(29, 155, 240)" />
                  )}
                </Text>
              </Flex>
            </Flex>
            <Text
              onClick={(e) => e.stopPropagation()}
              fontSize={12}
              fontWeight={500}
              opacity={"0.7"}
            >
              {timeAgo(item?.createdAt)}
            </Text>

            <div
              style={{ flex: 1 }}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Flex alignItems="center" justifyContent="flex-end">
                <Menu>
                  <MenuButton
                    variant="fill"
                    bg="transparent"
                    _active={{ bg: "transparent" }}
                    _hover={{ bg: "transparent" }}
                    as={Button}
                  >
                    {isPostDeleting ||
                    (isAdminPostDeleting && postDeleteId == item?._id) ? (
                      <Spinner />
                    ) : (
                      <BsThreeDotsVertical />
                    )}
                  </MenuButton>
                  <MenuList fontSize={12}>
                    <MenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(
                          item.postType != "comment"
                            ? `${window.location.protocol}//${window.location.host}/post/${item?._id}`
                            : `${window.location.protocol}//${window.location.host}/post/comment/${item?._id}`
                        )

                        toast({
                          status: "success",
                          duration: 5000,
                          title: "Link copied to the clipboard.",
                        })
                      }}
                    >
                      Share URL
                    </MenuItem>
                    {item?.user?._id == user?._id && (
                      <MenuItem onClick={postDeleteHandler}>Delete</MenuItem>
                    )}

                    {user?.role == "admin" && (
                      <MenuItem onClick={deleteByAdmin}>Force Delete</MenuItem>
                    )}
                    <MenuItem onClick={reportHandler}>Report to admin</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </div>
          </Flex>
          {item?.postType == "comment" && (
            <Text
              pl={10}
              display={"flex"}
              gap={1}
              fontSize={14}
              opacity={"0.7"}
            >
              Replying to{" "}
              <Text
                opacity={"1"}
                fontWeight={600}
                cursor="pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(
                    item?.referPost?.user?._id == user?._id
                      ? `/account/myaccount/${item?.referPost?.user?._id}`
                      : `/account/${item?.referPost?.user._id}`
                  )
                }}
              >
                {item?.referPost?.user.fullName}
              </Text>{" "}
            </Text>
          )}
          {item?.text && item?.text != item?.linkData?.link && (
            <Flex wordBreak={"break-word"} maxWidth={"100%"}>
              <Text
                pl={10}
                mb={item?.images?.length == 0 ? 5 : 1}
                pr={4}
                fontSize={15}
              >
                <PostText />
              </Text>
            </Flex>
          )}
          {item?.referPost && router.pathname != "/post/[postid]" && (
            <Flex
              onClick={(e) => {
                e.stopPropagation()
                if (item?.referPost?.postType == "comment") {
                  router.push(`/post/comment/${item?.referPost?._id}`)
                } else {
                  router.push(`/post/${item?.referPost?._id}`)
                }
              }}
              boxShadow={"sm"}
              rounded="lg"
              border="1px"
              borderColor="gray.200"
              m={5}
              mt={1}
              wrap={"wrap"}
              bg={useColorModeValue("gray.200", "#333")}
            >
              <SingleFeed
                showLink={
                  item.referPost?.linkData != undefined &&
                  item.referPost?.linkData.image?.img
                }
                linkData={item.referPost?.linkData}
                item={item.referPost}
              />

              {/* <LinkPreview item={item.referPost?.linkData} /> */}
            </Flex>
          )}
          {item?.tags?.length != 0 && (
            <Flex
              mb={item?.images?.length != 0 ? 2 : 10}
              marginLeft={10}
              gap={5}
            >
              {item?.tags.map((item, inx) => {
                return (
                  <Tag
                    cursor={"pointer"}
                    key={inx}
                    variant="outline"
                    size="md"
                    colorScheme="gray"
                  >
                    <TagLabel>#{item}</TagLabel>
                  </Tag>
                )
              })}
            </Flex>
          )}
          {item?.text != " " && item?.text != item?.linkData?.link && user?.userLang && user?.userLang?.toLowerCase() != postLanguage && (
                <Flex
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsOpenTranslate(!isOpenTranslate)
                    setGetTranslate(true)
                  }}
                  mb={isOpenTranslate ? 1 : 4}
                  fontSize={12}
                  ml={10}
                >
                  <a>{isOpenTranslate ? "Hide" : "See"} translation</a>
                </Flex>
              )}

          {isOpenTranslate && (
            <Flex
              p={2}
              rounded="md"
              mb={6}
              ml={10}
              bg={useColorModeValue("gray.200", "#333")}
            >
              {getTranslate && (
                <Flex
                  width="100%"
                  alignItems={"center"}
                  justifyContent="center"
                >
                  <Spinner color={"rgb(29, 155, 240)"} size={"sm"} />
                </Flex>
              )}
              {!getTranslate && (
                <Text fontSize={14} wordBreak={"break-word"}>
                  {translateText}
                </Text>
              )}
            </Flex>
          )}

          {item?.images && item?.images.length !== 0 && (
            <Flex
              py={3}
              pl={10}
              alignItems="center"
              justifyContent="center"
              pr={4}
              onClick={(e) => e.stopPropagation()}
              marginBottom={10}
            >
              <>
                {item?.images.length == 1 ? (
                  item?.images[0].type?.includes("image") ? (
                    <img
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageArray([...item.images])
                        setIsModalOpen(!isModalOpen)
                      }}
                      style={{ cursor: "pointer", borderRadius: "20px" }}
                      alt={item?.images[0].name}
                      src={item?.images[0].img}
                    />
                  ) : (
                    item?.images[0].type?.includes("video") && (
                      <video
                        ref={videoRef}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          cursor: "pointer",
                          borderRadius: "20px",
                          height: "300px",
                          widht: "100%",
                        }}
                        src={item?.images[0].img}
                        controls={true}
                        autoPlay={false}
                      ></video>
                    )
                  )
                ) : (
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                  >
                    {item?.images.map((image, inx) =>
                      image.type?.includes("image") ? (
                        <img
                          onClick={(e) => {
                            e.stopPropagation()
                            galleryHandler(inx)
                          }}
                          style={{
                            cursor: "pointer",
                            margin: 2,
                            borderRadius: "20px",

                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                          key={inx}
                          alt={image.name}
                          src={image.img}
                        />
                      ) : (
                        image.type?.includes("video") && (
                          <video
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              cursor: "pointer",
                              borderRadius: "20px",

                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                            src={image?.img}
                            key={inx}
                            controls={true}
                            autoPlay={false}
                          ></video>
                        )
                      )
                    )}
                  </Masonry>
                )}
              </>
            </Flex>
          )}
          {item?.linkData && item?.linkData?.title && (
            <Flex
              alignSelf={"center"}
              onClick={(e) => {
                e.stopPropagation
                window.open(item?.linkData?.link, "_blank")
              }}
              width={"90%"}
              bg={useColorModeValue("gray.200", "#333")}
              boxShadow="sm"
              border="1px"
              borderColor={useColorModeValue("gray.200", "#333")}
              borderRadius="lg"
              mb={10}
            >
              <LinkPreview item={item?.linkData} />
            </Flex>
          )}
          {/* this is for extras */}
          {isShowQuote && (
            <Flex
              mt={2}
              mb={8}
              width={"90%"}
              border="1px"
              borderColor="gray.200"
              bg={useColorModeValue("gray.200", "#333")}
              borderRadius={"lg"}
              boxShadow="sm"
              alignSelf="center"
              direction="column"
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/post/${item.referPost._id}`)
              }}
            >
              <SingleFeed item={item.referPost} />
            </Flex>
          )}
          {/* footer of a post */}
          {user != null && (
            <Flex
              onClick={(e) => e.stopPropagation()}
              position={"absolute"}
              bottom={0}
              left={0}
              alignItems="center"
              justifyContent={"center"}
              width={"100%"}
            >
              <Flex
                onClick={(e) => {
                  e.stopPropagation()
                  if (item.postType == "comment") {
                    router.push(`/post/comment/${item._id}`)
                  } else {
                    router.push(`/post/${item._id}`)
                  }
                }}
                // width={"100%"}
                cursor="pointer"
                px={10}
                py={2}
                gap={4}
                alignItems="center"
                justifyContent="center"
              >
                <AiOutlineComment size={20} />
                {item?.refComment?.length != 0 && (
                  <Text fontSize={14}>
                    {countReaction(
                      props.totalComment || item?.refComment?.length
                    )}
                  </Text>
                )}
              </Flex>
              <Menu>
                <MenuButton
                  variant="fill"
                  bg="transparent"
                  _active={{ bg: "transparent" }}
                  _hover={{ bg: "transparent" }}
                  as={Button}
                >
                  <Flex gap={2}>
                    <RiStackshareLine
                      color={
                        item?.sharedBy?.includes(user._id)
                          ? "rgb(29, 155, 240)"
                          : undefined
                      }
                      size={18}
                    />
                    {item?.sharedBy?.length != 0 && (
                      <Text fontWeight={200} fontSize={14}>
                        {countReaction(
                          item?.sharedBy?.length + item?.quoteBy?.length || 0
                        )}
                      </Text>
                    )}
                  </Flex>
                </MenuButton>{" "}
                <MenuList fontSize={16}>
                  <MenuItem
                    onClick={
                      item?.sharedBy?.includes(user._id)
                        ? unSharehandler
                        : shareHandler
                    }
                    gap={2}
                  >
                    <RiStackshareLine size={16} />
                    <Text>
                      {item?.sharedBy?.includes(user._id) ? "Unshare" : "Share"}
                    </Text>
                  </MenuItem>

                  <MenuItem onClick={quoteHandler} gap={2}>
                    <BsChatQuote size={18} />
                    <Text>Quote Feed</Text>
                  </MenuItem>
                </MenuList>
              </Menu>
              <Flex
                gap={4}
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                px={10}
                py={2}
                onClick={
                  item?.reactedByUser &&
                  item?.reactedByUser?.includes(user && user._id)
                    ? unLikeHandler
                    : likeHandler
                }
              >
                {item?.reactedByUser &&
                item?.reactedByUser?.includes(user && user._id) ? (
                  <BsHeartFill color="rgb(29, 155, 240)" />
                ) : (
                  <BsHeart size={18} />
                )}
                {item?.reactedByUser?.length != 0 && (
                  <Text fontSize={14}>
                    {countReaction(item?.reactedByUser?.length)}
                  </Text>
                )}
              </Flex>

              <Flex
                gap={4}
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                px={10}
                py={2}
                onClick={() => {
                  navigator.clipboard.writeText(
                    item.postType != "comment"
                      ? `${window.location.protocol}//${window.location.host}/post/${item?._id}`
                      : `${window.location.protocol}//${window.location.host}/post/comment/${item?._id}`
                  )

                  toast({
                    status: "success",
                    duration: 5000,
                    title: "Link copied to the clipboard.",
                  })
                }}
              >
                <FiShare size={18} />
              </Flex>
            </Flex>
          )}
        </Flex>
        {/* {user != null && (
          <CommentsOfFeed
            // item={item}
            // setItem={setItem}
            quoteData={props.quoteData}
            setQuoteData={props.setQuoteData}
            isCreateModalOpen=sCreateModalOpen}
            setIsCreateModalOpen={props.setIsCreateModalOpen}
            setHomeData={props.setHomeData}
            comments={item.comments}
            postId={item._id}
          />
        )} */}
      </Flex>
    </>
  )
}

export default FeedCard
