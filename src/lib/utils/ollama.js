export async function request(url, params, fetch) {
  let streamHandler = typeof params.stream === 'function' ? params.stream : null;
  params.stream = Boolean(params.stream);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok)
    throw new Error(response.statusText);

  if (!params.stream)
    return await response.json();

  const chunks = [];
  const decoder = new TextDecoder();

  if (!streamHandler) {
    for await (const chunk of response.body)
      chunks.push(JSON.parse(decoder.decode(chunk)));

    return chunks;
  }

  const aborter = new AbortController();

  for await (let chunk of response.body) {
    chunk = JSON.parse(decoder.decode(chunk));
    let abort = () => aborter.abort();
    chunks.push(streamHandler(chunk, abort));
    if (aborter.signal.aborted) break;
  }

  return chunks;
}


export default function (props = {}) {
  const {
    host = 'http://localhost:11434',
    model = 'llama3.1:8b',
    fetchReq = fetch,
  } = props;

  return new Proxy({}, {
    get(target, prop) {
      return (params) => request(host + '/api/' + prop, { model, ...params }, fetchReq)
    }
  });
};