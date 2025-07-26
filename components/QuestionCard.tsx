
import React, { useState, useMemo } from 'react';
import { Question, Answer } from '../types';

interface QuestionCardProps {
  questionIndex: number;
  data: Question;
  userAnswer: Answer;
  isChecked: boolean;
  onAnswerChange: (index: number, answer: Answer) => void;
  onCheckAnswer: (index: number) => void;
}

const getOptionClassName = (isChecked: boolean, isSelected: boolean, isCorrect: boolean): string => {
  const baseClasses = 'option-label block w-full p-4 border-2 rounded-lg cursor-pointer transition-all duration-200';
  if (isChecked) {
    if (isCorrect) {
      return `${baseClasses} bg-green-100 dark:bg-green-900/50 border-green-500 dark:border-green-600 text-green-900 dark:text-green-200`;
    }
    if (isSelected && !isCorrect) {
      return `${baseClasses} bg-red-100 dark:bg-red-900/50 border-red-500 dark:border-red-600 text-red-900 dark:text-red-200`;
    }
    return `${baseClasses} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700`;
  }
  if (isSelected) {
     return `${baseClasses} bg-indigo-100 dark:bg-indigo-900/50 border-indigo-500 dark:border-indigo-500 text-indigo-900 dark:text-indigo-200`;
  }
  return `${baseClasses} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20`;
};


const QuestionCard: React.FC<QuestionCardProps> = ({ questionIndex, data, userAnswer, isChecked, onAnswerChange, onCheckAnswer }) => {
  const [selectedOptions, setSelectedOptions] = useState<Answer>(userAnswer || (data.isMultipleChoice ? [] : (data.isMatching ? {} : null)));
  
  const handleSelection = (option: string) => {
    let newAnswer: Answer;
    if (data.isMultipleChoice) {
      const currentAnswers = new Set(Array.isArray(selectedOptions) ? selectedOptions : []);
      if (currentAnswers.has(option)) {
        currentAnswers.delete(option);
      } else {
        currentAnswers.add(option);
      }
      newAnswer = Array.from(currentAnswers);
    } else {
      newAnswer = option;
    }
    setSelectedOptions(newAnswer);
    onAnswerChange(questionIndex, newAnswer);
  };
  
  const handleMatchingSelection = (description: string, value: string) => {
      const newAnswer = { ...(selectedOptions as Record<string, string>), [description]: value };
      setSelectedOptions(newAnswer);
      onAnswerChange(questionIndex, newAnswer);
  }

  const shuffledTerms = useMemo(() => {
    if (!data.isMatching) return [];
    // Get terms from answer object values and shuffle them
    const terms = Object.values(data.answer);
    return terms.sort(() => Math.random() - 0.5);
  }, [data]);
  
  const isCheckButtonDisabled = useMemo(() => {
    if (isChecked) return true;
    if (data.isMatching) {
        return Object.keys(selectedOptions as Record<string, string>).length !== data.options.length;
    }
    if (data.isMultipleChoice) {
        return (selectedOptions as string[]).length === 0;
    }
    return selectedOptions === null;
  }, [isChecked, selectedOptions, data]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-5 text-gray-800 dark:text-gray-100" dangerouslySetInnerHTML={{ __html: data.question }}></h3>
      
      <div className="space-y-4">
        {data.isMatching ? (
            data.options.map((desc, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <label className="flex-1 font-medium text-gray-700 dark:text-gray-300">{desc}</label>
                    <select
                        value={(selectedOptions as Record<string, string>)[desc] || ''}
                        onChange={(e) => handleMatchingSelection(desc, e.target.value)}
                        disabled={isChecked}
                        className={`mt-1 block w-full sm:w-1/2 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700
                         ${isChecked && ((data.answer as Record<string, string>)[desc] === (selectedOptions as Record<string, string>)[desc] ? 'border-green-500' : 'border-red-500')}
                        `}
                    >
                        <option value="" disabled>Choose...</option>
                        {shuffledTerms.map(term => (
                            <option key={term} value={term}>{term}</option>
                        ))}
                    </select>
                </div>
            ))
        ) : (
            data.options.map((option, i) => {
              const inputType = data.isMultipleChoice ? 'checkbox' : 'radio';
              const isSelected = data.isMultipleChoice ? (selectedOptions as string[]).includes(option) : selectedOptions === option;
              const isCorrect = data.isMultipleChoice 
                ? (data.answer as string[]).includes(option) 
                : data.answer === option;

              return (
                <div key={i}>
                  <input
                    id={`q${questionIndex}-o${i}`}
                    name={`q${questionIndex}`}
                    type={inputType}
                    value={option}
                    checked={isSelected}
                    onChange={() => handleSelection(option)}
                    disabled={isChecked}
                    className="sr-only"
                  />
                  <label htmlFor={`q${questionIndex}-o${i}`} className={getOptionClassName(isChecked, isSelected, isCorrect)}>
                    {option}
                  </label>
                </div>
              );
            })
        )}
      </div>

      {isChecked ? (
        <div className="explanation visible mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border-l-4 border-indigo-300 dark:border-indigo-500 animate-fadeIn">
          <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100">Explanation:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{data.explanation}</p>
        </div>
      ) : (
        <div className="mt-6 text-right">
          <button
            onClick={() => onCheckAnswer(questionIndex)}
            disabled={isCheckButtonDisabled}
            className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Check Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
