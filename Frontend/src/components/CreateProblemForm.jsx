import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { Plus, Trash2, Code2, FileText, Lightbulb, BookOpen, CheckCircle2, Download } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { axiosInstance } from "../lib/axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const problemSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    tags: z.array(z.string()).min(1, "At least one tag is required"),
    constraints: z.string().min(1, "Constraints are required"),
    hints: z.string().optional(),
    editorial: z.string().optional(),
    testCases: z
        .array(
            z.object({
                input: z.string().min(1, "Input is required"),
                output: z.string().min(1, "Output is required"),
            })
        )
        .min(1, "At least one test case is required"),
    examples: z.object({
        JAVASCRIPT: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional(),
        }),
        PYTHON: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional(),
        }),
        JAVA: z.object({
            input: z.string().min(1, "Input is required"),
            output: z.string().min(1, "Output is required"),
            explanation: z.string().optional(),
        }),
    }),
    codeSnippets: z.object({
        JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
        PYTHON: z.string().min(1, "Python code snippet is required"),
        JAVA: z.string().min(1, "Java solution is required"),
    }),
    referenceSolution: z.object({
        JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
        PYTHON: z.string().min(1, "Python solution is required"),
        JAVA: z.string().min(1, "Java solution is required"),
    }),
});


