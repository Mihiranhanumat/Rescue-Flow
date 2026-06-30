import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  const { tasks } = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Analyze these tasks: ${JSON.stringify(tasks)}. 
  Provide a JSON response with:
  1. A "productivityScore" (number 0-100).
  2. "rescueActions" (array of 3 short strings).
  Return ONLY the JSON.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return NextResponse.json(JSON.parse(text));
}