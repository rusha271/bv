import { NextRequest, NextResponse } from 'next/server';

// Fallback responses for when AI model is not available
const fallbackResponses: string[] = [
  "I'm here to help! What can I assist you with today?",
  "Hello! I'm your VastuMitra. How can I help you?",
  "Thanks for your message! I'm ready to help with any questions you have.",
  "Hi there! I'm here to chat and help you out. What's on your mind?",
  "Greetings! I'm your friendly VastuMitra. How may I help you today?",
  "Hello! I'm ready to assist you with whatever you need.",
  "Hi! I'm here to help answer your questions and chat with you.",
  "Welcome! I'm your VastuMitra. What would you like to know?",
];

// Vastu-specific responses
const vastuResponses: string[] = [
  "In Vastu Shastra, the direction of your home entrance is very important for positive energy flow.",
  "The kitchen should ideally be in the southeast direction for optimal energy balance.",
  "Bedrooms are best placed in the southwest for peaceful sleep and harmony.",
  "The northeast corner is considered sacred and perfect for prayer rooms or meditation areas.",
  "Water elements like fountains should be placed in the north or northeast for prosperity.",
  "Avoid placing heavy furniture in the center of rooms as it blocks energy flow.",
  "Mirrors should not face the bed directly as they can disrupt sleep energy.",
  "Plants in the northeast corner can enhance positive energy and growth.",
  "The main door should open inward and be well-lit for welcoming positive energy.",
  "Keep the center of your home clutter-free to allow energy to flow freely.",
];

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: { text: string }[] } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Get the last user message
    const lastMessage = messages[messages.length - 1]?.text?.toLowerCase() || '';
    
    let botResponse = '';

    // Check if the message is Vastu-related
    const vastuKeywords = ['vastu', 'shastra', 'direction', 'energy', 'feng shui', 'home', 'house', 'room', 'kitchen', 'bedroom', 'entrance', 'door'];
    const isVastuRelated = vastuKeywords.some(keyword => lastMessage.includes(keyword));

    if (isVastuRelated) {
      // Use Vastu-specific responses
      const randomIndex = Math.floor(Math.random() * vastuResponses.length);
      botResponse = vastuResponses[randomIndex];
    } else {
      // Use general responses
      const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
      botResponse = fallbackResponses[randomIndex];
    }

    return NextResponse.json({
      response: botResponse,
      timestamp: new Date().toISOString(),
      mode: 'fallback',
    });
  } catch (error: any) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your message', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      status: 'healthy',
      message: 'Chatbot is ready (fallback mode)',
      mode: 'fallback',
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: 'Chatbot is not ready', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 503 }
    );
  }
}