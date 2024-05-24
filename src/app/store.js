import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/User/userSlice";
import loaderReducer from "../features/Loader/loaderSlice";
export default configureStore({
  reducer: {
    user: userReducer,
    loader: loaderReducer,
  },
});
