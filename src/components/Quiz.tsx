import { useState, useRef, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionType = 'single' | 'multi';

interface Option {
  value: string;
  label: string;
  icon?: string;
  promptText: string;
}

interface Question {
  id: string;
  question: string;
  subtitle: string;
  type: QuestionType;
  options: Option[];
}

type Answers = Record<string, string | string[]>;

// ─── Questions Data ────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: 'business_type',
    question: '¿A qué se dedica tu negocio?',
    subtitle: 'Selecciona la opción más cercana.',
    type: 'single',
    options: [
      { value: 'coaching_consulting', label: 'Coaching o consultoría', icon: '🎯', promptText: 'coaching o consultoría' },
      { value: 'agency', label: 'Agencia de marketing o creativa', icon: '📣', promptText: 'agencia de marketing' },
      { value: 'professional_services', label: 'Servicios profesionales (contabilidad, legal, salud)', icon: '⚖️', promptText: 'servicios profesionales' },
      { value: 'home_services', label: 'Servicios e instalaciones (remodelación, mantenimiento, etc.)', icon: '🔧', promptText: 'servicios e instalaciones' },
      { value: 'ecommerce', label: 'E-commerce o retail', icon: '🛒', promptText: 'e-commerce' },
      { value: 'education', label: 'Formación o cursos online', icon: '📚', promptText: 'formación online' },
      { value: 'other', label: 'Otro tipo de negocio', icon: '💼', promptText: 'negocio de servicios' },
    ],
  },
  {
    id: 'team_size',
    question: '¿Cuántas personas trabajan en tu negocio?',
    subtitle: 'Inclúyete a ti.',
    type: 'single',
    options: [
      { value: 'solo', label: 'Solo yo', icon: '1️⃣', promptText: 'solopreneur' },
      { value: 'small', label: '2 a 5 personas', icon: '👥', promptText: 'equipo de 2-5' },
      { value: 'medium', label: '6 a 15 personas', icon: '👨‍👩‍👧‍👦', promptText: 'equipo de 6-15' },
      { value: 'larger', label: 'Más de 15', icon: '🏢', promptText: 'equipo de 15+' },
    ],
  },
  {
    id: 'weekly_hours',
    question: '¿Cuántas horas a la semana le dedicas a tu negocio?',
    subtitle: 'Sé honesto. Nadie te está juzgando.',
    type: 'single',
    options: [
      { value: 'under_40', label: 'Menos de 40 horas', icon: '😌', promptText: 'menos de 40h/semana' },
      { value: '40_50', label: '40 a 50 horas', icon: '😐', promptText: '40-50h/semana' },
      { value: '50_60', label: '50 a 60 horas', icon: '😓', promptText: '50-60h/semana' },
      { value: 'over_60', label: 'Más de 60 horas', icon: '🔥', promptText: 'más de 60h/semana' },
    ],
  },
  {
    id: 'time_drains',
    question: '¿Qué tareas te quitan más tiempo cada semana?',
    subtitle: 'Selecciona todas las que apliquen.',
    type: 'multi',
    options: [
      { value: 'content', label: 'Crear contenido (posts, emails, textos)', promptText: 'crear contenido' },
      { value: 'proposals', label: 'Hacer propuestas y cotizaciones', promptText: 'propuestas y cotizaciones' },
      { value: 'client_comms', label: 'Responder mensajes y consultas de clientes', promptText: 'responder consultas de clientes' },
      { value: 'quality_review', label: 'Revisar el trabajo de mi equipo', promptText: 'revisar trabajo del equipo' },
      { value: 'admin', label: 'Tareas administrativas y reportes', promptText: 'tareas administrativas' },
      { value: 'marketing', label: 'Marketing y publicidad', promptText: 'marketing y publicidad' },
      { value: 'sales', label: 'Seguimiento de ventas y prospectos', promptText: 'seguimiento de ventas' },
      { value: 'onboarding', label: 'Entrenar gente nueva', promptText: 'entrenar gente nueva' },
    ],
  },
  {
    id: 'frustration',
    question: 'Si pudieras dejar de hacer UNA cosa en tu negocio, ¿cuál sería?',
    subtitle: 'Esa tarea que te drena la energía aunque sabes que es necesaria.',
    type: 'single',
    options: [
      { value: 'repetitive_comms', label: 'Responder las mismas preguntas una y otra vez', icon: '🔄', promptText: 'responder las mismas preguntas repetidamente' },
      { value: 'content_creation', label: 'Crear contenido desde cero cada vez', icon: '✍️', promptText: 'crear contenido desde cero' },
      { value: 'quality_control', label: 'Ser el filtro de calidad de todo', icon: '🔍', promptText: 'ser el filtro de calidad de todo' },
      { value: 'follow_ups', label: 'Hacer seguimiento a prospectos y clientes', icon: '📞', promptText: 'hacer seguimiento a prospectos' },
      { value: 'reporting', label: 'Armar reportes y documentos', icon: '📊', promptText: 'armar reportes y documentos' },
      { value: 'everything', label: 'Honestamente... casi todo. Quiero enfocarme solo en lo estratégico', icon: '💭', promptText: 'casi todo — quiere enfocarse solo en lo estratégico' },
    ],
  },
  {
    id: 'ai_usage',
    question: '¿Cómo usas inteligencia artificial hoy?',
    subtitle: 'No hay respuesta incorrecta.',
    type: 'single',
    options: [
      { value: 'never', label: 'No la uso', icon: '🚫', promptText: 'no usa IA' },
      { value: 'basic', label: 'Uso ChatGPT para preguntas sueltas', icon: '💬', promptText: 'usa ChatGPT básico' },
      { value: 'regular', label: 'La uso regularmente pero siento que no le saco provecho', icon: '🤔', promptText: 'usa IA pero siente que no le saca provecho' },
      { value: 'advanced', label: 'La uso bastante y quiero llevarla al siguiente nivel', icon: '🚀', promptText: 'usa IA regularmente y quiere el siguiente nivel' },
    ],
  },
  {
    id: 'tools_spend',
    question: '¿Cuánto pagas al mes en herramientas digitales?',
    subtitle: 'Canva, herramientas de email, CRM, diseño, escritura IA, etc.',
    type: 'single',
    options: [
      { value: 'under_50', label: 'Menos de $50/mes', icon: '$', promptText: 'menos de $50/mes' },
      { value: '50_150', label: '$50 a $150/mes', icon: '$$', promptText: '$50-150/mes' },
      { value: '150_300', label: '$150 a $300/mes', icon: '$$$', promptText: '$150-300/mes' },
      { value: 'over_300', label: 'Más de $300/mes', icon: '$$$$', promptText: 'más de $300/mes' },
    ],
  },
  {
    id: 'client_acquisition',
    question: '¿Cómo llegan los clientes a tu negocio hoy?',
    subtitle: 'Selecciona las principales.',
    type: 'multi',
    options: [
      { value: 'referrals', label: 'Referidos y boca a boca', promptText: 'referidos' },
      { value: 'social_media', label: 'Redes sociales (orgánico)', promptText: 'redes sociales orgánicas' },
      { value: 'paid_ads', label: 'Publicidad pagada (Google, Meta, etc.)', promptText: 'publicidad pagada' },
      { value: 'seo', label: 'Búsqueda en Google (SEO)', promptText: 'SEO' },
      { value: 'networking', label: 'Networking y eventos', promptText: 'networking' },
      { value: 'cold_outreach', label: 'Prospección en frío', promptText: 'prospección en frío' },
      { value: 'marketplace', label: 'Plataformas y marketplaces', promptText: 'marketplaces' },
    ],
  },
  {
    id: 'content_frequency',
    question: '¿Con qué frecuencia publicas contenido para tu negocio?',
    subtitle: 'Posts, emails, videos, artículos — todo cuenta.',
    type: 'single',
    options: [
      { value: 'rarely', label: 'Casi nunca — sé que debería, pero no tengo tiempo', icon: '😬', promptText: 'casi nunca publica' },
      { value: 'inconsistent', label: 'Cuando puedo, pero es inconsistente', icon: '📉', promptText: 'publica inconsistentemente' },
      { value: 'weekly', label: '1-3 veces por semana', icon: '📈', promptText: '1-3 veces por semana' },
      { value: 'daily', label: 'Casi todos los días', icon: '🔥', promptText: 'casi todos los días' },
    ],
  },
  {
    id: 'dream',
    question: 'Si la IA te liberara 10 horas a la semana, ¿qué harías con ese tiempo?',
    subtitle: 'Última pregunta. La más importante.',
    type: 'single',
    options: [
      { value: 'growth', label: 'Hacer crecer el negocio (estrategia, nuevos servicios, alianzas)', icon: '📈', promptText: 'hacer crecer el negocio' },
      { value: 'clients', label: 'Dedicarme más a mis clientes y mejorar el servicio', icon: '🤝', promptText: 'dedicarse más a clientes' },
      { value: 'life', label: 'Recuperar tiempo personal (familia, salud, hobbies)', icon: '❤️', promptText: 'recuperar tiempo personal' },
      { value: 'learn', label: 'Aprender cosas nuevas y estar a la vanguardia', icon: '🧠', promptText: 'aprender y estar a la vanguardia' },
    ],
  },
];

