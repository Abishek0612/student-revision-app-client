import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import pdfReducer from "../features/pdfs/pdfSlice";
import quizReducer from "../features/quiz/quizSlice";
import chatReducer from "../features/chat/chatSlice";
import youtubeReducer from "../features/youtube/youtubeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pdfs: pdfReducer,
    quiz: quizReducer,
    chat: chatReducer,
    youtube: youtubeReducer,
  },
});
