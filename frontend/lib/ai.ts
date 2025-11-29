// lib/ai.ts - Universal AI Client (Groq-focused)

type AIProvider = 'groq' | 'anthropic' | 'together' | 'ollama';

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

class UniversalAI {
  private provider: AIProvider;

  constructor() {
    // Default to Groq (free tier)
    this.provider = (process.env.AI_PROVIDER as AIProvider) || 'groq';
    console.log(`🤖 AI Provider initialized: ${this.provider}`);
  }

  async chat(messages: AIMessage[], model?: string): Promise<AIResponse> {
    switch (this.provider) {
      case 'groq':
        return this.callGroq(messages, model);
      case 'anthropic':
        return this.callAnthropic(messages, model);
      case 'together':
        return this.callTogether(messages, model);
      case 'ollama':
        return this.callOllama(messages, model);
      default:
        // Fallback to Groq
        return this.callGroq(messages, model);
    }
  }

  // -------- GROQ (Primary Provider) --------
  private async callGroq(messages: AIMessage[], model?: string): Promise<AIResponse> {
    const apiModel = model || process.env.AI_MODEL_AGENT || 'llama-3.1-8b-instant';

    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set. Add it to your .env.local file.');
    }

    console.log(`📤 Calling Groq with model: ${apiModel}`);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: apiModel,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Groq API error:', data);
      throw new Error(data.error?.message || `Groq request failed with status ${response.status}`);
    }

    console.log(`✅ Groq response received (${data.usage?.completion_tokens || 0} tokens)`);

    return {
      content: data.choices[0].message.content,
      usage: {
        input_tokens: data.usage?.prompt_tokens || 0,
        output_tokens: data.usage?.completion_tokens || 0,
      },
    };
  }

  // -------- ANTHROPIC (Optional) --------
  private async callAnthropic(messages: AIMessage[], model?: string): Promise<AIResponse> {
    const apiModel = model || process.env.AI_MODEL_AGENT || 'claude-3-5-sonnet-20241022';

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    const systemMessage = messages.find((m) => m.role === 'system');
    const userMessages = messages.filter((m) => m.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: apiModel,
        max_tokens: 4096,
        system: systemMessage?.content,
        messages: userMessages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic error:', data);
      throw new Error(data.error?.message || 'Anthropic request failed');
    }

    return {
      content: data.content[0].text,
      usage: {
        input_tokens: data.usage?.input_tokens || 0,
        output_tokens: data.usage?.output_tokens || 0,
      },
    };
  }

  // -------- TOGETHER.AI (Optional) --------
  private async callTogether(messages: AIMessage[], model?: string): Promise<AIResponse> {
    const apiModel = model || process.env.AI_MODEL_AGENT || 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo';

    if (!process.env.TOGETHER_API_KEY) {
      throw new Error('TOGETHER_API_KEY is not set');
    }

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({
        model: apiModel,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: 4096,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Together error:', data);
      throw new Error(data.error?.message || 'Together request failed');
    }

    return {
      content: data.choices[0].message.content,
      usage: {
        input_tokens: data.usage?.prompt_tokens || 0,
        output_tokens: data.usage?.completion_tokens || 0,
      },
    };
  }

  // -------- OLLAMA (Local) --------
  private async callOllama(messages: AIMessage[], model?: string): Promise<AIResponse> {
    const apiModel = model || process.env.AI_MODEL_AGENT || 'llama3.1:8b';
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: apiModel,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Ollama error:', data);
      throw new Error(data.error || 'Ollama request failed');
    }

    return {
      content: data.message.content,
      usage: {
        input_tokens: data.prompt_eval_count || 0,
        output_tokens: data.eval_count || 0,
      },
    };
  }
}

export const ai = new UniversalAI();