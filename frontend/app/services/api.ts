const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface GenerateFromTextResponse {
  success: boolean;
  message?: string;
}

export async function generateFromText(text: string): Promise<Blob> {
  try {
    const response = await fetch(`${API_BASE_URL}/gen-text/manim-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_KEY}`,
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error generating from text:', error);
    throw error;
  }
}

export async function generateFromFile(file: File): Promise<Blob> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/gen-file/manim-video`, {
      method: 'POST',
      body: formData,
      headers:{
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error generating from file:', error);
    throw error;
  }
}
