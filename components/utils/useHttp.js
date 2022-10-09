import { useState, useEffect } from "react"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { useToast } from "@chakra-ui/react"
import { useRouter } from "next/router"

const useHttp = ({
  fetchNow = false,
  setFetchNow = null,
  isLocalStorage = false,
  url = null,
  method = "get",
  body = null,

  isAuth = false,
  isSetData = false,
  setData = null,
  isMessage = false,
  dataTarget = null,
  setMessage = null,
  setUserId = null,
  isDispatch = false,
  dispatchFunc = null,
  isToast = false,
  toastMessage = null,
  isEToast = true,
  eToastMessage = null,
  isPush = false,
  pushTo = null,
  isEPush = false,
  removeStore = false,
  epushTo = null,
  outDispatch = false,
  cb = null,
  ecb = null,
  rcb = null,
  isSetDefault = true,
  extraLoad = null,
  dispatchType = null,
  shouldHideMessage = false
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const token = useSelector((state) => state.user.token)
  const dispatch = useDispatch()
  const toast = useToast({ position: "top", isClosable: true })
  const [requestedData, setRequestedData] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (fetchNow) {
      const fetchData = async () => {
        try {
          setIsLoading(true)
          const { data } = await axios[method](
            url,
            method == "get"
              ? {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: isAuth ? `Bearer ${token}` : "",
                    
                  },
                  withCredentials: true,
                  
                }
              : body,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: isAuth ? `Bearer ${token}` : "",
                
              },
              withCredentials: true,
              
            }
          )

          if (shouldHideMessage) {
            setMessage(null)
          } 
          setRequestedData(data)


            if (isSetData && setData !== null && dataTarget == null) {
              setData(data)
            }

          if (isSetData && setData !== null && dataTarget == "follower") {
            setData(data.follower)
          }

          if (isSetData && setData !== null && dataTarget == "following") {
            setData(data.following)
          }

          if (cb != null) {
            cb()
          }

          if (setFetchNow !== null) {
            setFetchNow(false)
          }

          if (isToast) {
            toast({
              status: "success",
              duration: 5000,
              title:
                toastMessage == "data.message"
                  ? data.message
                  : toastMessage == "data"
                  ? data
                  : data,
            })
          }
          if (isMessage && url.indexOf("request-verify-email") == 0) {
            setMessage(null)
            setUserId(null)
          }

          if (isPush && pushTo !== null) {
            router.push(pushTo)
          }

          if (isLocalStorage && !removeStore) {
            localStorage.setItem("user", JSON.stringify(data))
          }

          if (isLocalStorage && removeStore) {
            localStorage.removeItem("user")
          }

          if (
            isDispatch &&
            dispatchFunc !== null &&
            !outDispatch &&
            dispatchType == null
          ) {
            dispatch(dispatchFunc(data))
          }

          if (
            isDispatch &&
            dispatchFunc !== null &&
            !outDispatch &&
            dispatchType == "changeData"
          ) {
            dispatch(dispatchFunc({ ...data }))
            const totalUserData = { user: data, token }
            localStorage.setItem("user", JSON.stringify(totalUserData))
          }

          if (
            isDispatch &&
            dispatchFunc !== null &&
            outDispatch &&
            dispatchType == null
          ) {
            dispatch(dispatchFunc({ user: null, toke: "" }))
          }

          if (isSetDefault) {
            setIsLoading(false)
          }
        } catch (err) {
          console.log(err)
          if (setFetchNow !== null) {
            setFetchNow(false)
          }

          let errorMsg = err.response
            ? err.response.data.message
            : "Something went wrong!!!"

          setIsLoading(false)

          if (ecb != null) {
            ecb()
          }
           

          if (
            errorMsg.indexOf("Your email is not verified") == 0 &&
            isMessage &&
            shouldHideMessage == false
          ) {
                          console.log(shouldHideMessage)

            setUserId(errorMsg.split(".")[1])
            setMessage("Please verify your email to continue...")
            errorMsg = "Please verify your email to continue..."
          }

        

          if (isEToast) {
            toast({
              status: "error",
              duration: 5000,
              title: eToastMessage || errorMsg,
            })
          }
          if (isEPush && epushTo !== null) {
            router.push(epushTo)
          }
        }
      }
      fetchData()
    }

    return () => setFetchNow(false)
  }, [fetchNow, extraLoad != null && extraLoad])

  return { isLoading, requestedData }
}

export default useHttp
