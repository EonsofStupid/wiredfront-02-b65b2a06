import { generateGeminiResponse } from "./providers/gemini.ts";
import { generateOpenAIResponse } from "./providers/openai.ts";
import { generateAnthropicResponse } from "./providers/anthropic.ts";

export const generateAIResponse = async (prompt: string) => {
  // Try different AI providers in order of preference
  try {
    return await generateGeminiResponse(prompt);
  } catch (error) {
    console.error('Gemini error:', error);
    try {
      return await generateOpenAIResponse(prompt);
    } catch (error) {
      console.error('OpenAI error:', error);
      try {
        return await generateAnthropicResponse(prompt);
      } catch (error) {
        console.error('Anthropic error:', error);
        throw new Error('All AI providers failed');
      }
    }
  }
};