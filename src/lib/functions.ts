import { Store } from '@netlify/blobs';

export async function storeResponse(store: Store, key: string, stream: ReadableStream) {
  const reader = stream.getReader();
  let finalResult = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      finalResult += new TextDecoder().decode(value);
    }
    await store.set(key, finalResult);
  } catch (error) {
    console.error('Error processing stream:', error);
  }
}
