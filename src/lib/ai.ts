
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function chatWithAI(messages: Message[]) {
  const apiKey = import.meta.env.VITE_ZHIPU_API_KEY || '';
  
  if (!apiKey) {
    throw new Error('ZHIPU_API_KEY is not configured in environment variables');
  }

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Zhipu AI:', error);
    throw error;
  }
}
