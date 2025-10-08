import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProgress } from "../../features/quiz/quizSlice";
import { FiTrendingUp, FiAward } from "react-icons/fi";
import Spinner from "../common/Spinner";

function ProgressTracker() {
  const dispatch = useDispatch();
  const { progress } = useSelector((state) => state.quiz);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    dispatch(getProgress()).finally(() => setIsLoading(false));
  }, [dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  const calculateOverallStats = () => {
    if (!progress || progress.length === 0) return null;

    const totalAttempts = progress.length;
    const totalQuestions = progress.reduce(
      (sum, attempt) => sum + attempt.totalQuestions,
      0
    );
    const totalScore = progress.reduce(
      (sum, attempt) => sum + attempt.score,
      0
    );
    const avgScore = Math.round((totalScore / totalQuestions) * 100);

    const topicStats = {};
    progress.forEach((attempt) => {
      const topic = attempt.pdf?.fileName || "Unknown";
      if (!topicStats[topic]) {
        topicStats[topic] = { correct: 0, total: 0, attempts: 0 };
      }
      topicStats[topic].correct += attempt.score;
      topicStats[topic].total += attempt.totalQuestions;
      topicStats[topic].attempts += 1;
    });

    const strengths = [];
    const weaknesses = [];
    Object.entries(topicStats).forEach(([topic, stats]) => {
      const percentage = Math.round((stats.correct / stats.total) * 100);
      if (percentage >= 70) {
        strengths.push({ topic, percentage, attempts: stats.attempts });
      } else if (percentage < 50) {
        weaknesses.push({ topic, percentage, attempts: stats.attempts });
      }
    });

    return {
      totalAttempts,
      totalQuestions,
      avgScore,
      strengths,
      weaknesses,
      recentProgress: progress.slice(0, 5),
    };
  };

  const stats = calculateOverallStats();

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-gray-500">
          <FiTrendingUp className="mx-auto text-6xl mb-3 opacity-30" />
          <p className="text-lg">
            No quiz attempts yet. Start learning to track your progress!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FiTrendingUp /> Progress Tracker
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <p className="text-sm opacity-90 mb-1">Total Attempts</p>
          <p className="text-4xl font-bold">{stats.totalAttempts}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
          <p className="text-sm opacity-90 mb-1">Questions Answered</p>
          <p className="text-4xl font-bold">{stats.totalQuestions}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <p className="text-sm opacity-90 mb-1">Average Score</p>
          <p className="text-4xl font-bold">{stats.avgScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiAward className="text-green-600" /> Strengths
          </h3>
          {stats.strengths.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Keep practicing to identify your strengths!
            </p>
          ) : (
            <div className="space-y-3">
              {stats.strengths.map((item, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-gray-900">{item.topic}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600">
                      {item.attempts} attempt{item.attempts > 1 ? "s" : ""}
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Areas to Improve
          </h3>
          {stats.weaknesses.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Great job! No weak areas identified.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.weaknesses.map((item, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-gray-900">{item.topic}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600">
                      {item.attempts} attempt{item.attempts > 1 ? "s" : ""}
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {stats.recentProgress.map((attempt, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="mb-2 sm:mb-0">
                <p className="font-medium text-gray-900">
                  {attempt.pdf?.fileName || "Unknown PDF"}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(attempt.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {attempt.score}/{attempt.totalQuestions} correct
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    (attempt.score / attempt.totalQuestions) * 100 >= 70
                      ? "bg-green-100 text-green-800"
                      : (attempt.score / attempt.totalQuestions) * 100 >= 50
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {Math.round((attempt.score / attempt.totalQuestions) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressTracker;
