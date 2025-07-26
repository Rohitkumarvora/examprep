
import React, { useCallback, useMemo } from 'react';
import { Quiz, Question, Answer } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import QuestionCard from './QuestionCard';
import { ArrowLeftIcon } from './icons/Icons';

interface TestPageProps {
  quiz: Quiz;
  onGoHome: () => void;
}

const TestPage: React.FC<TestPageProps> = ({ quiz, onGoHome }) => {
  const [currentIndex, setCurrentIndex] = useLocalStorage<number>(`${quiz.id}-index`, 0);
  const [userAnswers, setUserAnswers] = useLocalStorage<Record<number, Answer>>(`${quiz.id}-answers`, {});
  const [checkedAnswers, setCheckedAnswers] = useLocalStorage<Record<number, boolean>>(`${quiz.id}-checked`, {});
  const [isFinished, setIsFinished] = useLocalStorage<boolean>(`${quiz.id}-finished`, false);

  const handleAnswerChange = useCallback((index: number, answer: Answer) => {
    setUserAnswers(prev => ({ ...prev, [index]: answer }));
  }, [setUserAnswers]);

  const handleCheckAnswer = useCallback((index: number) => {
    setCheckedAnswers(prev => ({ ...prev, [index]: true }));
  }, [setCheckedAnswers]);

  const navigate = (direction: 1 | -1) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < quiz.questions.length) {
      setCurrentIndex(newIndex);
    }
  };
  
  const finishQuiz = () => {
    setIsFinished(true);
    window.scrollTo(0, 0);
  };
  
  const restartQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers({});
    setCheckedAnswers({});
    setIsFinished(false);
    window.scrollTo(0, 0);
  };

  const currentQuestion: Question = quiz.questions[currentIndex];
  const progress = useMemo(() => (Object.keys(checkedAnswers).length / quiz.questions.length) * 100, [checkedAnswers, quiz.questions.length]);

  const score = useMemo(() => {
    if (!isFinished) return 0;
    let correctCount = 0;
    quiz.questions.forEach((q, i) => {
       const userAnswer = userAnswers[i];
       if (userAnswer === undefined || userAnswer === null) return;

       let isCorrect = false;
        if (q.isMatching) {
            isCorrect = typeof userAnswer === 'object' && userAnswer !== null &&
                Object.keys(q.answer as Record<string, string>).length > 0 &&
                Object.keys(q.answer as Record<string, string>).every(key => (q.answer as Record<string, string>)[key] === (userAnswer as Record<string, string>)[key]);
        } else if (q.isMultipleChoice) {
            isCorrect = Array.isArray(userAnswer) && Array.isArray(q.answer) &&
                userAnswer.length === q.answer.length &&
                userAnswer.every(val => (q.answer as string[]).includes(val));
        } else {
            isCorrect = userAnswer === q.answer;
        }

       if(isCorrect) correctCount++;
    });
    return (correctCount / quiz.questions.length) * 100;
  }, [isFinished, quiz.questions, userAnswers]);


  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl animate-fadeIn">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Quiz Complete!</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">{quiz.title}</p>
        <div className="my-8">
            <div className={`text-6xl font-extrabold ${score >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                {score.toFixed(0)}%
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-300">Your Score</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onGoHome} className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">
              Back to Home
            </button>
            <button onClick={restartQuiz} className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border text-base font-medium rounded-md shadow-sm transition border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
              Retake Quiz
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <button onClick={onGoHome} className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-2 sm:mb-0">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
        </div>
        <div className="text-lg font-semibold text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md mt-2 sm:mt-0">
          Question {currentIndex + 1} of {quiz.questions.length}
        </div>
      </header>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
      </div>
      
      <div className="min-h-[450px]">
        {currentQuestion && (
           <QuestionCard
            key={currentIndex}
            questionIndex={currentIndex}
            data={currentQuestion}
            userAnswer={userAnswers[currentIndex]}
            isChecked={checkedAnswers[currentIndex] || false}
            onAnswerChange={handleAnswerChange}
            onCheckAnswer={handleCheckAnswer}
          />
        )}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)} 
          disabled={currentIndex === 0}
          className="px-6 py-2 border text-base font-medium rounded-md shadow-sm transition border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {currentIndex === quiz.questions.length - 1 ? (
          <button 
            onClick={finishQuiz}
            className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Finish Quiz
          </button>
        ) : (
          <button 
            onClick={() => navigate(1)}
            className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TestPage;
