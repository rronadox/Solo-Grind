// Test Mistral API connectivity
import './init-env.js';
import fetch from 'node-fetch';

async function testMistralAPI() {
  const apiKey = process.env.MISTRAL_API_KEY;
  console.log(`Testing Mistral API with key: ${apiKey ? "Key is set" : "Key is missing"}`);
  
  if (!apiKey) {
    console.error("MISTRAL_API_KEY is not set. Please set it before running this test.");
    return;
  }
  
  const baseUrl = "https://api.mistral.ai/v1";
  
  try {
    // Create a simple test request
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "open-mixtral-8x7b",
        messages: [
          {
            role: "user",
            content: "Hello, can you tell me a quick joke?"
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Mistral API error (${response.status}):`, errorText);
      return;
    }
    
    const data = await response.json();
    console.log("API Response:");
    console.log("Status:", response.status);
    console.log("Content:", data.choices[0].message.content);
    console.log("\nThe Mistral API is working correctly!");
  } catch (error) {
    console.error("Error testing Mistral API:", error);
  }
}

testMistralAPI();