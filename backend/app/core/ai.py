import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# We use the fast versatile model
MODEL = "llama-3.1-70b-versatile"

def generate_flashcards(text: str) -> list:
    """Generates a list of flashcards from text."""
    prompt = f"""
    You are an expert tutor. Based on the following text, create 5-10 high-quality flashcards.
    Each flashcard should have a topic, category, title, content (the back of the card, brief explanation), 
    a question (for the back of the card MCQ), 4 options for the MCQ, and the correctAnswerId ('a', 'b', 'c', or 'd').

    Respond ONLY with a valid JSON array of objects, with no markdown formatting around it.
    Example schema for one object:
    {{
        "id": "gen-1",
        "topic": "Topic Name",
        "category": "Category Name",
        "title": "Card Title",
        "content": "Explanation text.",
        "relatedCardId": null,
        "question": "MCQ Question?",
        "options": [
            {{"id": "a", "text": "Option A"}},
            {{"id": "b", "text": "Option B"}},
            {{"id": "c", "text": "Option C"}},
            {{"id": "d", "text": "Option D"}}
        ],
        "correctAnswerId": "a"
    }}

    Text:
    {text[:8000]} # Limit text length for token limits
    """

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model=MODEL,
        response_format={"type": "json_object"}, 
        # Groq currently requires json_object to return an object. 
        # Let's wrap the array in an object {"flashcards": [...]} to be safe.
    )
    # Wait, the prompt asks for an array. Let's fix the prompt to ask for an object with a 'flashcards' key.
    pass

def generate_flashcards_safe(text: str) -> list:
    prompt = f"""
    You are an expert tutor. Based on the following text, create 5-10 high-quality flashcards.
    Each flashcard should have a topic, category, title, content (the back of the card, brief explanation), 
    a question (for the back of the card MCQ), 4 options for the MCQ, and the correctAnswerId ('a', 'b', 'c', or 'd').

    Respond ONLY with a valid JSON object containing a "flashcards" array.
    Example schema:
    {{
      "flashcards": [
        {{
            "id": "gen-1",
            "topic": "Topic Name",
            "category": "Category Name",
            "title": "Card Title",
            "content": "Explanation text.",
            "relatedCardId": null,
            "question": "MCQ Question?",
            "options": [
                {{"id": "a", "text": "Option A"}},
                {{"id": "b", "text": "Option B"}},
                {{"id": "c", "text": "Option C"}},
                {{"id": "d", "text": "Option D"}}
            ],
            "correctAnswerId": "a"
        }}
      ]
    }}

    Text:
    {text[:8000]}
    """

    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=MODEL,
        response_format={"type": "json_object"}, 
    )
    
    result = json.loads(chat_completion.choices[0].message.content)
    return result.get("flashcards", [])

def generate_summary(text: str) -> str:
    prompt = f"""
    You are an expert summarizer. Provide a concise, well-structured summary of the following text.
    Use markdown formatting (headings, bullet points, bold text) to make it highly readable.
    
    Text:
    {text[:8000]}
    """
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=MODEL,
    )
    return chat_completion.choices[0].message.content

def generate_qa(text: str) -> list:
    prompt = f"""
    You are an expert examiner. Based on the following text, create a quiz of 15 questions.
    Each question should have 4 options and specify the correct answer.

    Respond ONLY with a valid JSON object containing a "quiz" array.
    Example schema:
    {{
      "quiz": [
        {{
            "id": "q-1",
            "question": "Question text?",
            "options": [
                {{"id": "a", "text": "Option A"}},
                {{"id": "b", "text": "Option B"}},
                {{"id": "c", "text": "Option C"}},
                {{"id": "d", "text": "Option D"}}
            ],
            "correctAnswerId": "b"
        }}
      ]
    }}

    Text:
    {text[:8000]}
    """
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=MODEL,
        response_format={"type": "json_object"}, 
    )
    
    result = json.loads(chat_completion.choices[0].message.content)
    return result.get("quiz", [])
