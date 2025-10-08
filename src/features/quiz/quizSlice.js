import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001"
}/api/quiz/`;

const initialState = {
  questions: [],
  progress: [],
  isLoading: false,
  isError: false,
  message: "",
};

export const generateQuiz = createAsyncThunk(
  "quiz/generate",
  async (quizData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(API_URL + "generate", quizData, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getProgress = createAsyncThunk(
  "quiz/progress",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(API_URL + "progress", config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    reset: (state) => {
      state.questions = [];
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuiz.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload;
      })
      .addCase(generateQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getProgress.fulfilled, (state, action) => {
        state.progress = action.payload;
      });
  },
});

export const { reset } = quizSlice.actions;
export default quizSlice.reducer;
