import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateQuiz, reset } from "../../features/quiz/quizSlice";
import { FiRefreshCw, FiX } from "react-icons/fi";
import Spinner from "../common/Spinner";

function QuizEngine({ selectedPdf }) {
  const dispatch = useDispatch();
  const { questions, isLoading } = useSelector((state) => state.quiz);
  const [questionCount, setQuestionCount] = useState(5);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const isPdfReady = selectedPdf && selectedPdf.status === "ready";

  const handleGenerateQuiz = () => {
    if (!isPdfReady) return;
    setUserAnswers({});
    setShowResults(false);
    dispatch(
      generateQuiz({
        pdfId: selectedPdf._id,
        questionCount,
        questionTypes: ["MCQ", "SAQ"],
      })
    );
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer,
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        correct++;
      }
    });
    return { correct, total: questions.length };
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quiz Generator</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Questions:
            </label>
            <input
              type="number"
              value={questionCount}
              onChange={(e) =>
                setQuestionCount(Math.max(1, Math.min(20, e.target.value)))
              }
              className="border rounded-lg px-3 py-2 w-20 text-center"
              min="1"
              max="20"
            />
          </div>
          <button
            onClick={handleGenerateQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={!isPdfReady}
          >
            <FiRefreshCw /> Generate
          </button>
          {questions.length > 0 && (
            <button
              onClick={() => dispatch(reset())}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors flex items-center gap-2"
            >
              <FiX /> Clear
            </button>
          )}
        </div>
      </div>

      {!isPdfReady && selectedPdf && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            The selected PDF is still processing. Please wait for the status to
            become 'ready'.
          </p>
        </div>
      )}

      {isLoading && <Spinner />}

      {!isLoading && questions && questions.length > 0 && (
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-900 mb-4">
                    {q.question}
                  </p>

                  {q.type === "MCQ" && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <label
                          key={i}
                          className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                            showResults
                              ? opt === q.answer
                                ? "border-green-500 bg-green-50"
                                : userAnswers[index] === opt
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200 bg-gray-50"
                              : userAnswers[index] === opt
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q${index}`}
                            value={opt}
                            checked={userAnswers[index] === opt}
                            onChange={(e) =>
                              handleAnswerChange(index, e.target.value)
                            }
                            disabled={showResults}
                            className="mr-3"
                          />
                          <span
                            className={
                              showResults && opt === q.answer
                                ? "font-semibold"
                                : ""
                            }
                          >
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === "SAQ" && (
                    <textarea
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      rows="3"
                      placeholder="Your answer..."
                      value={userAnswers[index] || ""}
                      onChange={(e) =>
                        handleAnswerChange(index, e.target.value)
                      }
                      disabled={showResults}
                    />
                  )}

                  {showResults && (
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Answer:
                      </p>
                      <p className="text-sm text-blue-800 mb-2">{q.answer}</p>
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Explanation:
                      </p>
                      <p className="text-sm text-blue-800">{q.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {!showResults && (
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg"
            >
              Submit Quiz
            </button>
          )}

          {showResults && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">Quiz Results</h3>
              <p className="text-4xl font-bold mb-2">
                {calculateScore().correct} / {calculateScore().total}
              </p>
              <p className="text-lg">
                Score:{" "}
                {Math.round(
                  (calculateScore().correct / calculateScore().total) * 100
                )}
                %
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizEngine;
