import { User, InsertTask } from "@shared/schema";
import { MISTRAL_API_KEY } from '../../config';

// Interface for AI-generated task
interface AITask {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  proofType: "photo" | "text";
  xpReward: number;
  aiRecommendation: string;
  failurePenalty: {
    type: "credits" | "xp";
    amount: number;
  };
  isSpecialChallenge?: boolean;
}

// Function to generate tasks by difficulty using Mistral AI
export async function generateTasksByDifficulty(
  user: User, 
  difficulty: "easy" | "medium" | "hard",
  count: number = 2
): Promise<AITask[]> {
  try {
    // Use imported MISTRAL_API_KEY
    const apiKey = MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error("Missing Mistral API key.");
    }
    
    // Base URL for Mistral AI API
    const baseUrl = "https://api.mistral.ai/v1";
    
    // Set XP reward range based on difficulty
    let xpRange = "";
    switch (difficulty) {
      case "easy":
        xpRange = "50-100";
        break;
      case "medium":
        xpRange = "150-200";
        break;
      case "hard":
        xpRange = "250-350";
        break;
    }
    
    // Prepare prompt for task generation
    const prompt = `Generate ${count} ${difficulty} difficulty self-improvement tasks for a level ${user.level} user named ${user.displayName}. 
    For each task, provide:
    1. Title (short, compelling)
    2. Description (detailed instructions)
    3. Category (e.g., fitness, productivity, learning, mindfulness)
    4. Proof type needed (photo or text)
    5. XP reward (${xpRange})
    6. AI recommendation (tips for completing the task effectively)
    
    Format the response as a JSON object with a 'tasks' array containing task objects with fields: title, description, category, proofType, xpReward, aiRecommendation.
    Every task must have difficulty set to "${difficulty}".`;
    
    // Make API request to Mistral AI
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
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from Mistral AI:", errorText);
      throw new Error("Mistral AI API request failed: " + errorText);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      // Parse the JSON response
      const parsedContent = JSON.parse(content);
      const tasks = parsedContent.tasks || [];
      
      // Ensure all tasks have the correct difficulty
      return tasks.map((task: AITask) => ({
        ...task,
        difficulty
      }));
    } catch (error) {
      console.error("Error parsing Mistral AI response:", error);
      throw new Error("Error parsing Mistral AI response: " + (error instanceof Error ? error.message : String(error)));
    }
  } catch (error) {
    console.error(`Error generating ${difficulty} tasks with Mistral AI:`, error);
    throw new Error("Error generating tasks with Mistral AI: " + (error instanceof Error ? error.message : String(error)));
  }
}

// Generate a special daily challenge
export async function generateDailyChallenge(user: User): Promise<AITask> {
  try {
    // Use imported MISTRAL_API_KEY
    const apiKey = MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error("Missing Mistral API key.");
    }
    
    // Base URL for Mistral AI API
    const baseUrl = "https://api.mistral.ai/v1";
    
    // Prepare prompt for daily challenge generation
    const prompt = `Generate 1 special daily challenge for a level ${user.level} user named ${user.displayName}. 
    This should be a unique, engaging task that stands out from regular tasks.
    
    Challenge requirements:
    1. It must be highly original and creative - avoid common activities like stair climbing, hiking, or planks
    2. It should combine multiple skills or domains (e.g., physical + creative, mental + social)
    3. It must be something that can be completed in a single day but feels special and exciting
    4. The task should feel like an adventure or a special mission, not just a routine activity
    5. It should push the user outside their comfort zone in an interesting way
    
    For example, DO create challenges like:
    - "Create and complete a neighborhood photo scavenger hunt with 10 specific items to find and photograph"
    - "Record a short video teaching someone else a skill you're good at"
    - "Prepare a dish from a cuisine you've never cooked before and document the process"
    - "Create a handmade gift for someone and deliver it in person"
    
    DON'T create challenges like:
    - "Climb stairs" or "Take a hike" or "Do planks" (these are overused)
    - Simple activities that don't feel special or challenging
    - Multi-day habits or routine activities
    
    For the challenge, provide:
    1. Title (creative and motivating)
    2. Description (detailed instructions with a sense of adventure)
    3. Difficulty (choose from easy, medium, or hard based on complexity)
    4. Category (e.g., fitness, productivity, learning, mindfulness, social, creative)
    5. Proof type needed (photo or text)
    6. XP reward (100-400 depending on difficulty)
    7. AI recommendation (specific tips for completing the challenge successfully)
    8. Failure penalty (an object with type: "credits" and amount: 25-50)
    
    Format the response as a JSON object with a 'challenge' object containing fields: title, description, difficulty, category, proofType, xpReward, aiRecommendation, failurePenalty.`;
    
    // Make API request to Mistral AI
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
            content: prompt
          }
        ],
        temperature: 0.8,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from Mistral AI:", errorText);
      throw new Error("Mistral AI API request failed: " + errorText);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      // Parse the JSON response
      const parsedContent = JSON.parse(content);
      const challenge = parsedContent.challenge || {};
      
      return {
        ...challenge,
        isSpecialChallenge: true
      };
    } catch (error) {
      console.error("Error parsing Mistral AI daily challenge response:", error);
      throw new Error("Error parsing Mistral AI response: " + (error instanceof Error ? error.message : String(error)));
    }
  } catch (error) {
    console.error("Error generating daily challenge with Mistral AI:", error);
    throw new Error("Error generating daily challenge: " + (error instanceof Error ? error.message : String(error)));
  }
}

