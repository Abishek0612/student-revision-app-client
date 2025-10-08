import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateQuiz, reset } from "../../features/quiz/quizSlice";
import Spinner from "../common/Spinner";

function QuizEngine({ selectedPdf }) {
  const dispatch = useDispatch();
  const { questions, isLoading } = useSelector((state) => state.quiz);
  const [questionCount, setQuestionCount] = useState(5);

  const isPdfReady = selectedPdf && selectedPdf.status === "ready";

  const handleGenerateQuiz = () => {
    if (!isPdfReady) return;
    dispatch(
      generateQuiz({
        pdfId: selectedPdf._id,
        questionCount,
        questionTypes: ["MCQ", "SAQ"],
      })
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Quiz Generator</h2>
      <div className="flex items-center space-x-4 mb-4">
        <label>Number of Questions:</label>
        <input
          type="number"
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
          className="border p-1 rounded w-20"
        />
        <button
          onClick={handleGenerateQuiz}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!isPdfReady}
        >
          Generate Quiz
        </button>
        <button
          onClick={() => dispatch(reset())}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Clear
        </button>
      </div>

      {!isPdfReady && selectedPdf && (
        <p className="text-sm text-yellow-600 p-2 bg-yellow-50 rounded">
          The selected PDF is still processing. Please wait for the status to
          become 'ready'.
        </p>
      )}

      {isLoading && <Spinner />}

      {!isLoading && questions && questions.length > 0 && (
        <div className="space-y-6 mt-4">
          {questions.map((q, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border">
              <p className="font-semibold">
                {index + 1}. {q.question}
              </p>

              {q.type === "MCQ" && q.options && (
                <div className="mt-2 space-y-2">
                  {q.options.map((opt, i) => (
                    <div key={i} className="flex items-center">
                      <input
                        type="radio"
                        name={`q${index}`}
                        value={opt}
                        className="mr-2"
                      />
                      <label>{opt}</label>
                    </div>
                  ))}
                </div>
              )}

              {q.type === "SAQ" && (
                <textarea
                  className="mt-2 w-full p-2 border rounded"
                  rows="3"
                  placeholder="Your answer..."
                ></textarea>
              )}

              <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-sm text-green-800">
                <p>
                  <strong>Answer:</strong> {q.answer}
                </p>
                <p className="mt-1">
                  <strong>Explanation:</strong> {q.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default QuizEngine;
