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
import { AiOutlineComment } from "react-icons/ai"
import Masonry from "react-masonry-css"
import dateFormat from "dateformat"
import GalleryModal from "./GalleryModal"
import { useRouter } from "next/router"
import axios from "axios"
import { useSelector } from "react-redux"

const FeedCard = (props) => {
  const [currentImageArray, setCurrentImageArray] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(0)
  const token = useSelector((state) => state.user.token)
  const user = useSelector((state) => state.user.user)
  const router = useRouter()
  const toast = useToast({ position: "top", isClosable: true })
  const [item, setItem] = useState(props.item)
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
    const newItem = {...item}
    newItem.totalReact = newItem.totalReact + 1
    newItem.reactedByUser.push(user._id)

    setItem(newItem)
    
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
      console.log(errorMsg)
      // toast({
      //   status: "error",
      //   duration: 5000,
      //   title: "Something went wrong!!!",
      // })
    }
  }

  const unLikeHandler = async () => {
    const newItem = { ...item }
    newItem.totalReact = newItem.totalReact - 1
    const indexOfUser = newItem.reactedByUser.indexOf((item) => item == user._id )
    newItem.reactedByUser.splice(indexOfUser, 1)

    setItem(newItem)
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
      console.log(errorMsg)
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
      <Flex direction={"column"} gap={4}>
        <Flex
          direction={"column"}
          position={"relative"}
          p={4}
          border="1px"
          borderColor={"gray.300"}
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
                  : `/account/${item.user._id}`
              )
            }
          >
            <Avatar
              _hover={{ border: "2px solid #ff552f" }}
              cursor="pointer"
              size={"sm"}
              name={item.user.fullName}
              // src="https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80"
            ></Avatar>
            <Flex direction="column">
              <Text color="buttonColor" fontWeight={600} fontSize={15}>
                {item.user.fullName}
              </Text>
              <Text fontSize={12} opacity={"0.7"}>
                {dateFormat(item.createdAt, "dddd, mmmm dS, yyyy, h:MM TT")}
              </Text>
            </Flex>
          </Flex>

          <Text py={3} pl={10} pr={4} fontSize={13}>
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
                    style={{ cursor: "pointer" }}
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
                        style={{ cursor: "pointer", margin: 2 }}
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
            width={"100%"}
            borderTop="1px"
            borderColor={"gray.300"}
          >
            <Flex
              width={"100%"}
              borderRight="1px"
              gap={4}
              borderColor={"gray.300"}
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              px={4}
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
                <BsHeartFill color="#ff552f" />
              ) : (
                <BsHeart size={18} />
              )}
              <Text fontSize={14}>
                {(item.reactedByUser && item.reactedByUser.length) || 0}
              </Text>
            </Flex>
            <Flex
              width={"100%"}
              cursor="pointer"
              px={4}
              py={2}
              gap={4}
              alignItems="center"
              justifyContent="center"
            >
              <AiOutlineComment size={20} />
              <Text fontSize={14}>100</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default FeedCard
