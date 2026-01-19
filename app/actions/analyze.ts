"use server";

import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

// Malaysia's grid emission factor (kg CO2 per kWh)
const MALAYSIA_GRID_EMISSION_FACTOR = 0.78;

// Water-related emission factor (kg CO2 per m3 - includes treatment and distribution)
const WATER_EMISSION_FACTOR = 0.344;

export interface BillAnalysisResult {
  success: boolean;
  data?: {
    utilityType: "electricity" | "water";
    consumption: number;
    unit: string;
    billingPeriod: string;
    accountNumber: string;
    co2Emissions: number;
    esgImpactScore: number;
    sedgAlignment: string;
  };
  error?: string;
}

/**
 * Analyzes a Malaysian utility bill (TNB or Air Selangor) using Gemini AI
 */
export async function analyzeBill(formData: FormData): Promise<BillAnalysisResult> {
  try {
    const file = formData.get("file") as File;
    
    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Please upload an image (JPEG, PNG, WebP) or PDF file.",
      };
    }

    // Convert file to base64 for Gemini API
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    // Prepare the prompt for Gemini
    const prompt = `You are analyzing a Malaysian utility bill. This could be either:
1. TNB (Tenaga Nasional Berhad) - Electricity bill
2. Air Selangor - Water bill

Extract the following information in JSON format:
{
  "utilityType": "electricity" or "water",
  "consumption": numeric value only (kWh for electricity, m³ for water),
  "billingPeriod": "start date - end date format",
  "accountNumber": "account number from the bill"
}

Important:
- For consumption, extract ONLY the numeric value
- For billingPeriod, provide the date range in a readable format
- For accountNumber, extract the full account/customer number
- Respond ONLY with valid JSON, no additional text
- If the bill is not from TNB or Air Selangor, return an error`;

    // Call Gemini API
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: file.type,
      },
    };

    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: [
        {
          role: "admin",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: file.type,
              },
            },
            imagePart,
          ],
        },
      ],
    });
    const text = result.text;

    let extractedData;
    try {
        if(text){
     // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      extractedData = JSON.parse(cleanedText);
        }
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text ? text : parseError);
      return {
        success: false,
        error: "Failed to extract data from the bill. Please ensure the image is clear and contains a valid TNB or Air Selangor bill.",
      };
    }

    // Validate extracted data
    if (!extractedData.utilityType || !extractedData.consumption) {
      return {
        success: false,
        error: "Could not extract required information from the bill.",
      };
    }

    // Calculate CO2 emissions based on utility type
    const consumption = Number(extractedData.consumption);
    let co2Emissions: number;
    let unit: string;

    if (extractedData.utilityType === "electricity") {
      co2Emissions = consumption * MALAYSIA_GRID_EMISSION_FACTOR;
      unit = "kWh";
    } else {
      co2Emissions = consumption * WATER_EMISSION_FACTOR;
      unit = "m³";
    }

    // Calculate ESG Impact Score (0-100)
    // Lower consumption = higher score
    const baselineConsumption = extractedData.utilityType === "electricity" ? 500 : 30; // Average monthly consumption
    const efficiency = Math.max(0, (baselineConsumption - consumption) / baselineConsumption);
    const esgImpactScore = Math.round(50 + (efficiency * 50)); // Score between 50-100

    // SEDG Alignment information
    const sedgAlignment = `This report aligns with Capital Markets Malaysia's Simplified ESG Disclosure Guide (SEDG), specifically addressing:
• Environmental Performance - Energy & Water Consumption (Section 2.1)
• GHG Emissions Disclosure (Scope 2)
• Resource Efficiency Metrics for SMEs`;

    return {
      success: true,
      data: {
        utilityType: extractedData.utilityType,
        consumption,
        unit,
        billingPeriod: extractedData.billingPeriod || "N/A",
        accountNumber: extractedData.accountNumber || "N/A",
        co2Emissions: Math.round(co2Emissions * 100) / 100, // Round to 2 decimals
        esgImpactScore: Math.min(100, Math.max(0, esgImpactScore)), // Clamp between 0-100
        sedgAlignment,
      },
    };
  } catch (error) {
    console.error("Error analyzing bill:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
