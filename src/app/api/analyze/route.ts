/**
 * FlavorLens API - Image Analysis & Recipe Generation
 * 
 * Author: John Mamanao
 * Role: Software Developer
 * GitHub: @BeastNectus
 * 
 * This API endpoint processes food images and generates recipes using
 * OpenRouter AI services with multiple model fallbacks for reliability.
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface Recipe {
  recipeName: string;
  description: string;
  mainIngredients: string[];
  instructions: string[];
  time: string;
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "X-Title": "FlavorLens",
  },
});

export async function POST(request: NextRequest) {
  try {
    const { image, mimeType } = await request.json();
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
    }

    const prompt = "You are an expert chef and food identification specialist. First, carefully examine this image and determine if it contains food, ingredients, or food-related items. If the image does NOT contain food, ingredients, or anything edible, respond with exactly: {\"error\": \"no_food\", \"message\": \"This image doesn't contain food or ingredients. Please upload an image with food items to generate recipes.\"}. If the image DOES contain food or ingredients, identify them and return 3–5 structured recipes in JSON with: recipeName, description, mainIngredients, instructions, and time. Return ONLY a valid JSON array of recipe objects or the error object, no other text.";

    const models = [
      "google/gemini-flash-1.5",
    ];

    let completion;
    let lastError;

    for (const model of models) {
      try {
        completion = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${image}`
                  }
                }
              ]
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        });
        
        break;
      } catch (error: unknown) {
        const errorObj = error as { status?: number; message?: string };
        console.log(`Model ${model} failed:`, errorObj.status || errorObj.message);
        lastError = error;
        
        if (errorObj.status === 429) {
          continue;
        }
        
        throw error;
      }
    }

    if (!completion) {
      throw lastError || new Error('All models failed');
    }

    if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      return NextResponse.json({ error: 'Invalid response from AI' }, { status: 500 });
    }

    const content = completion.choices[0].message.content?.trim();
    
    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    let jsonStr = content;
    if (content.includes('```json')) {
      jsonStr = content.split('```json')[1].split('```')[0].trim();
    } else if (content.includes('```')) {
      jsonStr = content.split('```')[1].split('```')[0].trim();
    }

    try {
      const response = JSON.parse(jsonStr);
      
      if (response.error === 'no_food') {
        return NextResponse.json({ 
          error: 'no_food',
          message: response.message || 'This image doesn\'t contain food or ingredients. Please upload an image with food items to generate recipes.'
        }, { status: 400 });
      }
      
      const recipes: Recipe[] = Array.isArray(response) ? response : [response];
      
      if (!Array.isArray(recipes)) {
        throw new Error('Response is not an array');
      }

      const validRecipes = recipes.filter((recipe: Recipe) => 
        recipe.recipeName && 
        recipe.description && 
        Array.isArray(recipe.mainIngredients) && 
        Array.isArray(recipe.instructions) && 
        recipe.time
      );

      if (validRecipes.length === 0) {
        return NextResponse.json({ error: 'No valid recipes found in AI response' }, { status: 500 });
      }

      return NextResponse.json({ recipes: validRecipes });
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', content);
      return NextResponse.json({ error: 'Failed to parse AI response as JSON' }, { status: 500 });
    }

  } catch (error: unknown) {
    const errorObj = error as { status?: number; message?: string };
    console.error('API route error:', error);
    
    if (errorObj.status === 429) {
      return NextResponse.json({ 
        error: 'AI service is currently busy. Please try again in a few moments.' 
      }, { status: 429 });
    } else if (errorObj.status === 400) {
      return NextResponse.json({ 
        error: 'Invalid image format. Please try a different image.' 
      }, { status: 400 });
    } else if (errorObj.status === 401) {
      return NextResponse.json({ 
        error: 'API authentication failed. Please check your API key.' 
      }, { status: 500 });
    } else {
      return NextResponse.json({ 
        error: 'Unable to analyze image at the moment. Please try again later.' 
      }, { status: 500 });
    }
  }
}
