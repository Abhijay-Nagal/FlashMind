const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Backend request failed");
  }

  return response.json();
}

export async function generateFlashcards(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/api/generate/flashcards`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to generate flashcards");
  return response.json();
}

export async function generateSummary(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/api/generate/summary`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to generate summary");
  return response.json();
}

export async function generateQA(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${API_BASE_URL}/api/generate/qa`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to generate Q/A");
  return response.json();
}