// Function to generate all tasks for a user using Mistral AI
export async function generateAllDailyTasks(user: User): Promise<AITask[]> {
  try {
    // Generate 2 tasks per difficulty level
    const easyTasks = await generateTasksByDifficulty(user, "easy", 2);
    const mediumTasks = await generateTasksByDifficulty(user, "medium", 2);
    const hardTasks = await generateTasksByDifficulty(user, "hard", 2);
    
    // Generate 1 special daily challenge
    const dailyChallenge = await generateDailyChallenge(user);
    
    // Combine all tasks
    return [...easyTasks, ...mediumTasks, ...hardTasks, dailyChallenge];
  } catch (error) {
    console.error("Error generating all daily tasks:", error);
    throw new Error("Error generating tasks: " + (error instanceof Error ? error.message : String(error)));
  }
}

// Check if tasks should be generated today
export function shouldGenerateTasksToday(lastGeneratedDate: Date | null): boolean {
  if (!lastGeneratedDate) {
    return true;
  }
  
  const today = new Date();
  const lastGenerated = new Date(lastGeneratedDate);
  
  // Check if the date components (year, month, day) are different
  return (
    today.getFullYear() !== lastGenerated.getFullYear() ||
    today.getMonth() !== lastGenerated.getMonth() ||
    today.getDate() !== lastGenerated.getDate()
  );
}

// Generate a single task from Mistral AI with expiration date
export async function generateTask(
  user: User, 
  difficulty?: "easy" | "medium" | "hard", 
  isSpecialChallenge: boolean = false
): Promise<InsertTask> {
  try {
    // Use imported MISTRAL_API_KEY
    const apiKey = MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error("Missing Mistral API key.");
    }
    
    // Base URL for Mistral AI API
    const baseUrl = "https://api.mistral.ai/v1";
    
    // Set difficulty if not provided
    if (!difficulty) {
      const difficulties: ("easy" | "medium" | "hard")[] = ["easy", "medium", "hard"];
      difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    }
    
    // Set XP reward range based on difficulty
    let xpRange = "";
    switch (difficulty) {
      case "easy":
        xpRange = "50-100";
        break;
      case "medium":
        xpRange = "150-200";
        break;
      case "hard":
        xpRange = "250-350";
        break;
    }
    
    // Prepare prompt for task generation
    const prompt = isSpecialChallenge 
      ? `Generate 1 special challenge for a level ${user.level} user named ${user.displayName}. 
        This should be a unique, engaging task that stands out from regular tasks.
        
        Challenge requirements:
        1. It must be highly original and creative
        2. It should combine multiple skills or domains
        3. It must be something that can be completed in a single day but feels special
        
        For the challenge, provide:
        1. Title (creative and motivating)
        2. Description (detailed instructions with a sense of adventure)
        3. Category (e.g., fitness, productivity, learning, mindfulness, social, creative)
        4. Proof type needed (photo or text)
        5. XP reward (100-400 depending on difficulty)
        6. AI recommendation (specific tips for completing the challenge successfully)
        7. Failure penalty (an object with type: "credits" and amount: 25-50)
        
        Format as JSON with a 'task' object containing fields: title, description, category, proofType, xpReward, aiRecommendation, failurePenalty.`
      : `Generate 1 ${difficulty} difficulty self-improvement task for a level ${user.level} user named ${user.displayName}.
        
        For the task, provide:
        1. Title (short, compelling)
        2. Description (detailed instructions)
        3. Category (e.g., fitness, productivity, learning, mindfulness)
        4. Proof type needed (photo or text)
        5. XP reward (${xpRange})
        6. AI recommendation (tips for completing the task effectively)
        7. Failure penalty (an object with type: "credits" and amount: 10-50 depending on difficulty)
        
        Format as JSON with a 'task' object containing fields: title, description, category, proofType, xpReward, aiRecommendation, failurePenalty.`;
    
    // Make API request to Mistral AI
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
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error from Mistral AI:", errorText);
      throw new Error("Mistral AI API request failed: " + errorText);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      // Parse the JSON response
      const parsedContent = JSON.parse(content);
      const task = parsedContent.task || {};
      
      // Set expiration date (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      return {
        userId: user.id,
        title: task.title,
        description: task.description,
        difficulty: difficulty || "medium",
        xpReward: task.xpReward,
        createdBy: "ai",
        proofType: task.proofType,
        expiresAt,
        category: task.category,
        aiRecommendation: task.aiRecommendation,
        failurePenalty: task.failurePenalty,
        isSpecialChallenge
      };
    } catch (error) {
      console.error("Error parsing Mistral AI response:", error);
      throw new Error("Error parsing Mistral AI response: " + (error instanceof Error ? error.message : String(error)));
    }
  } catch (error) {
    console.error("Error generating task:", error);
    throw new Error("Error generating task: " + (error instanceof Error ? error.message : String(error)));
  }
}

// Generate all daily tasks for a user (2 tasks per difficulty level + 1 special challenge)
export async function generateAllUserDailyTasks(user: User): Promise<InsertTask[]> {
  try {
    // Get all AI-generated tasks
    const allTasks = await generateAllDailyTasks(user);
    
    // Convert AITask[] to InsertTask[]
    return allTasks.map(task => {
      // Set expiration date (24 hours from now)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      return {
        userId: user.id,
        title: task.title,
        description: task.description,
        difficulty: task.difficulty,
        xpReward: task.xpReward,
        createdBy: "ai",
        proofType: task.proofType,
        expiresAt,
        category: task.category,
        aiRecommendation: task.aiRecommendation,
        failurePenalty: task.failurePenalty,
        isSpecialChallenge: !!task.isSpecialChallenge
      };
    });
  } catch (error) {
    console.error("Error generating all user daily tasks:", error);
    throw new Error("Error generating all user daily tasks: " + (error instanceof Error ? error.message : String(error)));
  }
}