import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  homeData: [],
}

export const homeDataSlice = createSlice({
  name: "homeData",
  initialState,
  reducers: {
    setAllHomeData: (state, action) => {
      const newArray = [...state.homeData, ...action.payload]

      var result = newArray.filter(function (e) {
        var key = Object.keys(e)
          .map((k) => e[k])
          .join("|")
        if (!this[key]) {
          this[key] = true
          return true
        }
      }, {})


      return { homeData: [...result] }
    },
    setNewPost : (state, action) => {
          const newData = [action.payload, ...state.homeData]

      var result = newData.filter(function (e) {
        var key = Object.keys(e)
          .map((k) => e[k])
          .join("|")
        if (!this[key]) {
          this[key] = true
          return true
        }
      }, {})

      return { homeData: [...result] }

    },
    setDeletePost : (state, action) => {
      const delPost = action.payload
      const allPost = [...state.homeData]
      const indexOfPost = allPost.findIndex((itm) => itm?._id == delPost?._id)
      allPost.splice(indexOfPost, 1)

      return { homeData: [...allPost] }

    },
    setHomeData: (state, action) => {
      const newData = action.payload
      const oldData = [...state.homeData]

      const indexOfNewNoti = oldData.findIndex(
        (item) => item._id == newData._id
      )
      if (indexOfNewNoti != -1) {
        oldData[indexOfNewNoti] = newData
      } else {
        oldData.unshift(newData)
      }

      const result = oldData.filter(function (e) {
        const key = Object.keys(e)
          .map((k) => e[k])
          .join("|")
        if (!this[key]) {
          this[key] = true
          return true
        }
      }, {})

      return {
        homeData: [...new Set(result)],
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { setHomeData, setAllHomeData, setNewPost,setDeletePost } = homeDataSlice.actions

export default homeDataSlice.reducer
