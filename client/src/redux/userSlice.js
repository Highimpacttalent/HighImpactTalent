import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("userInfo")) ?? {},
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      localStorage.setItem("userInfo", JSON.stringify(state.user)); // Save to localStorage
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("userInfo");
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload.user }; // Merge existing user data with the new data
      localStorage.setItem("userInfo", JSON.stringify(state.user)); // Save to localStorage
    },
  },
});

export default userSlice.reducer;

export function Login(user) {
  return (dispatch) => {
    dispatch(userSlice.actions.login({ user }));
  };
}

export function Logout() {
  return (dispatch) => {
    dispatch(userSlice.actions.logout());
  };
}

export function UpdateUser(user) {
  return (dispatch) => {
    dispatch(userSlice.actions.updateUser({ user }));
  };
}
