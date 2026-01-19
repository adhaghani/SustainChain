import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client
const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

/**
 * Extracted bill data structure
 */
export interface BillExtractionResult {
  utilityType: 'electricity' | 'water' | 'fuel' | 'other';
  provider: string;
  usage: number;
  unit: 'kWh' | 'm³' | 'L' | 'kg';
  billingDate: string; // ISO date string
  amount: number;
  currency: string;
  accountNumber: string;
  meterNumber?: string;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  confidence: number; // 0-1
  rawResponse?: string;
}

const EXTRACTION_PROMPT = `You are an expert at reading Malaysian utility bills. Analyze this utility bill image and extract the following information in JSON format:

{
  "utilityType": "electricity" | "water" | "fuel" | "other",
  "provider": "string (e.g., TNB, SAJ Energy, IWK, SESB, SEB, Petron, Shell)",
  "usage": number (the consumption amount - kWh for electricity, m³ for water, L for fuel),
  "unit": "kWh" | "m³" | "L" | "kg",
  "billingDate": "YYYY-MM-DD",
  "amount": number (bill amount in MYR),
  "currency": "MYR",
  "accountNumber": "string",
  "meterNumber": "string or null if not found",
  "billingPeriodStart": "YYYY-MM-DD or null",
  "billingPeriodEnd": "YYYY-MM-DD or null",
  "confidence": number between 0 and 1 (how confident you are in the extraction accuracy)
}

Important notes:
- For TNB bills, look for "kWh" usage, "Jumlah Penggunaan" or "Total Usage"
- For SAJ/IWK water bills, look for "m³" or "cubic meters"
- For fuel receipts, look for liters (L) or kilograms (kg) for LNG
- The billing date is usually labeled "Tarikh Bil" or "Bill Date"
- Account number may be labeled "No. Akaun" or "Account No."
- If you cannot read a field clearly, estimate based on context and lower your confidence score
- Return ONLY the JSON object, no additional text

Analyze the bill image now:`;

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    // Get form data with image
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const tenantId = formData.get('tenantId') as string | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (!imageUrl && !imageFile) {
      return NextResponse.json(
        { error: 'No image provided. Send either imageUrl or image file.' },
        { status: 400 }
      );
    }

    if (!tenantId) {
      return NextResponse.json(
        { error: 'tenantId is required' },
        { status: 400 }
      );
    }

    // Prepare image for Gemini
    let imagePart: { inlineData: { data: string; mimeType: string } } | { fileUri: string; mimeType: string };

    if (imageFile) {
      // Convert file to base64
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      imagePart = {
        inlineData: {
          data: base64,
          mimeType: imageFile.type,
        },
      };
    } else if (imageUrl) {
      // Fetch and convert URL to base64
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const mimeType = response.headers.get('content-type') || 'image/jpeg';
      imagePart = {
        inlineData: {
          data: base64,
          mimeType,
        },
      };
    } else {
      return NextResponse.json(
        { error: 'Invalid image input' },
        { status: 400 }
      );
    }

    // Call Gemini Vision API
    const model = genAI.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: EXTRACTION_PROMPT },
            imagePart,
          ],
        },
      ],
      config: {
        temperature: 0.1, // Low temperature for factual extraction
        maxOutputTokens: 1024,
      },
    });

    const result = await model;
    const responseText = result.text || '';

    // Parse JSON from response
    let extractedData: BillExtractionResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      extractedData = JSON.parse(jsonMatch[0]);
      extractedData.rawResponse = responseText;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', responseText);
      return NextResponse.json(
        { 
          error: 'Failed to parse bill data from AI response',
          rawResponse: responseText,
        },
        { status: 422 }
      );
    }

    // Validate required fields
    const requiredFields = ['utilityType', 'usage', 'unit', 'billingDate', 'amount'];
    const missingFields = requiredFields.filter(
      field => extractedData[field as keyof BillExtractionResult] === undefined
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          partialData: extractedData,
        },
        { status: 422 }
      );
    }

    // Return extracted data
    return NextResponse.json({
      success: true,
      data: extractedData,
      message: extractedData.confidence < 0.7 
        ? 'Low confidence extraction - please review carefully'
        : 'Bill extracted successfully',
    });

  } catch (error) {
    console.error('Error analyzing bill:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to analyze bill',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