// ─── Score Calculator ──────────────────────────────────────────────────────────

function calculateScore(answers: Answers): number {
  let score = 0;

  const weekly = answers.weekly_hours as string;
  if (weekly === 'over_60') score += 25;
  else if (weekly === '50_60') score += 20;
  else if (weekly === '40_50') score += 12;
  else score += 5;

  const drains = (answers.time_drains as string[]) || [];
  score += Math.min(drains.length * 5, 25);

  const frustration = answers.frustration as string;
  score += frustration === 'everything' ? 15 : 8;

  const ai = answers.ai_usage as string;
  if (ai === 'never') score += 15;
  else if (ai === 'basic') score += 12;
  else if (ai === 'regular') score += 8;
  else score += 4;

  const tools = answers.tools_spend as string;
  if (tools === 'over_300') score += 12;
  else if (tools === '150_300') score += 10;
  else if (tools === '50_150') score += 6;
  else score += 3;

  const freq = answers.content_frequency as string;
  if (freq === 'rarely') score += 10;
  else if (freq === 'inconsistent') score += 8;
  else if (freq === 'weekly') score += 4;

  return Math.min(score, 100);
}

// ─── Build Prompt ─────────────────────────────────────────────────────────────

function buildPrompt(answers: Answers): string {
  const getLabel = (qId: string, val: string | string[]): string => {
    const q = QUESTIONS.find(q => q.id === qId)!;
    if (Array.isArray(val)) {
      return val.map(v => q.options.find(o => o.value === v)?.promptText || v).join(', ');
    }
    return q.options.find(o => o.value === val)?.promptText || val;
  };

  const businessType = getLabel('business_type', answers.business_type as string);
  const teamSize = getLabel('team_size', answers.team_size as string);
  const weeklyHours = getLabel('weekly_hours', answers.weekly_hours as string);
  const timeDrains = getLabel('time_drains', answers.time_drains || []);
  const frustration = getLabel('frustration', answers.frustration as string);
  const aiUsage = getLabel('ai_usage', answers.ai_usage as string);
  const toolsSpend = getLabel('tools_spend', answers.tools_spend as string);
  const clientAcquisition = getLabel('client_acquisition', answers.client_acquisition || []);
  const contentFrequency = getLabel('content_frequency', answers.content_frequency as string);
  const dream = getLabel('dream', answers.dream as string);

  return `Eres un experto en automatización con IA para negocios con 15 años de experiencia en marketing digital y 20 años manejando negocios propios. Analizas negocios y detectas oportunidades de automatización que otros no ven. Tu tono es directo, experto y cálido — como un consultor que sabe de qué habla y se preocupa genuinamente por el resultado del cliente.

PERFIL DEL NEGOCIO A ANALIZAR:
- Tipo de negocio: ${businessType}
- Tamaño del equipo: ${teamSize}
- Horas de trabajo semanales del dueño: ${weeklyHours}
- Tareas que más tiempo le quitan: ${timeDrains}
- Lo que más le frustra / lo que dejaría de hacer si pudiera: ${frustration}
- Nivel actual de uso de IA: ${aiUsage}
- Gasto mensual en herramientas digitales: ${toolsSpend}
- Canales de adquisición de clientes: ${clientAcquisition}
- Frecuencia de publicación de contenido: ${contentFrequency}
- Si tuviera 10 horas libres a la semana las usaría para: ${dream}

INSTRUCCIONES — Genera un diagnóstico personalizado en español con EXACTAMENTE esta estructura:

## Tu Situación

Un párrafo de 3-4 líneas que demuestre que entiendes su situación ESPECÍFICA. Menciona datos concretos de sus respuestas. Que el lector sienta "este sistema me entiende — no es genérico." Refleja su frustración principal y valida su situación.

## 3 Oportunidades de Automatización con IA

Para cada oportunidad (EXACTAMENTE 3):

### [Número]. [Título corto y directo]
- **Por qué aplica a tu caso:** Explica conectando DIRECTAMENTE con sus respuestas
- **Qué haría el sistema:** Descripción concreta de lo que un sistema personalizado haría (NO menciones nombres de herramientas)
- **Tiempo estimado recuperado:** X horas por semana
- **Impacto:** Alto / Medio-Alto

## Tu Mayor Oportunidad Inmediata

Un párrafo de 3-4 líneas identificando LA oportunidad #1 que le daría el mayor retorno más rápido. Explica por qué ES la #1 para su caso específico. Cierra conectando con lo que haría con las horas libres (su respuesta a la pregunta 10).

REGLAS CRÍTICAS:
- Sé ESPECÍFICO al tipo de negocio. Las recomendaciones deben ser diferentes para cada tipo de negocio.
- Referencia datos concretos de SUS respuestas en cada oportunidad. No digas "muchos negocios" — di "tu negocio de ${businessType}".
- NO uses jerga técnica. Nada de "LLM", "prompt", "fine-tuning", "knowledge base", "API", "modelo de lenguaje".
- Habla de "sistema de IA personalizado", "sistema inteligente", "herramienta automática". NUNCA de "chatbot", "bot", o "agente".
- NO menciones herramientas por nombre (no Claude, no ChatGPT, no Gemini, no Canva).
- Tono: directo, experto, cálido. Como un consultor senior que sabe más que tú pero te trata con respeto.
- Máximo 500 palabras total.
- Usa markdown: ## para títulos de sección, ### para cada oportunidad, **negritas** para datos clave.
- El estimado de horas recuperadas debe ser realista y conservador. No exageres.`;
}

