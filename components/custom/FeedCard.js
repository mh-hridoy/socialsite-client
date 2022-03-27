import React, { useState, useEffect } from "react"
import {
  Flex,
  Avatar,
  Text,
  TagLabel,
  Tag,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react"
import { BsHeart, BsHeartFill } from "react-icons/bs"
import {IoIosArrowDown} from 'react-icons/io'
import { AiOutlineComment } from "react-icons/ai"
import Masonry from "react-masonry-css"
import GalleryModal from "./GalleryModal"
import { useRouter } from "next/router"
import axios from "axios"
import { useSelector } from "react-redux"
import CommentsOfFeed from "./CommentsOfFeed"
import { MdVerified } from "react-icons/md"
import _ from "underscore"
import timeAgo from '../utils/DateConverter'

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
  

  const breakpointColumnsObj = {
    default: 2,
    700: 1,
  }

  useEffect(() => {
      setItem(props.item)

  }, [props.item])

  const galleryHandler = (inx) => {
    setIsModalOpen(!isModalOpen)
    setSelectedItem(inx)
    setCurrentImageArray([...item.images])
  }

  const likeHandler = async () => {

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

  const unLikeHandler = async () => {
    const modItem = _.clone(item)
    modItem.totalReact = modItem.totalReact - 1

    const reactedByUser = [...modItem.reactedByUser]
    const indexOfUser = reactedByUser.indexOf(
      (item) => item == user._id
    )
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
        ref={props.lastFeedRef ? props.lastFeedRef : null}
        direction={"column"}
        gap={4}
        // borderTop="1px"
        borderBottom="1px"
        borderColor={useColorModeValue("gray.200", "#333")}
      >
        <Flex
          direction={"column"}
          position={"relative"}
          p={4}
          // border="1px"
          // borderColor={"gray.300"}
          width={"100%"}
          rounded="md"
        >
          <Flex
            gap={2}
            cursor="pointer"
            onClick={() =>
              router.push(
                item.user == user._id
                  ? `/account/myaccount/${item.user._id}`
                  : `/account/${item && item.user._id}`
              )
            }
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
              // src="https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80"
            ></Avatar>
            <Flex alignItems="center" gap={4} >
              <Text
                display={"flex"}
                alignItems="center"
                gap={2}
                fontWeight={600}
                fontSize={16}
              >
                {item.user ? item.user.fullName : "Not A User"}{" "}
                {item.user && item.user.isVerified == true && (
                  <MdVerified color="rgb(29, 155, 240)" />
                )}
              </Text>

              <Text fontSize={12} fontWeight={500} opacity={"0.7"}>
                {timeAgo(item.createdAt)}
              </Text>
            </Flex>
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
                  <img
                    onClick={() => {
                      setCurrentImageArray([...item.images])
                      setIsModalOpen(!isModalOpen)
                    }}
                    style={{ cursor: "pointer", borderRadius: "20px" }}
                    alt={item.images[0].name}
                    src={item.images[0].img}
                  />
                ) : (
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                  >
                    {item.images.map((item, inx) => (
                      <img
                        onClick={() => galleryHandler(inx)}
                        style={{
                          cursor: "pointer",
                          margin: 2,
                          borderRadius: "20px",
                        }}
                        key={inx}
                        alt={item.name}
                        src={item.img}
                      />
                    ))}
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
            // border="1px"
            // borderColor={"gray.300"}
          >
            <Flex
              // width={"100%"}
              // borderRight="1px"
              gap={4}
              // borderColor={"gray.300"}
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
              onClick={() => setShowComment(!showComment)}
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
            comments={item.comments}
            postId={item._id}
          />
        )}
      </Flex>
    </>
  )
}

export default FeedCard

