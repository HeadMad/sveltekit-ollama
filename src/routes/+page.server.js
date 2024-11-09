import { dev } from '$app/environment';
// import { BOT_TOKEN, WEB_APP_URL } from '$env/static/private';

export async function load({ fetch, url }) {




  return {
    ok: true,
    result: {
    }
  }
}



export const actions = {
  default: async ({ request, fetch }) => {

    const formData = await request.formData();
    const prompt = formData.get('prompt');

    const urlGenerate = 'http://localhost:11434/api/generate';

    const response = await fetch(urlGenerate, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3.1:8b',
        prompt: prompt.trim(),
        // suffix: "    return result",
        options: {
          // temperature: 0
        },
        stream: false,
      })
    });

    return {
      chunks: response.body
    };

  }
};