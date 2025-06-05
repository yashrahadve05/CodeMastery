import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import {
    Play,
    FileText,
    MessageSquare,
    Lightbulb,
    Bookmark,
    Share2,
    Clock,
    ChevronRight,
    BookOpen,
    Terminal,
    Code2,
    Users,
    ThumbsUp,
    Home,
} from "lucide-react";

import useProblemStore from '../store/useProblemStore';
import useExecutionStore from '../store/useExecutionStore';
import useSubmissionStore from '../store/useSubmissionStore';
import { getLanguageId } from '../lib/language';
import Submission from '../components/Submission';
import toast from 'react-hot-toast';
import SubmissionsList from '../components/SubmissionList';

const ProblemPage = () => {

    const { id } = useParams();

    // let submissionCount = 10;
    // let isBookmarked = true;

    const { submission: submissions, isLoading: isSubmissionLoading, submissionCount, getAllSubmissions, getSubmissionCountForProblem, getSubmissionForProblem } = useSubmissionStore();

    const { getProblemById, problem, isProblemLoading } = useProblemStore();

    const [code, setCode] = useState();
    const [activeTab, setActiveTab] = useState("description");
    const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [testCase, setTestCase] = useState();

    // console.log("Test Cases",testCase);


    const { executeCode, submission, isExecuting } = useExecutionStore();


    useEffect(() => {
        getProblemById(id);
        getSubmissionCountForProblem(id);
    }, [id]);

    useEffect(() => {
        if (problem) {
            setCode(problem.codeSnippets?.[selectedLanguage] || "")

            setTestCase(
                problem.testCase?.map((testcases) => ({
                    input: testcases.input,
                    output: testcases.output
                })) || []
            )
        }

    }, [problem, selectedLanguage]);

    useEffect(() => {
        if (activeTab === "submissions" && id) {
            getSubmissionForProblem(id);
        }
    }, [activeTab, id])

    console.log("submission", submissions);



    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
        setCode(problem.codeSnippets?.[lang] || "");
    }

    const handleRunCode = (e) => {
        e.preventDefault();

        try {
            const language_id = getLanguageId(selectedLanguage);
            const stdin = problem.testCases.map((testcases) => testcases.input);
            const expected_outputs = problem.testCases.map((testcases) => testcases.output);
            executeCode(code, language_id, stdin, expected_outputs, id)
        } catch (error) {
            console.log("Error executing code", error);
        }
    }

    const submitResult = () => {
        toast("Code Submitted Successfully!");
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case "description":
                return (
                    <div className="prose max-w-none">
                        <p className="text-sm mb-6">{problem.description}</p>

                        {problem.examples && (
                            <>
                                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                                {Object.entries(problem.examples).map(([lang, example], idx) => (
                                    <div key={lang} className="bg-base-200 p-6 rounded-xl mb-6 font-mono">
                                        <div className="mb-4">
                                            <div className="text-indigo-300 mb-2 text-base font-semibold">
                                                Input:
                                            </div>
                                            <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                                                {example.input}
                                            </span>
                                        </div>
                                        <div className="mb-4">
                                            <div className="text-indigo-300 mb-2 text-base font-semibold">
                                                Output:
                                            </div>
                                            <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                                                {example.output}
                                            </span>
                                        </div>
                                        {example.explanation && (
                                            <div>
                                                <div className="text-emerald-300 mb-2 text-base font-semibold">
                                                    Explanation:
                                                </div>
                                                <p className="text-base-content/70 text-lg font-sem">
                                                    {example.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}

                        {problem.constraints && (
                            <>
                                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                                <div className="bg-base-200 p-6 rounded-xl mb-6">
                                    <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                                        {problem.constraints}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                );
            case "submissions":
                return <SubmissionsList submissions={submissions} isLoading={isSubmissionLoading} />;
            case "discussion":
                return <div className="p-4 text-center text-base-content/70">No discussions yet</div>;
            case "hints":
                return (
                    <div className="p-4">
                        {problem?.hints ? (
                            <div className="bg-base-200 p-6 rounded-xl">
                                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                                    {problem.hints}
                                </span>
                            </div>
                        ) : (
                            <div className="text-center text-base-content/70">No hints available</div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-base-300 to-base-200">
            <nav className="navbar bg-base-100 shadow-lg px-4">
                <div className="flex-1 gap-2">
                    <div className='flex flex-row gap-2'>
                        <Link to={"/"} className="flex items-center gap-2 text-primary">
                            <Home className="w-5 h-5" />
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                        <h1 className="text-xl font-bold">{problem.title}</h1>
                    </div>
                    <div className="mt-2">
                        <div className="flex items-center gap-2 text-sm text-base-content/70 mt-2 mb-1 ml-13">
                            <Clock className="w-4 h-4" />
                            <span>
                                Updated{" "}
                                {new Date(problem.createdAt).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                            <span className="text-base-content/30">•</span>
                            <Users className="w-4 h-4" />
                            <span>{submissionCount} Submissions</span>
                            <span className="text-base-content/30">•</span>
                            <ThumbsUp className="w-4 h-4" />
                            <span>95% Success Rate</span>
                        </div>
                    </div>
                </div>
                <div className="flex-none gap-4">
                    <button
                        className={`btn btn-ghost btn-circle mr-2 ${isBookmarked ? "text-primary" : ""}`}
                        onClick={() => setIsBookmarked(!isBookmarked)}
                    >
                        <Bookmark className="w-5 h-5" />
                    </button>
                    <button className="btn btn-ghost btn-circle mr-2">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <select
                        className="select select-bordered select-primary w-40"
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                    >
                        {Object.keys(problem.codeSnippets || {}).map((lang) => (
                            <option key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </nav>

            <div className='container mx-auto p-4'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body p-0">
                            <div className="tabs tabs-bordered">
                                <button
                                    className={`tab gap-2 ${activeTab === "description" ? "tab-active" : ""
                                        }`}
                                    onClick={() => setActiveTab("description")}
                                >
                                    <FileText className="w-4 h-4" />
                                    Description
                                </button>
                                <button
                                    className={`tab gap-2 ${activeTab === "submissions" ? "tab-active" : ""}`}
                                    onClick={() => setActiveTab("submissions")}
                                >
                                    <Code2 className="w-4 h-4" />
                                    {/* {submissionCount} */}
                                    Submissions
                                </button>
                                <button
                                    className={`tab gap-2 ${activeTab === "discussion" ? "tab-active" : ""
                                        }`}
                                    onClick={() => setActiveTab("discussion")}
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Discussion
                                </button>
                                <button
                                    className={`tab gap-2 ${activeTab === "hints" ? "tab-active" : ""
                                        }`}
                                    onClick={() => setActiveTab("hints")}
                                >
                                    <Lightbulb className="w-4 h-4" />
                                    Hints
                                </button>
                            </div>

                            <div className="p-6">{renderTabContent()}</div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body p-0">
                            <div className="tabs tabs-bordered">
                                <button className="tab tab-active gap-2">
                                    <Terminal className="w-4 h-4" />
                                    Code Editor
                                </button>
                            </div>

                            <div className="h-full w-full">
                                <Editor
                                    height="100%"
                                    language={selectedLanguage.toLowerCase()}
                                    theme="vs-dark"
                                    value={code}
                                    onChange={(value) => setCode(value || "")}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 18,
                                        lineNumbers: "on",
                                        roundedSelection: false,
                                        scrollBeyondLastLine: false,
                                        readOnly: false,
                                        automaticLayout: true,
                                    }}
                                />
                            </div>

                            <div className="p-4 border-t border-base-300 bg-base-200">
                                <div className="flex justify-between items-center">
                                    <button
                                        className={`btn btn-primary gap-2 ${isExecuting ? "loading" : ""}`}
                                        onClick={handleRunCode}
                                        disabled={isExecuting}
                                    >
                                        {!isExecuting && <Play className="w-4 h-4" />}
                                        Run Code
                                    </button>
                                    <button
                                        className="btn btn-success gap-2"
                                        onClick={submitResult}
                                    >
                                        Submit Solution
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl mt-6">
                    <div className="card-body">
                        {submission ? (
                            <Submission submission={submission} />
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold">Test Cases</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table table-zebra w-full">
                                        <thead>
                                            <tr>
                                                <th>Input</th>
                                                <th>Expected Output</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* {testCase.map((testcases, index) => (
                                                <tr key={index}>
                                                    <td className="font-mono">{testcases.input}</td>
                                                    <td className="font-mono">{testcases.output}</td>
                                                </tr>
                                            ))} */}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProblemPage