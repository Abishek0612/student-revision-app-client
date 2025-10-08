import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getPdfs,
  uploadPdf,
  deletePdf,
  seedNCERT,
  reset,
} from "../../features/pdfs/pdfSlice";
import { FiUpload, FiTrash2, FiDownload } from "react-icons/fi";
import Spinner from "../common/Spinner";

function PdfSelector({ onPdfSelect }) {
  const dispatch = useDispatch();
  const { pdfs, isLoading, isError, message } = useSelector(
    (state) => state.pdfs
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPdfId, setSelectedPdfId] = useState(null);

  useEffect(() => {
    if (isError) {
      console.error(message);
    }
    dispatch(getPdfs());
    return () => dispatch(reset());
  }, [dispatch, isError, message]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      dispatch(uploadPdf(formData));
      setSelectedFile(null);
      document.getElementById("fileInput").value = "";
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

  const handleSeedNCERT = () => {
    dispatch(seedNCERT());
  };

  const handlePdfClick = (pdf) => {
    setSelectedPdfId(pdf._id);
    onPdfSelect(pdf);
  };

  if (isLoading) {
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
        >
          <FiDownload /> NCERT
        </button>
      </div>

      <div className="mb-6">
        <label
          htmlFor="fileInput"
          className="flex items-center justify-center w-full px-4 py-2 bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
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
          />
        </label>
        {selectedFile && (
          <button
            onClick={handleUpload}
            className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Upload PDF
          </button>
        )}
      </div>

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
              className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
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
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        pdf.status === "ready"
                          ? "bg-green-100 text-green-800"
                          : pdf.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {pdf.status}
                    </span>
                    {pdf.totalPages > 0 && (
                      <span className="text-xs text-gray-500">
                        {pdf.totalPages} pages
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => handleDelete(pdf._id, e)}
                  className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-red-500 hover:bg-red-50 rounded transition-opacity"
                  title="Delete PDF"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PdfSelector;
