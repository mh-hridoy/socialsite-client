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
} from "@chakra-ui/react"
import { BsHeart, BsHeartFill } from "react-icons/bs"
import { IoIosArrowDown } from "react-icons/io"
import { AiOutlineComment } from "react-icons/ai"
import Masonry from "react-masonry-css"
import GalleryModal from "./GalleryModal"
import { useRouter } from "next/router"
import axios from "axios"
import { useSelector } from "react-redux"
import CommentsOfFeed from "./CommentsOfFeed"
import { MdVerified } from "react-icons/md"
import _ from "underscore"
import timeAgo from "../utils/DateConverter"
import { BsThreeDotsVertical } from "react-icons/bs"

const FeedCard = (props) => {
  const [currentImageArray, setCurrentImageArray] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(0)
  const token = useSelector((state) => state.user.token)
  const user = useSelector((state) => state.user.user)
  const router = useRouter()
  const toast = useToast({ position: "top", isClosable: true })
  const [item, setItem] = useState(props.item)
  const [showComment, setShowComment] = useState(false)
  const videoRef = useRef(null)
  const breakpointColumnsObj = {
    default: 2,
    700: 1,
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

  const likeHandler = async (e) => {
    e.stopPropagation()
    const modItem = _.clone(item)
    modItem.totalReact = modItem.totalReact + 1

    const reactedByUser = [...modItem.reactedByUser]

    reactedByUser.push(user._id)
    modItem.reactedByUser = [...new Set(reactedByUser)]

    setItem(modItem)

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/post-like`,
        { userId: user._id, postId: item._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
    } catch (e) {
      const errorMsg = e.response && e.response.data.message
      // console.log(errorMsg)
      // toast({
      //   status: "error",
      //   duration: 5000,
      //   title: "Something went wrong!!!",
      // })
    }
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

    // const newItem = { ...item }
    // newItem.totalReact = newItem.totalReact - 1
    // const indexOfUser = newItem.reactedByUser.indexOf((item) => item == user._id )
    // newItem.reactedByUser.splice(indexOfUser, 1)

    // setItem(newItem)
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_MAIN_PROXY}/post-unlike`,
        { userId: user._id, postId: item._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
    } catch (e) {
      const errorMsg = e.response && e.response.data.message
      // console.log(errorMsg)
      // toast({
      //   status: "error",
      //   duration: 5000,
      //   title: "Something went wrong!!!",
      // })
    }
  }

  return (
    <>
      <GalleryModal
        isModalOpen={isModalOpen}
        setCurrentImageArray={setCurrentImageArray}
        setIsModalOpen={setIsModalOpen}
        currentImageArray={currentImageArray}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />
      <Flex
        width={"100%"}
        cursor={"pointer"}
        onClick={() => router.push(`/post/${item._id}`)}
        ref={props.lastFeedRef ? props.lastFeedRef : null}
        direction={"column"}
        gap={4}
        // borderTop="1px"
        borderBottom="1px"
        borderColor={useColorModeValue("gray.200", "#333")}
        position="relative"
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
                    ? `/account/myaccount/${item.user._id}`
                    : `/account/${item && item.user._id}`
                )
              }}
            >
              <Avatar
                _hover={{ border: "2px solid rgb(29, 155, 240)" }}
                cursor="pointer"
                size={"sm"}
                name={
                  item.user && item.user.fullName
                    ? item.user.fullName
                    : "Not A User"
                }
                src={item.user?.profilePicture?.img}
              ></Avatar>
              <Flex alignItems="center" gap={4}>
                <Text
                  display={"flex"}
                  alignItems="center"
                  // gap={2}
                  fontWeight={600}
                  fontSize={16}
                >
                  {item.user ? item.user.fullName : "Not A User"}{" "}
                  {item.user && item.user.isVerified == true && (
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
              {timeAgo(item.createdAt)}
            </Text>

            {/* problem start */}
            <div
              style={{ flex: 1 }}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Flex alignItems="center" justifyContent="flex-end"  >
                <Menu>
                  <MenuButton
                    variant="fill"
                    bg="transparent"
                    _active={{ bg: "transparent" }}
                    _hover={{ bg: "transparent" }}
                    as={Button}
                  >
                    <BsThreeDotsVertical />
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.protocol}//${window.location.host}/post/${item._id}`
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

                    
                  </MenuList>
                </Menu>
              </Flex>
            </div>

            {/* problem end */}
          </Flex>

          <Text pl={10} pr={4} fontSize={15}>
            {item.text}
          </Text>

          {item.tags && (
            <Flex marginLeft={10} gap={5}>
              {item.tags.map((item, inx) => {
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

          <Flex
            py={3}
            pl={10}
            alignItems="center"
            justifyContent="center"
            pr={4}
            marginBottom={10}
          >
            {item.images && item.images.length !== 0 && (
              <>
                {item.images.length == 1 ? (
                  item.images[0].type.includes("image") ? (
                    <img
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageArray([...item.images])
                        setIsModalOpen(!isModalOpen)
                      }}
                      style={{ cursor: "pointer", borderRadius: "20px" }}
                      alt={item.images[0].name}
                      src={item.images[0].img}
                    />
                  ) : (
                    item.images[0].type.includes("video") && (
                      <video
                        ref={videoRef}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          cursor: "pointer",
                          borderRadius: "20px",
                          height: "300px",
                          widht: "100%",
                        }}
                        src={item.images[0].img}
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
                    {item.images.map((image, inx) =>
                      image.type.includes("image") ? (
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
                        image.type.includes("video") && (
                          <video
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              cursor: "pointer",
                              borderRadius: "20px",

                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                            src={image.img}
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
            )}
          </Flex>

          {/* footer of a post */}
          <Flex
            position={"absolute"}
            bottom={0}
            left={0}
            alignItems="center"
            justifyContent={"center"}
            width={"100%"}
          >
            <Flex
              gap={4}
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              px={10}
              py={2}
              onClick={
                item.reactedByUser &&
                item.reactedByUser.includes(user && user._id)
                  ? unLikeHandler
                  : likeHandler
              }
            >
              {item.reactedByUser &&
              item.reactedByUser.includes(user && user._id) ? (
                <BsHeartFill color="rgb(29, 155, 240)" />
              ) : (
                <BsHeart size={18} />
              )}
              <Text fontSize={14}>
                {(item.reactedByUser && item.reactedByUser.length) || 0}
              </Text>
            </Flex>
            <Flex
              onClick={(e) => {
                e.stopPropagation()
                setShowComment(!showComment)
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
              <Text fontSize={14}>
                {(item.comments && item.comments.length) || 0}
              </Text>
              <IoIosArrowDown />
            </Flex>
          </Flex>
        </Flex>
        {showComment && (
          <CommentsOfFeed
            // item={item}
            // setItem={setItem}
            setHomeData={props.setHomeData}
            comments={item.comments}
            postId={item._id}
          />
        )}
      </Flex>
    </>
  )
}

export default FeedCard
