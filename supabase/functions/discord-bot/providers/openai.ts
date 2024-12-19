export const generateOpenAIResponse = async (prompt: string) => {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OpenAI API key not found');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful Discord bot assistant.' },
        { role: 'user', content: prompt }
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
};