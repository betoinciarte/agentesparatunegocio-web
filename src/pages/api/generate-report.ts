import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';

export const POST: APIRoute = async ({ request }) => {
  const { prompt } = await request.json();

  if (!prompt) {
    return new Response(JSON.stringify({ error: 'Prompt requerido' }), { status: 400 });
  }

  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key no configurada' }), { status: 500 });
  }

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 1200,
          messages: [{ role: 'user', content: prompt }],
        });

        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const data = JSON.stringify({ delta: { text: event.delta.text } });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        const errorData = JSON.stringify({ error: 'Error generando reporte' });
        controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
};
