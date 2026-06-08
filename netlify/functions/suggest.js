exports.handler = async function (event) {
  const q = event.queryStringParameters?.q || '';
  if (!q) {
    return { statusCode: 400, body: JSON.stringify({ error: 'missing q' }) };
  }

  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=zh-TW&q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const suggestions = Array.isArray(data) && Array.isArray(data[1]) ? data[1] : [];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ suggestions }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
