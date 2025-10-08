import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import PdfSelector from "../components/dashboard/PdfSelector";
import QuizEngine from "../components/quiz/QuizEngine";
import ProgressTracker from "../components/dashboard/ProgressTracker";
import ChatInterface from "../components/chat/ChatInterface";
import YouTubeRecommendations from "../components/youtube/YouTubeRecommendations";

function Dashboard() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [view, setView] = useState("quiz");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handlePdfSelect = (pdf) => {
    setSelectedPdf(pdf);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-[calc(100vh-64px)]">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-20 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
        >
          <FiMenu className="text-xl" />
        </button>

        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:relative z-40 w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out h-full overflow-y-auto`}
        >
          <div className="p-6">
            <PdfSelector onPdfSelect={handlePdfSelect} />
            <nav className="mt-6 space-y-2">
              <button
                onClick={() => {
                  setView("quiz");
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  view === "quiz"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Quiz Generator
              </button>
              <button
                onClick={() => {
                  setView("chat");
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  view === "chat"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                AI Chat
              </button>
              <button
                onClick={() => {
                  setView("youtube");
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  view === "youtube"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Video Recommendations
              </button>
              <button
                onClick={() => {
                  setView("progress");
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  view === "progress"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Progress Tracker
              </button>
            </nav>
          </div>
        </div>

        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 lg:p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

            {view === "quiz" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                {selectedPdf ? (
                  <QuizEngine selectedPdf={selectedPdf} />
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 text-lg">
                      Please select or upload a PDF to begin.
                    </p>
                  </div>
                )}
              </div>
            )}

            {view === "chat" && (
              <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-180px)]">
                <ChatInterface
                  selectedPdfs={selectedPdf ? [selectedPdf] : []}
                />
              </div>
            )}

            {view === "youtube" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <YouTubeRecommendations selectedPdf={selectedPdf} />
              </div>
            )}

            {view === "progress" && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <ProgressTracker />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
