import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GeneratedPage({ projectFiles, Component, setCompiledComponent }) {
  const navigate = useNavigate();
  const [refinePrompt, setRefinePrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState(null);

  const handleRefinePrompt = async () => {
    if (!refinePrompt.trim()) return;
    setIsRefining(true);
    setRefineError(null);
    try {
      const res = await fetch("http://localhost:3001/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: refinePrompt,
          files: projectFiles
        })
      });
      const data = await res.json();
      if (!data.files) throw new Error("No updated files returned.");
      // TODO: Recompile with new files (not implemented here)
      alert("Refinement received. TODO: Recompile the new files.");
    } catch (e) {
      setRefineError(e.message);
    } finally {
      setIsRefining(false);
      setRefinePrompt("");
    }
  };

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-blue-300 font-bold">
        No component compiled. Please go back and generate again.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-black relative">
      {/* Render the generated component full screen */}
      <div className="absolute inset-0 w-full h-full overflow-auto">
        <Component />
      </div>
      {/* Floating, blurred, rounded bottom overlay for refinement prompt */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-50 max-w-2xl w-[95vw] bg-black/80 backdrop-blur-lg rounded-2xl shadow-2xl flex items-center px-6 py-4 gap-4">
        {/* W E B I N I branding with beta */}
        <button
          onClick={() => {
            setCompiledComponent(null);
            navigate("/");
          }}
          className="flex items-end text-blue-400 hover:text-blue-300 focus:outline-none mr-4 group"
          title="Home"
        >
          <span className="text-2xl font-bold tracking-widest group-hover:text-blue-200 transition">W E B I N I</span>
          <span className="ml-2 text-xs align-bottom text-blue-300 group-hover:text-blue-100 transition">beta</span>
        </button>
        {/* Refinement prompt input */}
        <input
          type="text"
          value={refinePrompt}
          onChange={e => setRefinePrompt(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !isRefining) handleRefinePrompt();
          }}
          className="flex-1 bg-black/80 border border-blue-500 rounded px-4 py-2 text-blue-200 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
          placeholder="Refine this page (e.g., Add a dark mode toggle)"
          disabled={isRefining}
        />
        <button
          onClick={handleRefinePrompt}
          disabled={isRefining}
          className="ml-2 bg-blue-500 hover:bg-blue-400 text-black font-bold px-5 py-2 rounded shadow transition disabled:opacity-50"
        >
          Refine
        </button>
        {refineError && <p className="text-red-400 ml-4">❌ {refineError}</p>}
      </div>
    </div>
  );
}
