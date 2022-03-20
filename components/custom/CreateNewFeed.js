import React, {useState, useRef} from "react"
import {
  Flex,
  Textarea,
  Button,
  Text,
  FormLabel,
  Input,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react"
import { MdOutlineImage, MdOutlineEmojiEmotions } from "react-icons/md"
import FeedCard from "./FeedCard"
import { Picker } from "emoji-mart"

const CreateNewFeed = () => {
const [showEmoji, setShowEmoji] = useState(false)
  const { colorMode } = useColorMode()
  const [feedText, setFeedText] = useState("")
  const [currentSelection, setCurrentSelection] = useState(0)
  const feedTextRef = useRef(null)

  const emojiHandler = (emoji)=> {
    const emoWithText = [
      feedText.slice(0, currentSelection),
      emoji,
      feedText.slice(currentSelection),
    ].join("")
    setFeedText(emoWithText)

  }

  const textHandler = (e)=> {
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
      40

    field.style.height = height + "px"
  }

  const areaHandler = (event) => {
    if (event.target.tagName.toLowerCase() !== "textarea") return
    autoExpand(event.target)
  }

  const fileHandler = (e) => {
    console.log(e.target.files)
  }

  return (
    <Flex direction="column" gap={5} width="100%">
      <Flex
        border="1px"
        borderColor={"gray.200"}
        position="relative"
        direction="column"
        width="100%"
      >
        <Flex>
          <Textarea
            onInput={areaHandler}
            variant={"unstyled"}
            ref={feedTextRef}
            height="auto"
            value={feedText}
            onChange={textHandler}
            maxH="50vh"
            onSelectCapture={(e) =>
              setCurrentSelection(e.target.selectionStart)
            }
            borderBottom={"1px"}
            borderColor={"gray.100"}
            px={5}
            pt={2}
            marginBottom={10}
            placeholder="What's happening?"
            width={"100%"}
            resize="none"
          />
        </Flex>
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
            <FormLabel htmlFor="file">
              {" "}
              <MdOutlineImage cursor={"pointer"} size={23} />
            </FormLabel>
            <Input
              id="file"
              onChange={fileHandler}
              multiple
              accept="jpeg/jpg/image/*"
              hidden
              type="file"
            />
           

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

          <Button size={"sm"} fontSize={16} bg="buttonColor">
            Post
          </Button>
        </Flex>
      </Flex>

      <Text fontWeight={600} mb={2}>
        Recent posts:
      </Text>
      <FeedCard />
      <FeedCard />
      <FeedCard />
      <FeedCard />
      <FeedCard />
    </Flex>
  )
}

export default CreateNewFeed
