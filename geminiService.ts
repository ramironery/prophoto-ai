
import { GoogleGenAI } from "@google/genai";

export async function transformImage(base64Image: string, mimeType: string): Promise<string> {
  // Use a fresh instance to ensure the most up-to-date API key (relevant if we were using user-provided keys)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Transform this person's appearance into a high-end professional headshot suitable for LinkedIn and GitHub.
    Key requirements:
    1. Replace current clothing with a perfectly tailored, sharp, and modern professional business suit (terno bem alinhado).
    2. Adjust the body posture to be upright, centered, and professional.
    3. Use professional studio lighting to enhance facial details.
    4. Change the background to a clean, slightly blurred professional office environment or a sophisticated solid neutral color.
    5. CRITICAL: Maintain the person's facial identity and features exactly. 
    6. Ensure the result is high resolution and looks like a real photograph.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1], // Remove metadata prefix if present
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image part found in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
