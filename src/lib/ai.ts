
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function chatWithAI(messages: Message[]) {
  const apiKey = '09a0e2fad3a64918a0267b1364db9b36.LUT1n64rDgDZAmv7';
  
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
