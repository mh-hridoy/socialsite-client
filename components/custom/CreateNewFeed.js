import React, { useState, useRef } from "react"
import {
  Flex,
  Textarea,
  Button,
  FormLabel,
  Input,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  PopoverArrow,
  useToast,
} from "@chakra-ui/react"
import { MdOutlineImage, MdOutlineEmojiEmotions } from "react-icons/md"
import { Picker } from "emoji-mart"
import Resizer from "react-image-file-resizer"
import { AiOutlineDelete } from "react-icons/ai"
import axios from "axios"
import { useSelector } from "react-redux"
// import Select from "react-select"
import SingleFeed from "./SingleFeed"
import Creatable from "react-select/creatable"

const CreateNewFeed = ({
  name,
  setHomeData,
  homeData,
  setIsModalOpen,
  isModalOpen,
  quoteData,
  setQuoteData,
}) => {
  const [showEmoji, setShowEmoji] = useState(false)
  const { colorMode } = useColorMode()
  const [feedText, setFeedText] = useState("")
  const [currentSelection, setCurrentSelection] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState([])
  const toast = useToast({ position: "top", isClosable: true })
  const token = useSelector((state) => state.user.token)
  const user = useSelector((state) => state.user.user)
  const [selectedTag, setSelectedTag] = useState(null)
  const textAreaRef = useRef(null)

  const selectOption = [
    { value: "general", label: "General" },
    { value: "technology", label: "Technology" },
    { value: "development", label: "Development" },
    { value: "programming", label: "Programming" },
    { value: "places", label: "Places" },
    { value: "universe", label: "Universe" },
    { value: "nature", label: "Nature" },
  ]

  const emojiHandler = (emoji) => {
    const emoWithText = [
      feedText.slice(0, currentSelection),
      emoji,
      feedText.slice(currentSelection),
    ].join("")
    setFeedText(emoWithText)
  }

  const textHandler = (e) => {
    setFeedText(e.target.value)
  }

  var autoExpand = function (field) {
    field.style.height = "inherit"
    var computed = window.getComputedStyle(field)

    var height =
      parseInt(computed.getPropertyValue("border-top-width"), 10) +
      parseInt(computed.getPropertyValue("padding-top"), 10) +
      field.scrollHeight +
      parseInt(computed.getPropertyValue("padding-bottom"), 10) +
      parseInt(computed.getPropertyValue("border-bottom-width"), 10) -
      20

    field.style.height = height + "px"
  }

  const areaHandler = (event) => {
    if (event.target.tagName.toLowerCase() !== "textarea") return
    autoExpand(event.target)
  }

  const fileHandler = (e) => {
    const files = [...e.target.files]
    // console.log(files[0])
    if (files[0]?.size > 50000000) {
      return toast({
        status: "error",
        duration: 3000,
        title: "File size cannot be over 50mb",
      })
    }

    if (files[0]?.type.includes("x-matroska")) {
      return toast({
        status: "error",
        duration: 3000,
        title: "You cannot upload mkv files",
      })
    }

    if (files[0]?.type == "" || files[0]?.type.indexOf("image") == 0) {
      // console.log(files[0])
      handleImages(files)
    } else if (files[0]?.type.indexOf("video") == 0) {
      videoHandler(files[0])
    }
  }

  const videoHandler = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        return setImages([
          ...images,
          {
            name:
              file.name.split(".").shift() +
              Date.now() +
              file.name.split(".").pop(),
            type: file.type,
            img: reader.result,
          },
        ])
      }
      // resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleImages = (files) => {
    files.map((file) => {
      Resizer.imageFileResizer(
        file,
        1280,
        720,
        "JPEG",
        90,
        0,
        (uri) => {
          return setImages([
            ...images,
            {
              name:
                file.name.split(".").shift() +
                Date.now() +
                file.name.split(".").pop(),
              type: file.type || "image/jpeg",
              img: uri,
            },
          ])
        },
        "base64"
      )
    })
  }

  const postHandler = async () => {
    setIsLoading(true)
    const tags = []
    if (selectedTag?.length !== 0) {
      selectedTag?.map((item) => tags.push(item.value))
    }

    if (feedText || images.length !== 0) {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_MAIN_PROXY}/new-post`,
          {
            text: feedText || " ",
            images,
            user: user._id,
            tags,
            quoteData: quoteData?._id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        )

        if (setIsModalOpen != undefined) {
          setIsModalOpen(false)
          const oldData = [...homeData]
          const newData = [data, ...oldData]
          setHomeData([...new Set(newData)])
        } else {
          const oldData = [...homeData]
          const newData = [data, ...oldData]
          setHomeData([...new Set(newData)])
        }

        setImages([])
        setFeedText("")
        setQuoteData(null)
        setSelectedTag(null)
        setIsLoading(false)
        toast({
          status: "success",
          duration: 3000,
          title: "Post has been created!",
        })
      } catch (e) {
        setIsLoading(false)

        const errorMsg = e.response && e.response.data.message
        if (errorMsg) {
          toast({
            status: "error",
            duration: 3000,
            title: errorMsg,
          })
        }
      }
    } else {
      setIsLoading(false)
      toast({
        status: "info",
        duration: 3000,
        title: "Status or Image is required.",
      })
    }
  }

  const removeImage = (inx) => {
    const allImages = [...images]
    allImages.splice(inx, 1)
    setImages([...allImages])
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
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: 14,
      opacity: 0.6,
    }),

    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1
      const transition = "opacity 300ms"

      return { ...provided, opacity, transition }
    },
  }

  return (
    <Flex direction="column" gap={5} width="100%">
      <Flex
        borderBottom="1px"
        borderColor={useColorModeValue("gray.200", "#333")}
        position="relative"
        direction="column"
        width="100%"
      >
        <Flex direction="column" marginBottom={images.length == 0 ? 10 : 0}>
          <Textarea
            onInput={areaHandler}
            border="none"
            variant={"unstyled"}
            ref={textAreaRef}
            fontSize={16}
            height="auto"
            value={feedText}
            onChange={textHandler}
            maxH="50vh"
            onSelectCapture={(e) =>
              setCurrentSelection(e.target.selectionStart)
            }
            borderBottom={"1px"}
            borderColor={useColorModeValue("gray.200", "#333")}
            px={5}
            pt={2}
            placeholder="What's happening?"
            width={"100%"}
            resize="none"
          />
          <Creatable
            styles={customStyles}
            input={{ backgroundColor: "rgb(29, 155, 240)" }}
            placeholder="Select tags..."
            onChange={(e) => setSelectedTag(e)}
            value={selectedTag}
            isMulti={true}
            // isSearchable={false}
            options={selectOption}
          />
          {isModalOpen && quoteData && (
            <Flex
              boxShadow={"sm"}
              rounded="lg"
              border="1px"
              borderColor="gray.200"
              m={5}
              wrap={"wrap"}
              maxHeight={300}
              overflow="auto"
              bg={useColorModeValue("gray.200", "#333")}
            >
              <SingleFeed
                showLink={
                  quoteData?.linkData != undefined &&
                  quoteData?.linkData.image?.img
                }
                linkData={quoteData?.linkData}
                item={quoteData}
              />
            </Flex>
          )}
        </Flex>
        {/* show images */}
        {images.length !== 0 && (
          <Flex
            marginTop={4}
            height={"70px"}
            width={"100%"}
            wrap={"wrap"}
            gap={5}
            marginBottom={12}
            overflow="auto"
            pl={5}
          >
            {images.map((image, inx) => {
              return (
                <div
                  key={inx}
                  style={{
                    height: "100%",
                    width: "100px",
                    position: "relative",
                  }}
                >
                  {image.type.includes("image") ? (
                    <img
                      alt={image.name}
                      src={image.img}
                      style={{
                        height: "100%",
                        width: "100%",
                        border: "1px solid gray",
                      }}
                    />
                  ) : null}

                  {image.type.includes("video") ? (
                    <video
                      style={{
                        height: "100%",
                        width: "100%",
                        border: "1px solid gray",
                      }}
                      src={image.img}
                      controls={false}
                      autoPlay={false}
                    ></video>
                  ) : null}

                  <div
                    onClick={() => removeImage(inx)}
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      padding: "2px",
                      top: 0,
                      right: -10,
                    }}
                  >
                    <AiOutlineDelete color="rgb(29, 155, 240)" size={18} />
                  </div>
                </div>
              )
            })}
            {/* images with delete icon */}
          </Flex>
        )}

        <Flex
          position="absolute"
          bottom={0}
          leftf={0}
          alignItems="center"
          justifyContent={"space-between"}
          width={"100%"}
          height={10}
          gap={5}
          px={5}
        >
          <Flex gap={5} position="relative">
            <FormLabel htmlFor={name}>
              {" "}
              <MdOutlineImage cursor={"pointer"} size={23} />
            </FormLabel>
            <Input
              id={name}
              onChange={fileHandler}
              accept="image/*, video/*, .mkv"
              hidden
              type="file"
            />
            {/* x-matroska */}

            <Popover _focus={{ boxShadow: "none" }}>
              <PopoverTrigger>
                <MdOutlineEmojiEmotions
                  onClick={() => setShowEmoji(!showEmoji)}
                  cursor={"pointer"}
                  size={23}
                />
              </PopoverTrigger>
              <PopoverContent mt={10} _focus={{ boxShadow: "none" }}>
                <PopoverArrow />
                <Picker
                  onSelect={(e) => emojiHandler(e.native)}
                  native={true}
                  showPreview={false}
                  showSkinTones={false}
                  theme={colorMode == "light" ? "light" : "dark"}
                />
              </PopoverContent>
            </Popover>
          </Flex>

          <Button
            isLoading={isLoading}
            onClick={postHandler}
            size={"sm"}
            fontSize={16}
            bg="buttonColor"
          >
            Post
          </Button>
        </Flex>
      </Flex>
      {/* //quote data */}

      {/* quote data ends here */}
    </Flex>
  )
}

export default CreateNewFeed
