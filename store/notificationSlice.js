import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  notifications: [],
  unread : 0
 
}

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    storeData: (state, action) => {
      const allData = [...action.payload]
      const unreadData = allData.filter((item) => item.read == false)

      return { notifications: action.payload, unread: unreadData.length}
          
    },
    manageData: (state, action) => {
      const newData = action.payload
      const oldData = [...state.notifications]

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

        const unReadData = result.filter((item) => item.read == false)

        return {
          notifications: [...new Set(result)],
          unread: unReadData.length
        }

    }
  },
})

// Action creators are generated for each case reducer function
export const { storeData, manageData } = notificationSlice.actions

export default notificationSlice.reducer
