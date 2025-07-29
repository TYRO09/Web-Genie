import React, { useState, useEffect } from 'react';
import Load from './Load';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/themes/prism-okaidia.css';
import { useNavigate } from "react-router-dom";
import { ensureEsbuildInitialized } from './scripts/esinit';
import * as esbuild from 'esbuild-wasm';
import createVirtualFsPlugin from './scripts/virtualfs'; // We'll create this
import App from './App';



export default function MainPage({ setProjectFiles, setCompiledComponent }) {
  const [devMode, setDevMode] = useState(false);
  const [code, setLocalCode] = useState(""); // For devMode editor
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
    useEffect(() => {
    ensureEsbuildInitialized();
}, []);

  // You should pass compileJSX as a prop or import it here if needed

const handleGenerate = async (prompt) => {
  try {
    setLoading(true);
    setError(null);

    const res = await fetch("http://localhost:3001/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    
    const data = await res.json();
    console.log(data);
    // if (!data.files) {
    //   throw new Error("No valid component files received");
    // }

    const entry =  "App.js";
    // const files = data.files;

    setProjectFiles(data);

    const result = await esbuild.build({
      entryPoints: [entry],
      bundle: true,
      write: false,
      format: 'iife',
      globalName: 'GeneratedComponent',
      platform: 'browser',
      plugins: [createVirtualFsPlugin(data)],
      external: ['react', 'react-dom', 'react-router-dom']
    });

    let outputCode = result.outputFiles[0].text;

    // Patch dynamic require for React/ReactDOM to use globals
    outputCode = outputCode
      .replace(/__require\(["']react["']\)/g, 'window.React')
      .replace(/__require\(["']react-dom["']\)/g, 'window.ReactDOM');

    // Ensure the generated component is assigned to window
    outputCode += '\nwindow.GeneratedComponent = GeneratedComponent;';

    console.log('Patched output code:', outputCode);

    eval(outputCode); // Defines window.GeneratedComponent
    const Component = window.GeneratedComponent?.default || window.GeneratedComponent;

    setCompiledComponent(() => Component);
    navigate("/generated");

  } catch (e) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-black">
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-10 left-0 opacity-90 w-full h-full object-cover z-0"
      >
        <source src="/brain.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    <div className="absolute top-20 left-16 z-10 bg-black/60 text-white px-4 py-1 rounded shadow text-lg tracking-wide">
        an IITK Consulting Group project
      </div>
      {/* Left-aligned overlay content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-screen pl-20 max-w-xl">
        <h3 className="text-6xl text-white mb-8 drop-shadow-lg">
          W E B I N I <span className="text-xl align-bottom ml-2 text-gray-300">beta</span>
            </h3>
        <button onClick={() => setDevMode(!devMode)} className="fixed top-4 right-4 z-50">
          +++
        </button>
        {loading && <Load />}
        {devMode && (
          <div className="fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg z-40 p-4 overflow-y-auto transition-transform">
            <h2 className="text-lg font-bold mb-2">Edit Component Code</h2>
            <Editor
              value={code}
              onValueChange={setLocalCode}
              highlight={code => Prism.highlight(code, Prism.languages.jsx, 'jsx')}
              padding={10}
              className="text-sm font-mono bg-gray-100 border rounded"
            />
            {/* Add Save & Apply logic if needed */}
          </div>
        )}
        <div className="my-4 text-white w-full max-w-xl">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="border-0 border-b-2 border-gray-400 p-2 rounded-none w-full bg-transparent text-white focus:outline-none focus:border-blue-400"
            placeholder="Describe the page you want..."
            onKeyDown={e => {
              if (e.key === "Enter" && !loading) handleGenerate(prompt);
            }}
            disabled={loading}
          />
        </div>
        {error && <p className="text-red-500">❌ {error}</p>}
      </div>
    </div>
  );
}