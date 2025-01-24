import { configureStore } from "@reduxjs/toolkit";
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from "react-redux";
import { rootReducer } from "./rootReducer";

const store = configureStore({
  reducer: rootReducer,
});

// Extract the dispatch function directly from the store
const { dispatch } = store;

// No need to redefine useSelector and useDispatch
// You can directly export the React-Redux provided hooks
export { store, dispatch, useAppDispatch as useDispatch, useAppSelector as useSelector };
