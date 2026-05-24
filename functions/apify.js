exports.handler = async function(event) {
  const APIFY_KEY = process.env.APIFY_KEY;
  const body = JSON.parse(event.body || '{}');
  const asin = body.asin || '';

  if (!asin) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'No ASIN provided' })
    };
  }

  try {
    const url = 'https://api.apify.com/v2/acts/junglee~free-amazon-product-scraper/run-sync-get-dataset-items?token=' + APIFY_KEY + '&timeout=45&memory=256';

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        startUrls: [{ url: 'https://www.amazon.com/dp/' + asin }],
        maxItems: 1
      })
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Apify error ' + response.status })
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

  } catch(e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
