# 🍳 FlavorLens

A modern web application that analyzes food images and suggests recipes using AI.

## Features

- **Drag & Drop Image Upload**: Easy-to-use interface for uploading food images
- **AI-Powered Analysis**: Uses Google's Gemini model via OpenRouter to identify food and suggest recipes
- **Beautiful Recipe Cards**: Clean, modern design with ingredient lists and step-by-step instructions
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Error Handling**: Robust error handling for API failures and invalid responses

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **React Dropzone**
- **OpenRouter API** (Google Gemini 2.0 Flash)

## Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Get your OpenRouter API key from [https://openrouter.ai/keys](https://openrouter.ai/keys)
   - Replace `your_openrouter_api_key_here` with your actual API key

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Upload a food image and get AI-generated recipes!

## How It Works

1. **Upload**: Drag and drop or click to upload a food image
2. **Analyze**: The image is sent to the `/api/analyze` endpoint
3. **AI Processing**: OpenRouter's Gemini model identifies the food and generates 3-5 structured recipes
4. **Display**: Recipes are displayed in beautiful, responsive cards with:
   - Recipe name and description
   - Ingredient lists
   - Step-by-step instructions
   - Cooking time estimates

## API Route

The `/api/analyze` endpoint:
- Accepts POST requests with base64-encoded images
- Calls OpenRouter API with Google Gemini 2.0 Flash model
- Returns structured JSON with recipe data
- Includes robust error handling and response validation

## Environment Variables

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
