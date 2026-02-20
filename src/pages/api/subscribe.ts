import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const POST: APIRoute = async ({ request }) => {
  const { name, email, answers } = await request.json();

  if (!name || !email) {
    return new Response(JSON.stringify({ error: 'Nombre y email requeridos' }), { status: 400 });
  }

  const resendKey = import.meta.env.RESEND_API_KEY;
  if (!resendKey) {
    return new Response(JSON.stringify({ error: 'Resend no configurado' }), { status: 500 });
  }

  const resend = new Resend(resendKey);
  const notificationEmail = import.meta.env.NOTIFICATION_EMAIL || 'beto@agentesparatunegocio.com';

  // Format answers for email
  const answersText = Object.entries(answers || {})
    .map(([key, val]) => `• ${key}: ${Array.isArray(val) ? (val as string[]).join(', ') : val}`)
    .join('\n');

  try {
    // Send notification to Beto
    await resend.emails.send({
      from: 'Quiz AgentesParaTuNegocio <quiz@agentesparatunegocio.com>',
      to: [notificationEmail],
      subject: `Nuevo lead del Quiz: ${name}`,
      text: `Nuevo lead del Quiz de Diagnóstico de IA\n\nNombre: ${name}\nEmail: ${email}\n\nRespuestas:\n${answersText}\n\n---\nDesde AgentesParaTuNegocio.com`,
      html: `
        <h2>Nuevo lead del Quiz de Diagnóstico</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <h3>Respuestas:</h3>
        <pre style="background:#f5f5f5;padding:16px;border-radius:8px;font-size:14px;">${answersText}</pre>
        <hr/>
        <p style="color:#999;font-size:12px;">Desde AgentesParaTuNegocio.com</p>
      `,
    });
  } catch (err) {
    console.error('Error sending notification:', err);
    // Don't block the user flow if email fails
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