// ─── Markdown Renderer ────────────────────────────────────────────────────────

function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2 style="color:#F4845F;font-size:1.2rem;font-weight:700;margin:24px 0 12px;">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="color:#F4845F;font-size:1rem;font-weight:700;margin:20px 0 8px;">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#f1f5f9;">$1</strong>')
    .replace(/^- (.+)$/gm, '<div style="display:flex;gap:8px;margin:4px 0;"><span style="color:#F4845F;flex-shrink:0;">•</span><span>$1</span></div>')
    .replace(/\n\n/g, '<br/><br/>');
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Quiz() {
  const [step, setStep] = useState<'quiz' | 'capture' | 'analyzing' | 'report'>('quiz');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reportText, setReportText] = useState('');
  const [score, setScore] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  // Auto-scroll report
  useEffect(() => {
    if (reportRef.current && isStreaming) {
      reportRef.current.scrollTop = reportRef.current.scrollHeight;
    }
  }, [reportText, isStreaming]);

  function handleSingleSelect(val: string) {
    const newAnswers = { ...answers, [question.id]: val };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
        setSelectedMulti([]);
      } else {
        setStep('capture');
      }
    }, 180);
  }

  function toggleMulti(val: string) {
    setSelectedMulti(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  }

  function handleMultiContinue() {
    if (selectedMulti.length === 0) return;
    const newAnswers = { ...answers, [question.id]: selectedMulti };
    setAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedMulti([]);
    } else {
      setStep('capture');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    setStep('analyzing');

    // First subscribe the lead
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, answers }),
      });
    } catch (err) {
      console.error('Subscribe error:', err);
    }

    // Animate analysis steps
    const steps = [
      'Procesando tus respuestas...',
      'Analizando tu tipo de negocio...',
      'Identificando oportunidades de automatización...',
      'Generando diagnóstico personalizado...',
    ];
    for (let i = 0; i < steps.length; i++) {
      setAnalyzeStep(i);
      await new Promise(r => setTimeout(r, 900));
    }

    // Calculate score
    const s = calculateScore(answers);
    setScore(s);

    // Start streaming
    setStep('report');
    setIsStreaming(true);
    const prompt = buildPrompt(answers);

    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              const chunk = json.delta?.text || '';
              if (chunk) setReportText(prev => prev + chunk);
            } catch {}
          }
        }
      }
    } catch (err) {
      setReportText('Hubo un error generando tu diagnóstico. Por favor intenta de nuevo.');
    } finally {
      setIsStreaming(false);
    }
  }

  // ─── Render: Quiz ──────────────────────────────────────────────────────────

  if (step === 'quiz') {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Pregunta {currentQ + 1} de {QUESTIONS.length}</span>
            <span style={{ fontSize: 13, color: 'var(--coral)', fontWeight: 700 }}>{Math.round(((currentQ) / QUESTIONS.length) * 100)}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 4, background: 'var(--border-default)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #F4845F, #e06b42)',
              borderRadius: 4,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)', marginBottom: 8 }}>{question.question}</h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>{question.subtitle}</p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options.map(opt => {
            const isSelected = question.type === 'multi'
              ? selectedMulti.includes(opt.value)
              : answers[question.id] === opt.value;

            return (
              <button
                key={opt.value}
                onClick={() => question.type === 'single' ? handleSingleSelect(opt.value) : toggleMulti(opt.value)}
                style={{
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: `1px solid ${isSelected ? 'var(--coral-border-strong)' : 'var(--border-default)'}`,
                  background: isSelected ? 'var(--coral-bg-selected)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--text-primary)' : 'var(--text-body)',
                  fontSize: 15,
                  fontFamily: 'DM Sans, sans-serif',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'left',
                }}
              >
                {opt.icon && <span style={{ fontSize: 18, flexShrink: 0 }}>{opt.icon}</span>}
                <span style={{ flex: 1 }}>{opt.label}</span>
                {question.type === 'multi' && isSelected && (
                  <span style={{ color: 'var(--coral)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Multi-select continue */}
        {question.type === 'multi' && (
          <div style={{ marginTop: 20 }}>
            <button
              onClick={handleMultiContinue}
              disabled={selectedMulti.length === 0}
              className="btn-primary"
              style={{
                width: '100%',
                opacity: selectedMulti.length === 0 ? 0.4 : 1,
                cursor: selectedMulti.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Continuar →
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── Render: Lead Capture ──────────────────────────────────────────────────

  if (step === 'capture') {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <span className="badge" style={{ marginBottom: 20, display: 'inline-block' }}>ÚLTIMO PASO</span>
        <h2 style={{ marginBottom: 12 }}>Tu diagnóstico está listo.</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15 }}>
          La IA ya analizó tus respuestas. Deja tu nombre y email para ver tu reporte personalizado.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            className="input"
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            autoFocus
          />
          <input
            className="input"
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ opacity: (!name || !email) ? 0.5 : 1, cursor: (!name || !email) ? 'not-allowed' : 'pointer' }}
            disabled={!name || !email}
          >
            Ver Mi Diagnóstico →
          </button>
        </form>
        <p style={{ fontSize: 12, color: 'var(--text-minimal)', marginTop: 16 }}>
          Tu información es privada. No spam. No compartimos con terceros.
        </p>
      </div>
    );
  }

  // ─── Render: Analyzing ────────────────────────────────────────────────────

  if (step === 'analyzing') {
    const steps = [
      'Procesando tus respuestas...',
      'Analizando tu tipo de negocio...',
      'Identificando oportunidades de automatización...',
      'Generando diagnóstico personalizado...',
    ];
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #F4845F, #e06b42)',
            margin: '0 auto 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}>
            🔍
          </div>
          <h2 style={{ marginBottom: 8 }}>Analizando tu negocio...</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>La IA está procesando tus respuestas en tiempo real</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', borderRadius: 10,
              background: i <= analyzeStep ? 'var(--coral-bg-selected)' : 'var(--bg-card)',
              border: `1px solid ${i <= analyzeStep ? 'var(--coral-border)' : 'var(--border-subtle)'}`,
              transition: 'all 0.3s ease',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{i < analyzeStep ? '✓' : i === analyzeStep ? '⏳' : '○'}</span>
              <span style={{ fontSize: 14, color: i <= analyzeStep ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Render: Report ───────────────────────────────────────────────────────

  const scoreLabel = score >= 80 ? 'MUY ALTO' : score >= 60 ? 'ALTO' : score >= 40 ? 'MODERADO' : 'BAJO';

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span className="badge" style={{ marginBottom: 16, display: 'inline-block' }}>TU DIAGNÓSTICO</span>
        <h2 style={{ marginBottom: 8 }}>Diagnóstico de IA para {name}</h2>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>Generado en tiempo real · AgentesParaTuNegocio.com</p>
      </div>

      {/* Score */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px',
        borderRadius: 16, border: '1px solid var(--coral-border)',
        background: 'var(--coral-bg-selected)', marginBottom: 28, flexWrap: 'wrap',
      }}>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{
            fontSize: 36, fontWeight: 800, color: 'var(--coral)',
            lineHeight: 1, marginBottom: 4,
          }}>{score}</div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 1 }}>/ 100</div>
        </div>
        <div>
          <p style={{ fontSize: 12, color: 'var(--coral)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
            Potencial de automatización: {scoreLabel}
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-body)' }}>
            Basado en tu tipo de negocio, horas de trabajo, y áreas de mayor oportunidad.
          </p>
        </div>
      </div>

      {/* Report */}
      <div
        ref={reportRef}
        className="card"
        style={{ minHeight: 300, position: 'relative', lineHeight: 1.7 }}
      >
        {reportText ? (
          <div
            style={{ color: 'var(--text-body)', fontSize: 15 }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(reportText) + (isStreaming ? '<span class="cursor-blink" style="display:inline-block;width:2px;height:1em;background:var(--coral);margin-left:2px;vertical-align:text-bottom;">▊</span>' : '') }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-tertiary)' }}>
            <span>Generando tu diagnóstico</span>
            <span style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--coral)',
                  animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                  display: 'inline-block',
                }} />
              ))}
            </span>
          </div>
        )}
      </div>

      {/* CTA (visible after streaming) */}
      {!isStreaming && reportText && (
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <div className="divider" style={{ marginBottom: 32 }} />
          <h3 style={{ marginBottom: 12 }}>¿Quieres que construya el sistema #1 de tu diagnóstico?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
            En <strong>Tu Primera Jugada ($497)</strong>, analizo tu negocio en profundidad y te entrego un primer sistema de IA personalizado ya funcionando. Los $497 se descuentan si avanzas con la implementación completa.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <a
              href="https://wa.me/message/TODO?text=Hola%20Beto%2C%20hice%20el%20diagn%C3%B3stico%20y%20quiero%20agendar%20Tu%20Primera%20Jugada."
              className="btn-primary"
              style={{ minWidth: 260 }}
              target="_blank"
              rel="noopener"
            >
              Agendar Tu Primera Jugada →
            </a>
            <a
              href="https://wa.me/message/TODO?text=Hola%20Beto%2C%20hice%20el%20diagn%C3%B3stico%20y%20me%20interes%C3%B3."
              className="btn-secondary"
              style={{ minWidth: 200 }}
              target="_blank"
              rel="noopener"
            >
              Hablar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
