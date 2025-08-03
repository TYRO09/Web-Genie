# web genie codes

## Setup

Open terminal 1
```
cd Frontend
npm i 
npm run dev
```

Open terminal 2
```
cd Backend
uvicorn main:app --port 3001 --reload
```


## Version History


Current Version: v1.2

Features
- Implemented agentic recursive loop for validation using pseudo-compile tool
- Refinement pipeline incorporated to improve via human-in-the-loop concept
- Improved styling issues by precomputing tailwind classes

Previous Version: v1.1

Features
- Significantly improved home UI and theme
- Generated page incorporated with an overlay to refine page
- Virtual file system implemented to sandbox and generate multiple components together

Previous Version: v1

Features
- Well designed loading and home page UI
- Claude API connected for backend
- Organized file structure

Previous Version: v0

Features
- LLM connected using github API
- Base webpage using react+vite template
- Connected makeshift backend to frontend to take in prompts and generate components