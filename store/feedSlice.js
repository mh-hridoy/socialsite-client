import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  rssFeed: null,
}

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
      storeFeed: (state, action) => {
      return { rssFeed: action.payload.data }
    },
  },
})

// Action creators are generated for each case reducer function
export const { storeFeed } = feedSlice.actions

export default feedSlice.reducer