const sampledpData = {
    title: "Climbing Stairs",
    category: "dp", // Dynamic Programming
    description:
        "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "EASY",
    tags: ["Dynamic Programming", "Math", "Memoization"],
    constraints: "1 <= n <= 45",
    hints:
        "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
    editorial:
        "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
    testCases: [
        {
            input: "2",
            output: "2",
        },
        {
            input: "3",
            output: "3",
        },
        {
            input: "4",
            output: "5",
        },
    ],
    examples: {
        JAVASCRIPT: {
            input: "n = 2",
            output: "2",
            explanation:
                "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
        },
        PYTHON: {
            input: "n = 3",
            output: "3",
            explanation:
                "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
        },
        JAVA: {
            input: "n = 4",
            output: "5",
            explanation:
                "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
        },
    },
    codeSnippets: {
        JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
        PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
        JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
    },
    referenceSolution: {
        JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];

/* Alternative approach with O(1) space
let a = 1; // ways to climb 1 step
let b = 2; // ways to climb 2 steps

for (let i = 3; i <= n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

return n === 1 ? a : b;
*/
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
        PYTHON:
            `class Solution:
    def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n
      
      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2
      
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      
      return dp[n]
      
      # Alternative approach with O(1) space
      # a, b = 1, 2
      # 
      # for i in range(3, n + 1):
      #     a, b = b, a + b
      # 
      # return a if n == 1 else b

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
        JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }
      
      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      
      return dp[n];
      
      /* Alternative approach with O(1) space
      int a = 1; // ways to climb 1 step
      int b = 2; // ways to climb 2 steps
      
      for (int i = 3; i <= n; i++) {
          int temp = a + b;
          a = b;
          b = temp;
      }
      
      return n == 1 ? a : b;
      */
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
    },
};

const CreateProblemForm = () => {

    const [sampleType, setSampleType] = useState("DP");

    const navigation = useNavigate();

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            defaultValues: {
                testCases: [{ input: "", output: "" }],
                tags: [""],
                examples: {
                    JAVASCRIPT: { input: "", output: "", explanation: "" },
                    PYTHON: { input: "", output: "", explanation: "" },
                    JAVA: { input: "", output: "", explanation: "" },
                },
                codeSnippets: {
                    JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
                    PYTHON: "def solution():\n    # Write your code here\n    pass",
                    JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
                },
                referenceSolution: {
                    JAVASCRIPT: "// Add your reference solution here",
                    PYTHON: "# Add your reference solution here",
                    JAVA: "// Add your reference solution here",
                },
            }
        }
    })

    const {
        fields: testCaseFields,
        append: appendTestCase,
        remove: removeTestCase,
        replace: replacetestCases,
    } = useFieldArray({
        control,
        name: "testCases",
    })

    const {
        fields: tagFields,
        append: appendTag,
        remove: removeTag,
        replace: replaceTags,
    } = useFieldArray({
        control,
        name: "tags"
    })

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (value) => {
        try {
            setIsLoading(true);
            const res = await axiosInstance.post("/problems/create-problem", value);
            console.log(res.data);
            toast.success(res.data.message || "Problem Created Successfully 🔥");
            navigation("/")
        } catch (error) {
            console.log("Error while creating problem: ", error);
            toast.error("Error while creating problem!");
        } finally {
            setIsLoading(false);
        }

    }

    const loadSampleData = () => {
        const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;

        replaceTags(sampleData.tags?.map((tag) => tag));
        replaceTags(sampleData.testCases?.map((testcase) => testcase));

        // Reset the form with sample data
        reset(sampleData);
    }

    return (
        <div className='container mx-auto py-8 px-4 max-w-7xl'>
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-4 border-b">
                        <h2 className="card-title text-2xl md:text-3xl flex items-center gap-3">
                            <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                            Create Problem
                        </h2>

                        <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
                            <div className="join">
                                <button
                                    type="button"
                                    className={`btn join-item ${sampleType === "DP" ? "btn-active" : ""
                                        }`}
                                    onClick={() => setSampleType("array")}
                                >
                                    DP Problem
                                </button>
                                <button
                                    type="button"
                                    className={`btn join-item ${sampleType === "string" ? "btn-active" : ""
                                        }`}
                                    onClick={() => setSampleType("string")}
                                >
                                    String Problem
                                </button>
                            </div>
                            <button
                                type="button"
                                className="btn btn-secondary gap-2"
                                onClick={loadSampleData}
                            >
                                <Download className="w-4 h-4" />
                                Load Sample
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">
                                        Title
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full text-base md:text-lg"
                                    {...register("title")}
                                    placeholder="Enter problem title"
                                />
                                {errors.title && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.title.message}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control md:col-span-2">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">
                                        Description
                                    </span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered min-h-32 w-full text-base md:text-lg p-4 resize-y"
                                    {...register("description")}
                                    placeholder="Enter problem description"
                                />
                                {errors.description && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.description.message}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text text-base md:text-lg font-semibold">
                                        Difficulty
                                    </span>
                                </label>
                                <select
                                    className="select select-bordered w-full text-base md:text-lg"
                                    {...register("difficulty")}
                                >
                                    <option value="EASY">Easy</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HARD">Hard</option>
                                </select>
                                {errors.difficulty && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.difficulty.message}
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="card bg-base-200 p-4 md:p-6 shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Tags
                                </h3>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => appendTag("")}
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Tag
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tagFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            className="input input-bordered flex-1"
                                            {...register(`tags.${index}`)}
                                            placeholder="Enter tag"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-square btn-sm"
                                            onClick={() => removeTag(index)}
                                            disabled={tagFields.length === 1}
                                        >
                                            <Trash2 className="w-4 h-4 text-error" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.tags && (
                                <div className="mt-2">
                                    <span className="text-error text-sm">
                                        {errors.tags.message}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Test Cases */}
                        <div className="card bg-base-200 p-4 md:p-6 shadow-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Test Cases
                                </h3>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => appendTestCase({ input: "", output: "" })}
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Test Case
                                </button>
                            </div>
                            <div className="space-y-6">
                                {testCaseFields.map((field, index) => (
                                    <div key={field.id} className="card bg-base-100 shadow-md">
                                        <div className="card-body p-4 md:p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="text-base md:text-lg font-semibold">
                                                    Test Case #{index + 1}
                                                </h4>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-sm text-error"
                                                    onClick={() => removeTestCase(index)}
                                                    disabled={testCaseFields.length === 1}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" /> Remove
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-medium">
                                                            Input
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                                        {...register(`testCases.${index}.input`)}
                                                        placeholder="Enter test case input"
                                                    />
                                                    {errors.testCases?.[index]?.input && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.testCases[index].input.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-medium">
                                                            Expected Output
                                                        </span>
                                                    </label>
                                                    <textarea
                                                        className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                                        {...register(`testCases.${index}.output`)}
                                                        placeholder="Enter expected output"
                                                    />
                                                    {errors.testCases?.[index]?.output && (
                                                        <label className="label">
                                                            <span className="label-text-alt text-error">
                                                                {errors.testCases[index].output.message}
                                                            </span>
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.testCases && !Array.isArray(errors.testCases) && (
                                <div className="mt-2">
                                    <span className="text-error text-sm">
                                        {errors.testCases.message}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Code Editor Sections */}
                        <div className="space-y-8">
                            {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
                                <div
                                    key={language}
                                    className="card bg-base-200 p-4 md:p-6 shadow-md"
                                >
                                    <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                                        <Code2 className="w-5 h-5" />
                                        {language}
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Starter Code */}
                                        <div className="card bg-base-100 shadow-md">
                                            <div className="card-body p-4 md:p-6">
                                                <h4 className="font-semibold text-base md:text-lg mb-4">
                                                    Starter Code Template
                                                </h4>
                                                <div className="border rounded-md overflow-hidden">
                                                    <Controller
                                                        name={`codeSnippets.${language}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Editor
                                                                height="300px"
                                                                language={language.toLowerCase()}
                                                                theme="vs-dark"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                options={{
                                                                    minimap: { enabled: false },
                                                                    fontSize: 14,
                                                                    lineNumbers: "on",
                                                                    roundedSelection: false,
                                                                    scrollBeyondLastLine: false,
                                                                    automaticLayout: true,
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                {errors.codeSnippets?.[language] && (
                                                    <div className="mt-2">
                                                        <span className="text-error text-sm">
                                                            {errors.codeSnippets[language].message}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Reference Solution */}
                                        <div className="card bg-base-100 shadow-md">
                                            <div className="card-body p-4 md:p-6">
                                                <h4 className="font-semibold text-base md:text-lg mb-4 flex items-center gap-2">
                                                    <CheckCircle2 className="w-5 h-5 text-success" />
                                                    Reference Solution
                                                </h4>
                                                <div className="border rounded-md overflow-hidden">
                                                    <Controller
                                                        name={`referenceSolution.${language}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Editor
                                                                height="300px"
                                                                language={language.toLowerCase()}
                                                                theme="vs-dark"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                options={{
                                                                    minimap: { enabled: false },
                                                                    fontSize: 14,
                                                                    lineNumbers: "on",
                                                                    roundedSelection: false,
                                                                    scrollBeyondLastLine: false,
                                                                    automaticLayout: true,
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                                {errors.referenceSolution?.[language] && (
                                                    <div className="mt-2">
                                                        <span className="text-error text-sm">
                                                            {errors.referenceSolution[language].message}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Examples */}
                                        <div className="card bg-base-100 shadow-md">
                                            <div className="card-body p-4 md:p-6">
                                                <h4 className="font-semibold text-base md:text-lg mb-4">
                                                    Example
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">
                                                                Input
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            className="textarea textarea-bordered min-h-20 w-full p-3 resize-y"
                                                            {...register(`examples.${language}.input`)}
                                                            placeholder="Example input"
                                                        />
                                                        {errors.examples?.[language]?.input && (
                                                            <label className="label">
                                                                <span className="label-text-alt text-error">
                                                                    {errors.examples[language].input.message}
                                                                </span>
                                                            </label>
                                                        )}
                                                    </div>
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">
                                                                Output
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            className="textarea textarea-bordered min-h-20 w-full p-3 resize-y"
                                                            {...register(`examples.${language}.output`)}
                                                            placeholder="Example output"
                                                        />
                                                        {errors.examples?.[language]?.output && (
                                                            <label className="label">
                                                                <span className="label-text-alt text-error">
                                                                    {errors.examples[language].output.message}
                                                                </span>
                                                            </label>
                                                        )}
                                                    </div>
                                                    <div className="form-control md:col-span-2">
                                                        <label className="label">
                                                            <span className="label-text font-medium">
                                                                Explanation
                                                            </span>
                                                        </label>
                                                        <textarea
                                                            className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                                            {...register(`examples.${language}.explanation`)}
                                                            placeholder="Explain the example"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Additional Information */}
                        <div className="card bg-base-200 p-4 md:p-6 shadow-md">
                            <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-warning" />
                                Additional Information
                            </h3>
                            <div className="space-y-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Constraints</span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                        {...register("constraints")}
                                        placeholder="Enter problem constraints"
                                    />
                                    {errors.constraints && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                {errors.constraints.message}
                                            </span>
                                        </label>
                                    )}
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Hints (Optional)
                                        </span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                                        {...register("hints")}
                                        placeholder="Enter hints for solving the problem"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">
                                            Editorial (Optional)
                                        </span>
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered min-h-32 w-full p-3 resize-y"
                                        {...register("editorial")}
                                        placeholder="Enter problem editorial/solution explanation"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="card-actions justify-end pt-4 border-t">
                            <button type="submit" className="btn btn-primary btn-lg gap-2">
                                {isLoading ? (
                                    <span className="loading loading-spinner text-white"></span>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5" />
                                        Create Problem
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateProblemForm