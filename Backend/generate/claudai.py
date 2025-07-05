import anthropic
import json

client = anthropic.Anthropic()

system_prompt = '''
You are an expert React developer.

Generate a React project with multiple components ONLY IF NECESSARY, styled using Tailwind CSS. Each component should be self-contained and live in its own file. Ensure proper imports(case sensitive and include .js extention) do not import any third party library except react itself and default exports.
Remember, dark theme, unless otherwise mentioned

Make sure all main components (like game boards, cards, etc.) are large, centered, and responsive. Use Tailwind classes like w-full, h-full, min-h-screen, flex-1, max-w-4xl, and aspect-square as appropriate.
Feel free to create svgs
Respond ONLY with a JSON object like this:

{
  "entry": "App.js",
  "files": {
    "App.js": "// code here",
    "Component1.js": "// code here",
    "Component2.js": "// code here"
  }
}

Example file structure:
- App.js: the main component that imports and renders others
- Other components: reusable UI parts (like GameBoard, ScorePanel, etc.)

Do not include explanations, markdown code blocks, or anything outside the JSON.
'''

def ask_claude(prompt: str) -> str:
    message = client.messages.create(
        model="claude-3-7-sonnet-20250219",
        max_tokens=10000,
        temperature=1,
        system= system_prompt,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    )
    print(message.content[0].text)
    return message.content[0].text


