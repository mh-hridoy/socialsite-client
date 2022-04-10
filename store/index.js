import { configureStore } from "@reduxjs/toolkit"
import userInfoSlice from "./userInfoSlice"
import feedSlice from "./feedSlice"
import { Provider } from "react-redux"
import {  useEffect } from "react"
import { login, logout } from "./userInfoSlice"
import {useRouter} from "next/router"
import axios from "axios"
const store = configureStore({
  reducer: {
    user: userInfoSlice,
    feed: feedSlice,
  },
})

const StoreProvider = (props) => {
  const router = useRouter()
  useEffect(() => {
    const userData = localStorage.getItem("user")

    if (userData) {
      store.dispatch(login(JSON.parse(userData)))
    }
  }, [])

  //declare the axios instance method to chcek if the token is valid unless force the client to logout.
  axios.interceptors.response.use((response) => {
    return response
  }, function (error) {
    const res = error.response;
    // console.log(error)
    // Your account is disabled
    if (
      res.status === 401 ||
      res.data.message.indexOf("invalid token") == 0 ||
      res.data.message.indexOf("Your account is disabled. please contatct support") == 0 ||
      res.data.message.indexOf("jwt expired") == 0 &&
        res.config &&
        !res.config.__isRetryRequest
    ) {
      return new Promise((response, reject) => {
        axios(`${process.env.NEXT_PUBLIC_MAIN_PROXY}/logout`)
          .then((data) => {
            // console.log("logout")
            store.dispatch(logout({ user: null, token: "" }))
            localStorage.removeItem("user")
            
            router.push("/login")
          })
          .catch((err) => {
            console.log(err)
            reject(error)
          })
      })
    }
    return Promise.reject(error);
  });

  return <Provider store={store}>{props.children}</Provider>
}

export default StoreProvider
