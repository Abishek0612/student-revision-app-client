import React, { useState } from "react";
import PdfSelector from "../components/dashboard/PdfSelector";
import PdfViewer from "../components/dashboard/PdfViewer";
import QuizEngine from "../components/quiz/QuizEngine";
import ProgressTracker from "../components/dashboard/ProgressTracker";

function Dashboard() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [view, setView] = useState("quiz"); // 'quiz' or 'progress'

  const handlePdfSelect = (pdf) => {
    setSelectedPdf(pdf);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow">
          <PdfSelector onPdfSelect={handlePdfSelect} />
          <nav className="mt-6">
            <button
              onClick={() => setView("quiz")}
              className={`w-full text-left p-2 rounded ${
                view === "quiz" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
            >
              Quiz Generator
            </button>
            <button
              onClick={() => setView("progress")}
              className={`w-full text-left p-2 rounded mt-2 ${
                view === "progress"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              Progress Tracker
            </button>
          </nav>
        </div>

        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
          {view === "quiz" && (
            <>
              {selectedPdf ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[75vh]">
                  <div className="h-full overflow-y-auto border rounded">
                    <PdfViewer
                      pdfFile={`http://localhost:5001/${selectedPdf.filePath}`}
                    />
                  </div>
                  <div className="h-full overflow-y-auto">
                    <QuizEngine selectedPdf={selectedPdf} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">
                    Please select or upload a PDF to begin.
                  </p>
                </div>
              )}
            </>
          )}

          {view === "progress" && <ProgressTracker />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
