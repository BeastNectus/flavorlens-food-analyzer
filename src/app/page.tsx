/**
 * FlavorLens - Main Application Component
 * 
 * Developer: John Mamanao
 * Position: Software Developer  
 * GitHub: @BeastNectus
 * 
 * This component handles the core functionality of FlavorLens:
 * - Image upload and preview
 * - AI-powered recipe generation
 * - Food detection and validation
 * - Recipe display and interaction
 */

'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Upload, ChefHat, Clock, Users, Sparkles, Eye, Github } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Recipe {
  recipeName: string;
  description: string;
  mainIngredients: string[];
  instructions: string[];
  time: string;
}

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setError(null);
        setRecipes([]);
        analyzeImageFromBase64(result, file.type);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false
  });

  const analyzeImageFromBase64 = async (base64Image: string, mimeType: string) => {
    setLoading(true);
    setError(null);

    try {
      const base64 = base64Image.split(',')[1];
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mimeType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'no_food') {
          throw new Error(errorData.message || 'This image doesn\'t contain food or ingredients. Please upload an image with food items to generate recipes.');
        }
        throw new Error(errorData.error || 'Failed to analyze image');
      }
      
      const data = await response.json();
      if (data.error === 'no_food') {
        throw new Error(data.message || 'This image doesn\'t contain food or ingredients. Please upload an image with food items to generate recipes.');
      }
      if (data.error) throw new Error(data.error);
      
      setRecipes(data.recipes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden custom-scrollbar">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      <motion.div 
        className="relative z-10 min-h-screen flex flex-col container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="text-center mb-6 sm:mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 mb-3 sm:mb-4 border border-white/20">
            <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
            <span className="text-white font-medium text-xs sm:text-sm">FlavorLens</span>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            FlavorLens
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base px-4">
            Upload a food photo and get instant AI-generated recipes
          </p>
        </motion.div>

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 pb-4 sm:pb-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="order-1"
          >
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl h-full">
              <CardContent className="p-4 sm:p-6 h-full">
                <div
                  {...getRootProps()}
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 text-center cursor-pointer transition-all duration-300 h-full min-h-[200px] sm:min-h-[250px] flex flex-col justify-center",
                    isDragActive 
                      ? "border-orange-400 bg-orange-400/10 scale-105" 
                      : loading 
                      ? "border-orange-400/50 bg-orange-400/5 animate-pulse"
                      : "border-white/30 hover:border-orange-400/50 hover:bg-white/5"
                  )}
                >
                  <input {...getInputProps()} />
                  <AnimatePresence mode="wait">
                    {imagePreview ? (
                      <motion.div 
                        key="preview"
                        className="space-y-3 sm:space-y-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <div className="relative inline-block group">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={400}
                            height={300}
                            unoptimized
                            className="max-w-full max-h-80 sm:max-h-48 lg:max-h-100 mx-auto rounded-lg shadow-xl ring-2 ring-white/20 group-hover:ring-orange-400/50 transition-all object-cover"
                          />
                          {loading && (
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-br from-black/70 via-slate-900/80 to-black/70 backdrop-blur-md rounded-lg flex items-center justify-center border border-orange-500/20"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                              <div className="text-center text-orange-200">
                                <div className="relative mb-6">
                                  <div className="w-16 h-16 mx-auto relative">
                                    <div className="absolute inset-0 rounded-full border-4 border-orange-500/20"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-400 border-r-pink-400 loading-ring"></div>
                                    <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-400 border-l-blue-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
                                  </div>
                                  
                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-3 h-3 rounded-full gradient-pulse"></div>
                                  </div>
                                  
                                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-1 h-1 bg-orange-400 rounded-full absolute -top-8 particle-float" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-1 h-1 bg-pink-400 rounded-full absolute -right-8 particle-float" style={{ animationDelay: '0.3s' }}></div>
                                    <div className="w-1 h-1 bg-purple-400 rounded-full absolute -bottom-8 particle-float" style={{ animationDelay: '0.6s' }}></div>
                                    <div className="w-1 h-1 bg-blue-400 rounded-full absolute -left-8 particle-float" style={{ animationDelay: '0.9s' }}></div>
                                  </div>
                                </div>

                                <motion.div
                                  initial={{ y: 10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                    AI Chef at Work
                                  </h3>
                                  <div className="space-y-1">
                                    <motion.p 
                                      className="text-sm text-gray-200 font-medium"
                                      animate={{ opacity: [0.5, 1, 0.5] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    >
                                      Analyzing ingredients...
                                    </motion.p>
                                    <motion.p 
                                      className="text-xs text-gray-400"
                                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                                    >
                                      Creating perfect recipes for you
                                    </motion.p>
                                  </div>
                                </motion.div>

                                <motion.div 
                                  className="mt-6 flex justify-center space-x-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.6 }}
                                >
                                  {[0, 1, 2].map((index) => (
                                    <motion.div
                                      key={index}
                                      className="w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"
                                      animate={{ 
                                        scale: [1, 1.5, 1],
                                        opacity: [0.3, 1, 0.3] 
                                      }}
                                      transition={{ 
                                        duration: 1.5, 
                                        repeat: Infinity,
                                        delay: index * 0.2 
                                      }}
                                    />
                                  ))}
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        <motion.p 
                          className="text-gray-300 text-xs sm:text-sm"
                          animate={loading ? { opacity: [0.5, 1, 0.5] } : {}}
                          transition={loading ? { duration: 2, repeat: Infinity } : {}}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="inline-block w-1 h-1 bg-orange-400 rounded-full animate-pulse"></span>
                              <span>AI is crafting your recipes</span>
                              <span className="inline-block w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                            </span>
                          ) : (
                            'Click or drag to replace'
                          )}
                        </motion.p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="upload"
                        className="space-y-3 sm:space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400" />
                        <div>
                          <p className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                            {isDragActive ? 'Drop here' : 'Upload food photo'}
                          </p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            {isDragActive ? 'Drop to auto-generate recipes' : 'JPG, PNG, WebP supported • Auto-analysis enabled'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div 
                      className={`border rounded-lg p-3 mt-4 backdrop-blur-sm ${
                        error.includes('doesn\'t contain food') 
                          ? 'bg-amber-500/10 border-amber-500/20' 
                          : 'bg-red-500/10 border-red-500/20'
                      }`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <div className="flex items-center gap-2 justify-center">
                        <span className="text-lg">
                          {error.includes('doesn\'t contain food') ? '🍽️' : '⚠️'}
                        </span>
                        <p className={`text-center text-xs sm:text-sm ${
                          error.includes('doesn\'t contain food') 
                            ? 'text-amber-400' 
                            : 'text-red-400'
                        }`}>
                          {error}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {recipes.length > 0 ? (
              <motion.div 
                className="space-y-4 order-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center mb-3 sm:mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                    {recipes.length} Recipe{recipes.length > 1 ? 's' : ''} Found
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm">Click any recipe for full details</p>
                </div>
                
                <div className="space-y-3 max-h-[60vh] sm:max-h-96 overflow-y-auto pr-2 scroll-indicator smooth-scroll scrollbar-glass">
                  {recipes.map((recipe, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card 
                        className="bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                        onClick={() => setSelectedRecipe(recipe)}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-2">
                            <CardTitle className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                              {recipe.recipeName}
                            </CardTitle>
                            <div className="flex items-center gap-2 self-start sm:self-auto">
                              <Clock className="w-3 h-3 text-orange-400" />
                              <span className="text-xs text-orange-400 font-medium">{recipe.time}</span>
                            </div>
                          </div>
                          
                          <CardDescription className="text-gray-300 text-xs sm:text-sm line-clamp-2 mb-2 sm:mb-3">
                            {recipe.description}
                          </CardDescription>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Users className="w-3 h-3" />
                              <span>{recipe.mainIngredients.length} ingredients</span>
                            </div>
                            <div className="flex items-center gap-1 text-orange-400 text-xs">
                              <Eye className="w-3 h-3" />
                              <span>View Details</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="flex items-center justify-center order-2 min-h-[200px] sm:min-h-[300px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center text-gray-400 px-4">
                  <ChefHat className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-20" />
                  <p className="text-sm sm:text-base">Upload a food photo to discover amazing recipes</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border-white/10 text-white scrollbar-glass mx-4 sm:mx-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 pr-8">
                  {selectedRecipe.recipeName}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2 text-orange-400">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{selectedRecipe.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-400">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">{selectedRecipe.mainIngredients.length} ingredients</span>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">{selectedRecipe.description}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-base sm:text-lg">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                        Ingredients
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2 sm:space-y-3">
                        {selectedRecipe.mainIngredients.map((ingredient, i) => (
                          <li key={i} className="flex items-start gap-2 sm:gap-3 text-gray-300">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm sm:text-base lg:text-lg leading-relaxed">{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                    <CardHeader className="pb-3 sm:pb-6">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-base sm:text-lg">
                        <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                        Instructions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ol className="space-y-3 sm:space-y-4">
                        {selectedRecipe.instructions.map((step, i) => (
                          <li key={i} className="flex gap-3 sm:gap-4 text-gray-300">
                            <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center mt-1">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed text-sm sm:text-base lg:text-lg">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-white/70 text-sm">
              <p>© {new Date().getFullYear()} FlavorLens. Developed by</p>
              <p className="text-white font-medium">John Mamanao, Software Developer</p>
            </div>
            
            <motion.a
              href="https://github.com/BeastNectus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-lg transition-all duration-300 text-white/80 hover:text-white group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-4 h-4 group-hover:text-orange-400 transition-colors" />
              <span className="text-sm font-medium">BeastNectus</span>
            </motion.a>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
