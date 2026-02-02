const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const extractGolfData = async (userInput) => {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are a golf data extraction assistant. Extract the following information from user input and return ONLY valid JSON (no markdown, no code blocks, just raw JSON):
{
  "date": "ISO date string (YYYY-MM-DD), default to today if not specified",
  "time": "HH:MM format (24-hour), null if not specified",
  "course": "golf course name",
  "green_fee": number (in dollars, null if not specified),
  "caddy_fee": number (in dollars, null if not specified),
  "wagers": number (positive for winnings, negative for losses, null if not specified),
  "score": number (golf score, null if not specified)
}

Course Name Recognition:
- Home course: 牧马山 (recognize as "牧马山" if user says: mumashan, 牧马山, home course, home)
- Other courses and their variations:
  * 麓山: lushan, 麓山
  * 青城山: qingchengshan, 青城山
  * 观岭: guanling, 观岭
  * 保利: baoli, 保利

Always normalize course names to Chinese characters (牧马山, 麓山, 青城山, 观岭, 保利).

If any information is missing or unclear, use null for that field. Today's date is ${new Date().toISOString().split('T')[0]}.`
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to extract golf data');
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();

    let extractedData;
    try {
      extractedData = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('AI returned invalid data format');
    }

    // Auto-populate current time if not specified
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    return {
      success: true,
      data: {
        date: extractedData.date || new Date().toISOString().split('T')[0],
        time: extractedData.time || currentTime,
        course: extractedData.course || '',
        green_fee: extractedData.green_fee || 0,
        caddy_fee: extractedData.caddy_fee || 0,
        wagers: extractedData.wagers || 0,
        score: extractedData.score || 0,
        raw_input: userInput
      }
    };
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    return {
      success: false,
      error: error.message || 'Failed to process input'
    };
  }
};
