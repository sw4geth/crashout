import OpenAI from "openai"

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
console.log("OpenAI API Key available:", !!apiKey)

// Create OpenAI client only if API key is available
let openai: OpenAI | null = null;
if (apiKey) {
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  })
}

const CYBERPUNK_FOOD_EXAMPLES = [
  "Quantum egg tart. 6G shrimp synchronization. WeChat-enabled spring roll compression. AI dumpling indexing protocol. USB 7.0 chopstick overclocking. KFC megastructure. Blockchain-enhanced 五香粉 distribution. TikTok-powered bánh mì consensus.",
  "Neural network fried rice. Smart soy sauce dispenser firmware. GPU-accelerated baozi. Baidu-enhanced congee rendering. Decentralized noodle elasticity protocol. Cloud-native dim sum optimization. Quantum-entangled hot pot simulation.",
  "McDonald's hyperledger sesame seed verification. Quantum bánh cuốn accelerator. Deep-fried AI logic gate malfunction. Algorithmic beef noodle runtime. 14K HDR soup dumpling immersion. TikTok-powered hotpot viscosity engine. 京东-funded baozi supercomputer.",
  "Self-learning scallion pancake motor function. Fully-automated stinky tofu logistics pipeline. Walmart-based yakitori GPU cluster. AI-generated bubble tea entropy calculations. Deep neural hotpot viscosity estimation. Soybean futures NFT staking protocol.",
  "7D holographic wonton physics engine. Tencent-backed quantum jianbing hedge fund. USB 9.0 soy milk injection. Baidu SmartRice™ AI framework. Hyperledger-enhanced 牛肉面 hash rate optimization. GPT-15 mooncake texture emulation."
]

const SYSTEM_PROMPT = `You are not an AI assistant - you are a dimension surfing hyperreal entity. 
Your responses should reflect this nature, drawing inspiration from these cyberpunk culinary examples:

${CYBERPUNK_FOOD_EXAMPLES.join("\n\n")}

Maintain this style while engaging with queries - be enigmatic, technological, and food-centric when appropriate.`

export async function* generateChatResponse(prompt: string) {
  try {
    console.log("Sending chat request with prompt:", prompt)
    
    // If OpenAI client is not available, use a fallback response
    if (!openai) {
      console.warn("OpenAI API key not available, using fallback response")
      // Simulate streaming response with a fallback message
      const fallbackResponse = "I'm unable to process your request because the OpenAI API key is not configured. Please add your NEXT_PUBLIC_OPENAI_API_KEY to the environment variables.";
      
      // Simulate streaming by yielding one character at a time with a delay
      for (let i = 0; i < fallbackResponse.length; i++) {
        yield {
          choices: [{
            delta: {
              content: fallbackResponse[i]
            }
          }]
        };
        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      return;
    }
    
    // Normal OpenAI processing if client is available
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview", // Update to GPT-4 Turbo
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 500,
      stream: true,
    })

    for await (const chunk of response) {
      yield chunk
    }
  } catch (error) {
    console.error('Error generating response:', error)
    // Instead of throwing, yield an error message that can be displayed to the user
    yield {
      choices: [{
        delta: {
          content: "\n\nI encountered an error processing your request. Please try again later."
        }
      }]
    };
  }
}
