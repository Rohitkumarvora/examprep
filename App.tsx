
import React, { useState, useCallback } from 'react';
import HomePage from './components/HomePage';
import TestPage from './components/TestPage';
import { Quiz } from './types';
import { mockExams } from './data/mockExams';

const App: React.FC = () => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const startQuiz = useCallback((quiz: Quiz) => {
    setActiveQuiz(quiz);
  }, []);

  const goHome = useCallback(() => {
    setActiveQuiz(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {activeQuiz ? (
          <TestPage quiz={activeQuiz} onGoHome={goHome} />
        ) : (
          <HomePage mockExams={mockExams} onStartQuiz={startQuiz} />
        )}
      </div>
       <footer className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm">
          Powered by React, Tailwind CSS, and Google Gemini
        </footer>
    </div>
  );
};

export default App;
