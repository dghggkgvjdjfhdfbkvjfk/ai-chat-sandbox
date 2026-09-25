export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;
    
    // 从 Vercel 后台读取隐藏的环境变量（此处不填真实 Key，等会儿去 Vercel 填）
    const API_URL = process.env.MY_API_URL || 'https://api.deepseek.com/chat/completions';
    const API_KEY = process.env.MY_SECRET_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: '未配置 API Key，请去 Vercel 后台设置环境变量 MY_SECRET_API_KEY' });
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: req.body.model || 'deepseek-chat',
        messages: messages,
        stream: false
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('API 请求出错:', error);
    return res.status(500).json({ error: error.message });
  }
}
