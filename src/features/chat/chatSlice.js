import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001"
}/api/chats/`;

const initialState = {
  chats: [],
  currentChat: null,
  isLoading: false,
  isError: false,
  message: "",
};

export const getChats = createAsyncThunk("chat/getAll", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const createChat = createAsyncThunk(
  "chat/create",
  async (chatData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(API_URL, chatData, config);
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

export const getChatById = createAsyncThunk(
  "chat/getById",
  async (chatId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(API_URL + chatId, config);
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

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (messageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(
        API_URL + "message",
        messageData,
        config
      );
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

export const deleteChat = createAsyncThunk(
  "chat/delete",
  async (chatId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(API_URL + chatId, config);
      return chatId;
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

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = "";
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload;
      })
      .addCase(getChats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.unshift(action.payload);
        state.currentChat = action.payload;
      })
      .addCase(getChatById.fulfilled, (state, action) => {
        state.currentChat = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentChat = action.payload;
        const index = state.chats.findIndex(
          (chat) => chat._id === action.payload._id
        );
        if (index !== -1) {
          state.chats[index] = action.payload;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter((chat) => chat._id !== action.payload);
        if (state.currentChat && state.currentChat._id === action.payload) {
          state.currentChat = null;
        }
      });
  },
});

export const { reset, setCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;
