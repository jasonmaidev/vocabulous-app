import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  mode: "light",
  user: null,
  token: null,
  openLabelsDrawer: false,
  viewVocab: false,
  viewUsage: false,
  viewByLabel: "noun",
  viewBySearchTerm: "",
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light"
    },
    setLogin: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    setLogout: (state) => {
      state.user = null
      state.token = null
    },
    setOpenLabelsDrawer: (state, action) => {
      state.openLabelsDrawer = action.payload.openLabelsDrawer
    },
    setViewVocab: (state, action) => {
      state.viewVocab = action.payload.viewVocab
    },
    setViewUsage: (state, action) => {
      state.viewUsage = action.payload.viewUsage
    },
    setViewByLabel: (state, action) => {
      state.viewByLabel = action.payload.viewByLabel
    },
    setViewBySearchTerm: (state, action) => {
      state.viewBySearchTerm = action.payload.viewBySearchTerm
    },
  }
})

export const {
  setMode,
  setLogin,
  setLogout,
  setOpenLabelsDrawer,
  setViewVocab,
  setViewUsage,
  setViewByLabel,
  setViewBySearchTerm,
} = appSlice.actions
export default appSlice.reducer