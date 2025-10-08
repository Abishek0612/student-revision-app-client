import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPdfs, uploadPdf, reset } from "../../features/pdfs/pdfSlice";
import Spinner from "../common/Spinner";

function PdfSelector({ onPdfSelect }) {
  const dispatch = useDispatch();
  const { pdfs, isLoading, isError, message } = useSelector(
    (state) => state.pdfs
  );
  const [selectedFile, setSelectedFile] = useState(null);

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
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">My Coursebooks</h2>
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          Upload PDF
        </button>
      </div>
      <ul className="space-y-2">
        {pdfs.map((pdf) => (
          <li key={pdf._id}>
            <button
              onClick={() => onPdfSelect(pdf)}
              className="w-full text-left p-2 rounded hover:bg-gray-200"
            >
              {pdf.fileName}{" "}
              <span
                className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                  pdf.status === "ready"
                    ? "bg-green-200 text-green-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {pdf.status}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PdfSelector;
