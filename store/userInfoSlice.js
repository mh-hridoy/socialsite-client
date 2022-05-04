import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: null,
  token: "",
  
}

export const userInfoSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      }
    },
    changeData : (state, action) => {
      return{
        token: state.token,
        user: {...state.user, ...action.payload}
      }
    },
    logout: (state, action) => {
      return { user: action.payload.user, token: action.payload.token }
    },
 
    
  },
})

// Action creators are generated for each case reducer function
export const { login, logout, changeData } = userInfoSlice.actions

export default userInfoSlice.reducer
