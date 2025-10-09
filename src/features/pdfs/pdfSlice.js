import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001"
}/api/pdfs/`;

const initialState = {
  pdfs: [],
  isLoading: false,
  isError: false,
  message: "",
};

export const uploadPdf = createAsyncThunk(
  "pdfs/upload",
  async (pdfData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const formData = new FormData();
      formData.append("pdf", pdfData.file);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(API_URL, formData, config);
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

export const getPdfs = createAsyncThunk("pdfs/getAll", async (_, thunkAPI) => {
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

export const deletePdf = createAsyncThunk(
  "pdfs/delete",
  async (pdfId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(API_URL + pdfId, config);
      return pdfId;
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

export const retryPdf = createAsyncThunk(
  "pdfs/retry",
  async (pdfId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(API_URL + `${pdfId}/retry`, {}, config);
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

export const seedNCERT = createAsyncThunk(
  "pdfs/seedNCERT",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(API_URL + "seed-ncert", {}, config);
      return response.data.pdfs;
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

export const pdfSlice = createSlice({
  name: "pdf",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadPdf.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadPdf.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pdfs.unshift(action.payload);
      })
      .addCase(uploadPdf.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPdfs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPdfs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pdfs = action.payload;
      })
      .addCase(getPdfs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deletePdf.fulfilled, (state, action) => {
        state.pdfs = state.pdfs.filter((pdf) => pdf._id !== action.payload);
      })
      .addCase(retryPdf.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(retryPdf.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.pdfs.findIndex(
          (pdf) => pdf._id === action.payload._id
        );
        if (index !== -1) {
          state.pdfs[index] = action.payload;
        }
      })
      .addCase(retryPdf.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(seedNCERT.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(seedNCERT.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.pdfs = [...action.payload, ...state.pdfs];
        }
      })
      .addCase(seedNCERT.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = pdfSlice.actions;
export default pdfSlice.reducer;
