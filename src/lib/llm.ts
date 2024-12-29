import { MessageStream } from '@anthropic-ai/sdk/lib/MessageStream';

export enum AnthropicModel {
  CLAUDE_3_HAIKU = 'claude-3-haiku-20240307',
  CLAUDE_3_5_HAIKU = 'claude-3-5-haiku-20241022',
  CLAUDE_3_5_SONNET = 'claude-3-5-sonnet-20241022',
}

export function asSseStream(stream: MessageStream) {
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of stream) {
          const text = chunk.delta?.text || '';
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
          }
        }
      } catch (error) {
        console.error('Stream error:', error);
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });
}

export function simulateTokenGeneration(eventStream: string) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const [delayMin, delayMax] = [10, 25]; // Random delay between 10-25ms per "token"

  // Process in the background
  (async () => {
    const chunks = eventStream.split(' ');
    const encoder = new TextEncoder();
    for (const chunk of chunks) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * (delayMax - delayMin) + delayMin));
      await writer.write(encoder.encode(chunk + ' '));
    }
    await writer.close();
  })();

  return stream.readable;
}
