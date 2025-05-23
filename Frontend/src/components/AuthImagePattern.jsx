"use client"

import { Code, Terminal, FileCode, Braces } from "lucide-react"
import { useEffect, useState } from "react"



const AuthImagePattern = ({ title, subTitle }) => {
    const [activeIndex, setActiveIndex] = useState(0)

    // Code snippets to display in the background
    const codeSnippets = [
        `function twoSum(nums, target) {
            const map = new Map();
            for (let i = 0; i < nums.length; i++) {
                const complement = target - nums[i];
                if (map.has(complement)) {
                    return [map.get(complement), i];
                }
                map.set(nums[i], i);
            }
            return [];
        }`,
        `class ListNode {
            constructor(val = 0, next = null) {
            this.val = val;
            this.next = next;
        }

        function reverseList(head) {
            let prev = null;
            let current = head;
            while (current) {
                const next = current.next;
                current.next = prev;
                prev = current;
                current = next;
            }
            return prev;
        }`,
        `function isValid(s) {
            const stack = [];
            const map = { '(': ')', '{': '}', '[': ']' };
    
            for (let i = 0; i < s.length; i++) {
                if (s[i] in map) {
                stack.push(s[i]);
                } else {
                const last = stack.pop();
                if (map[last] !== s[i]) return false;
                }
            }
            return stack.length === 0;
        }`,
    ]

    // Rotate through code snippets
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % codeSnippets.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [codeSnippets.length])

    return (
        <div className="w-lg hidden lg:flex flex-col items-center justify-center bg-slate-900 text-white p-12 relative overflow-hidden">

            {/* Text content */}
            <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
            <p className="text-slate-300 text-center mb-8">{subTitle}</p>

            <div className="z-10 w-[485px] h-fit flex flex-col items-center">
                {/* Code editor mockup */}
                <div className="w-full bg-slate-800 rounded-lg shadow-xl overflow-hidden">
                    {/* Editor header */}
                    <div className="bg-slate-700 px-4 py-2 flex items-center">
                        <div className="flex space-x-2 mr-4">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-xs font-mono opacity-70">problem.js</div>
                    </div>

                    {/* Code content */}
                    <div className="p-4 font-mono text-xs sm:text-sm overflow-hidden relative h-64">
                        <pre className="whitespace-pre-wrap text-green-400 transition-opacity duration-1000">
                            {codeSnippets[activeIndex]}
                        </pre>

                        {/* Blinking cursor */}
                        <div className="absolute bottom-4 right-4 w-2 h-4 bg-white animate-blink"></div>
                    </div>
                </div>




            </div>
        </div>
    )
}

export default AuthImagePattern