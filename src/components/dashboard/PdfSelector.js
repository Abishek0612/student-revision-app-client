import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getPdfs,
  uploadPdf,
  deletePdf,
  seedNCERT,
  retryPdf,
  reset,
} from "../../features/pdfs/pdfSlice";
import {
  FiUpload,
  FiTrash2,
  FiDownload,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import Spinner from "../common/Spinner";
import { usePdfPolling } from "../../hooks/usePdfPolling";

function PdfSelector({ onPdfSelect }) {
  const dispatch = useDispatch();
  const { pdfs, isLoading, isError, message } = useSelector(
    (state) => state.pdfs
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPdfId, setSelectedPdfId] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  usePdfPolling(pdfs, 3000);

  useEffect(() => {
    if (isError) {
      console.error("PDF Error:", message);
    }
    dispatch(getPdfs());
    return () => dispatch(reset());
  }, [dispatch, isError, message]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setUploadingFile(true);
      try {
        await dispatch(
          uploadPdf({
            file: selectedFile,
          })
        ).unwrap();

        setSelectedFile(null);
        document.getElementById("fileInput").value = "";

        setTimeout(() => {
          dispatch(getPdfs());
        }, 1000);
      } catch (error) {
        alert(`Upload failed: ${error.message || "Please try again"}`);
      } finally {
        setUploadingFile(false);
      }
    }
  };

  const handleDelete = (pdfId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this PDF?")) {
      dispatch(deletePdf(pdfId));
      if (selectedPdfId === pdfId) {
        setSelectedPdfId(null);
        onPdfSelect(null);
      }
    }
  };

  const handleRetry = async (pdfId, e) => {
    e.stopPropagation();
    if (window.confirm("Retry processing this PDF?")) {
      try {
        await dispatch(retryPdf(pdfId)).unwrap();
        setTimeout(() => {
          dispatch(getPdfs());
        }, 1000);
      } catch (error) {
        alert(`Retry failed: ${error.message || "Please try again"}`);
      }
    }
  };

  const handleSeedNCERT = () => {
    dispatch(seedNCERT());
  };

  const handlePdfClick = (pdf) => {
    if (pdf.status === "ready") {
      setSelectedPdfId(pdf._id);
      onPdfSelect(pdf);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ready":
        return <FiCheckCircle className="text-green-600" size={16} />;
      case "processing":
        return <FiClock className="text-yellow-600 animate-pulse" size={16} />;
      case "error":
        return <FiAlertCircle className="text-red-600" size={16} />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "ready":
        return "Ready";
      case "processing":
        return "Processing...";
      case "error":
        return "Error";
      default:
        return status;
    }
  };

  if (isLoading && !uploadingFile && pdfs.length === 0) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">My Coursebooks</h2>
        <button
          onClick={handleSeedNCERT}
          className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors flex items-center gap-1"
          title="Load NCERT Physics PDFs"
          disabled={uploadingFile}
        >
          <FiDownload /> NCERT
        </button>
      </div>

      <div className="mb-6">
        <label
          htmlFor="fileInput"
          className={`flex items-center justify-center w-full px-4 py-2 bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg transition-colors ${
            uploadingFile
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-blue-100"
          }`}
        >
          <FiUpload className="mr-2 text-blue-500" />
          <span className="text-sm text-blue-600 font-medium">
            {selectedFile ? selectedFile.name : "Choose File"}
          </span>
          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploadingFile}
          />
        </label>
        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={uploadingFile}
            className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploadingFile ? (
              <>
                <FiRefreshCw className="animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload PDF"
            )}
          </button>
        )}
      </div>

      {/* Processing Notice */}
      {pdfs.some((pdf) => pdf.status === "processing") && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 flex items-center gap-2">
            <FiClock className="animate-pulse" />
            PDFs are being processed. This may take 2-5 minutes. Status updates
            automatically.
          </p>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {pdfs.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No PDFs uploaded yet. Upload or load NCERT PDFs to get started.
          </p>
        ) : (
          pdfs.map((pdf) => (
            <div
              key={pdf._id}
              onClick={() => handlePdfClick(pdf)}
              className={`group relative p-3 rounded-lg transition-all ${
                pdf.status === "ready"
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-75"
              } ${
                selectedPdfId === pdf._id
                  ? "bg-blue-50 border-2 border-blue-500"
                  : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {pdf.fileName}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        pdf.status === "ready"
                          ? "bg-green-100 text-green-800"
                          : pdf.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {getStatusIcon(pdf.status)}
                      {getStatusText(pdf.status)}
                    </span>
                    {pdf.totalPages > 0 && (
                      <span className="text-xs text-gray-500">
                        {pdf.totalPages} pages
                      </span>
                    )}
                  </div>
                  {pdf.status === "error" && pdf.errorMessage && (
                    <p className="text-xs text-red-600 mt-1">
                      {pdf.errorMessage}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2">
                  {pdf.status === "error" && (
                    <button
                      onClick={(e) => handleRetry(pdf._id, e)}
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                      title="Retry processing"
                    >
                      <FiRefreshCw size={16} />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(pdf._id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-opacity"
                    title="Delete PDF"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PdfSelector;
