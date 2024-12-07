const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const RENDER_BASE_URL = process.env.NEXT_PUBLIC_RENDER_URL || 'http://localhost:3001';

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

export async function generateFromTextInfographic(text: string): Promise<object> {
  try {
    const response = await fetch(`${API_BASE_URL}/gen-text/infographic`, {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating from text:', error);
    throw error;
  }
}

export async function generateFromFileInfographic(file: File): Promise<object> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/gen-file/infographic`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating from file:', error);
    throw error;
  }
}

export async function generateFromTextRemotion(text: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/gen-text/remotion-code`, {
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

    const data = await response.json();
    return data.code;
  } catch (error) {
    console.error('Error generating from text with Remotion:', error);
    throw error;
  }
}

export async function generateFromFileRemotion(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/gen-file/remotion-code`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.code;
  } catch (error) {
    console.error('Error generating from file with Remotion:', error);
    throw error;
  }
}

export async function renderVideo(inputProps: any): Promise<void> {
  try {
    const response = await fetch(`${RENDER_BASE_URL}/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputProps),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rendered-video.mp4'; // Set the download filename
    
    // Append to body, click and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error rendering video:', error);
    throw error;
  }
}
