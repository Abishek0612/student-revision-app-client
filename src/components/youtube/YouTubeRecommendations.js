import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendations, reset } from "../../features/youtube/youtubeSlice";
import { FiYoutube, FiRefreshCw } from "react-icons/fi";
import Spinner from "../common/Spinner";

function YouTubeRecommendations({ selectedPdf }) {
  const dispatch = useDispatch();
  const { videos, isLoading } = useSelector((state) => state.youtube);

  useEffect(() => {
    if (selectedPdf && selectedPdf.status === "ready") {
      dispatch(getRecommendations({ pdfId: selectedPdf._id }));
    }
    return () => dispatch(reset());
  }, [selectedPdf, dispatch]);

  const handleRefresh = () => {
    if (selectedPdf) {
      dispatch(getRecommendations({ pdfId: selectedPdf._id }));
    }
  };

  if (!selectedPdf) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">
          <FiYoutube className="mx-auto text-6xl mb-3 opacity-30" />
          <p className="text-lg">Select a PDF to get video recommendations</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiYoutube className="text-red-600" /> Video Recommendations
        </h2>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {selectedPdf && selectedPdf.status !== "ready" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            The selected PDF is still processing. Video recommendations will be
            available once processing is complete.
          </p>
        </div>
      )}

      {videos.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 py-8">
          <p>No videos found. Try refreshing or select a different PDF.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <a
            key={video.videoId}
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <FiYoutube className="text-white text-5xl opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {video.description}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{video.channelTitle}</p>
                <FiYoutube className="text-red-600" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default YouTubeRecommendations;
