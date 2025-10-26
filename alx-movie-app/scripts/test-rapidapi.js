const fs = require('fs');
const path = require('path');
const fetch = globalThis.fetch || require('node-fetch');

(async function(){
  try{
    const envPath = path.join(__dirname, '..', '.env.local');
    const raw = fs.readFileSync(envPath, 'utf8').trim();
    const key = raw.replace(/^MOVIE_API_KEY\s*=\s*/,'');
    if(!key){
      console.error('No API key found in .env.local');
      process.exit(2);
    }
    console.log('MOVIE_API_KEY present:', !!key, 'maskedPrefix:', key.slice(0,4).replace(/./g,'*') + '...');

    const url = 'https://moviesdatabase.p.rapidapi.com/titles/series/23/3';
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': key,
        'x-rapidapi-host': 'moviesdatabase.p.rapidapi.com'
      }
    });

    console.log('Upstream status:', resp.status);
    const text = await resp.text();
    console.log('Upstream body preview (first 400 chars):\n', text.slice(0,400));
  }catch(err){
    console.error('Error testing RapidAPI:', err.message || err);
    process.exit(1);
  }
})();
