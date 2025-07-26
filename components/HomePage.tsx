import React from 'react';
import { Quiz } from '../types';
import QuizGenerator from './QuizGenerator';
import { AcademicCapIcon, SparklesIcon, GlobeAltIcon, ChartBarIcon, BriefcaseIcon, ArrowTrendingUpIcon, LightBulbIcon } from './icons/Icons';

interface HomePageProps {
  mockExams: Quiz[];
  onStartQuiz: (quiz: Quiz) => void;
}

const getCategoryIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('pmp') || lowerTitle.includes('project management')) {
        return <ChartBarIcon className="w-8 h-8 text-indigo-500" />;
    }
    if (lowerTitle.includes('citizenship') || lowerTitle.includes('history')) {
        return <GlobeAltIcon className="w-8 h-8 text-green-500" />;
    }
    return <AcademicCapIcon className="w-8 h-8 text-purple-500" />;
};

const QuizCard: React.FC<{ quiz: Quiz; onStart: () => void }> = ({ quiz, onStart }) => (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col justify-between border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {getCategoryIcon(quiz.title)}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{quiz.title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-10">{quiz.description}</p>
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {quiz.questions.length} Questions
        </div>
      </div>
       <button 
        onClick={onStart} 
        className="block w-full text-center bg-indigo-50 dark:bg-gray-700/50 text-indigo-600 dark:text-indigo-300 font-semibold p-4 hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors"
       >
        Start Quiz
      </button>
    </div>
);

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-4 mb-3">
      {icon}
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-sm">{children}</p>
  </div>
);


const HomePage: React.FC<HomePageProps> = ({ mockExams, onStartQuiz }) => {
  return (
    <div className="animate-fadeIn max-w-7xl mx-auto">
      <header className="text-center mb-16">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          IntelliPrep <span className="text-indigo-600 dark:text-indigo-400">PMP® Platform</span>
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-500 dark:text-gray-400">
          Your AI-powered co-pilot to master the PMP exam. Practice with curated questions or generate your own quizzes to ace the certification.
        </p>
      </header>
      
      <main className="space-y-20">
        <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Why PMP®?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InfoCard icon={<ArrowTrendingUpIcon className="w-8 h-8 text-green-500"/>} title="Career Advancement">
                    PMP certification significantly boosts your resume, opening doors to senior roles and higher-paying opportunities in project management.
                </InfoCard>
                <InfoCard icon={<GlobeAltIcon className="w-8 h-8 text-blue-500"/>} title="Global Recognition">
                    As a globally recognized standard, the PMP demonstrates your expertise and commitment to the profession anywhere in the world.
                </InfoCard>
                <InfoCard icon={<LightBulbIcon className="w-8 h-8 text-yellow-500"/>} title="Enhanced Skills">
                    The PMP framework equips you with the latest in predictive, agile, and hybrid approaches to successfully manage any project.
                </InfoCard>
            </div>
        </section>
        
        <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
             <div className="flex items-center gap-3 mb-6">
                <SparklesIcon className="w-8 h-8 text-purple-500" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">AI-Powered Custom Quizzes</h2>
            </div>
            <QuizGenerator onStartQuiz={onStartQuiz} />
        </section>

        <section>
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Master the PMP Domains</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6">
                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">People (42%)</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Emphasizing the soft skills you need to effectively lead a project team in today's changing environment.</p>
                </div>
                 <div className="p-6">
                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Process (50%)</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Reinforcing the technical aspects of successfully managing projects.</p>
                </div>
                 <div className="p-6">
                    <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Business Environment (8%)</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Highlighting the connection between projects and organizational strategy.</p>
                </div>
            </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
             <AcademicCapIcon className="w-8 h-8 text-indigo-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Curated Practice Exams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockExams.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onStart={() => onStartQuiz(quiz)} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
