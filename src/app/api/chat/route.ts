import { NextRequest, NextResponse } from 'next/server';
import { AutoTokenizer, AutoModelForCausalLM, PreTrainedTokenizer } from '@xenova/transformers';

// Custom interfaces to extend the base types
interface Tokenizer extends PreTrainedTokenizer {
  encode(text: string): number[];
  decode(tokens: number[]): string;
  eos_token?: string; // Optional to match potential runtime behavior
  eos_token_id?: number; // Optional to match potential runtime behavior
}

interface CausalLMModel extends AutoModelForCausalLM {
  generate(inputIds: number[], options: any): Promise<number[]>;
}

// Global variables with proper typing
let chatModel: CausalLMModel | null = null;
let tokenizer: Tokenizer | null = null;
let useFallbackMode = false;

// Fallback responses
const fallbackResponses: string[] = [
  "I'm here to help! What can I assist you with today?",
  "Hello! I'm your AI assistant. How can I help you?",
  "Thanks for your message! I'm ready to help with any questions you have.",
  "Hi there! I'm here to chat and help you out. What's on your mind?",
  "Greetings! I'm your friendly AI assistant. How may I help you today?",
  "Hello! I'm ready to assist you with whatever you need.",
  "Hi! I'm here to help answer your questions and chat with you.",
  "Welcome! I'm your AI assistant. What would you like to know?",
];

// Initialize the model
async function initializeModel() {
  if (useFallbackMode) {
    return { model: null, tokenizer: null, fallback: true };
  }
  if (!chatModel || !tokenizer) {
    try {
      console.log('Loading DialoGPT-small model from local directory...');
      const baseTokenizer = await AutoTokenizer.from_pretrained('D:/bv/models/DialoGPT-small', {
        cache_dir: './huggingface_cache',
      });
      tokenizer = baseTokenizer as unknown as Tokenizer;
      chatModel = (await AutoModelForCausalLM.from_pretrained('D:/bv/models/DialoGPT-small', {
        cache_dir: './huggingface_cache',
      })) as CausalLMModel;
      console.log('DialoGPT model loaded successfully from local files');
    } catch (error: any) {
      console.error('Model loading failed:', error.message, error.stack);
      useFallbackMode = true;
      return { model: null, tokenizer: null, fallback: true };
    }
  }
  return { model: chatModel, tokenizer: tokenizer!, fallback: false };
}

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: { text: string }[] } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Initialize the model
    const { model, tokenizer: modelTokenizer, fallback } = await initializeModel();

    let botResponse = '';

    if (fallback) {
      const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
      botResponse = fallbackResponses[randomIndex];
    } else if (model && modelTokenizer) {
      try {
        // Prepare conversation history for the model
        let input_ids: number[] = [];
        for (const msg of messages) {
          const text = msg.text + (modelTokenizer.eos_token || '<|endoftext|>');
          const ids = modelTokenizer.encode(text);
          input_ids = [...input_ids, ...ids];
        }

        // Ensure input doesn't exceed model's max length (1024 for DialoGPT)
        const maxLength = 1024;
        if (input_ids.length > maxLength) {
          input_ids = input_ids.slice(-maxLength);
        }

        // Generate response
        const output = await model.generate(input_ids, {
          max_new_tokens: 100,
          temperature: 0.7,
          do_sample: true,
          pad_token_id: modelTokenizer.eos_token_id || 50256, // Default EOS token ID for DialoGPT
        });

        // Decode the new response
        const new_tokens = output.slice(input_ids.length);
        botResponse = modelTokenizer.decode(new_tokens);

        // Fallback if response is empty
        if (!botResponse.trim()) {
          const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
          botResponse = fallbackResponses[randomIndex];
        }
      } catch (generationError: any) { // Explicitly type error as 'any' to resolve ts(18046)
        console.error('Text generation error:', generationError);
        const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
        botResponse = fallbackResponses[randomIndex];
      }
    }

    return NextResponse.json({
      response: botResponse,
      timestamp: new Date().toISOString(),
      mode: fallback ? 'fallback' : 'ai',
    });
  } catch (error: any) { // Explicitly type error as 'any' to resolve ts(18046)
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your message', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { fallback } = await initializeModel();
    return NextResponse.json({
      status: 'healthy',
      message: fallback ? 'Chatbot is ready (fallback mode)' : 'Chatbot is ready',
      model: fallback ? 'fallback' : 'DialoGPT-small',
      mode: fallback ? 'fallback' : 'ai',
    });
  } catch (error: any) { // Explicitly type error as 'any' to resolve ts(18046)
    return NextResponse.json(
      { status: 'error', message: 'Chatbot is not ready', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 503 }
    );
  }
}