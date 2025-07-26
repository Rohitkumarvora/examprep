
import React, { useState, useCallback } from 'react';
import { Quiz } from '../types';
import { generateQuiz } from '../services/geminiService';
import Spinner from './Spinner';

interface QuizGeneratorProps {
  onStartQuiz: (quiz: Quiz) => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ onStartQuiz }) => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const newQuiz = await generateQuiz(topic, numQuestions);
      onStartQuiz(newQuiz);
    } catch (err) {
      console.error(err);
      setError('Failed to generate quiz. The AI might be busy or the topic is too complex. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, numQuestions, onStartQuiz]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Enter any subject, and our AI will create a unique practice test for you.
      </p>
      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Quiz Topic
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'Agile Methodologies in PMP' or 'JavaScript Promises'"
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Number of Questions
        </label>
        <div className="mt-1">
           <input
            type="range"
            id="numQuestions"
            min="3"
            max="15"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
            disabled={isLoading}
          />
          <div className="text-center font-semibold text-indigo-600 dark:text-indigo-400">{numQuestions}</div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full flex justify-center items-center gap-3 px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors"
        >
          {isLoading ? (
            <>
              <Spinner />
              Generating...
            </>
          ) : (
            'Generate Quiz'
          )}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
    </form>
  );
};

export default QuizGenerator;
