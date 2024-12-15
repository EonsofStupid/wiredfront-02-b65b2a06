import { generateGeminiResponse } from "./providers/gemini.ts";
import { generateOpenAIResponse } from "./providers/openai.ts";
import { generateAnthropicResponse } from "./providers/anthropic.ts";

export const generateAIResponse = async (prompt: string) => {
  console.log('Generating AI response for prompt:', prompt);
  
  // Try different AI providers in order of preference
  try {
    console.log('Attempting Gemini response');
    return await generateGeminiResponse(prompt);
  } catch (error) {
    console.error('Gemini error:', error);
    try {
      console.log('Attempting OpenAI response');
      return await generateOpenAIResponse(prompt);
    } catch (error) {
      console.error('OpenAI error:', error);
      try {
        console.log('Attempting Anthropic response');
        return await generateAnthropicResponse(prompt);
      } catch (error) {
        console.error('Anthropic error:', error);
        throw new Error('All AI providers failed to generate a response');
      }
    }
  }
};