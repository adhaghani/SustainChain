/**
 * Carbon Calculator for Malaysian Utility Bills
 * Uses MGTC (Malaysia Green Technology Centre) 2025 emission factors
 */

export type UtilityType = 'electricity' | 'water' | 'fuel' | 'other';
export type Region = 'peninsular' | 'sabah' | 'sarawak';
export type FuelType = 'diesel_b10' | 'diesel_b20' | 'petrol_ron95' | 'petrol_ron97' | 'lng';

/**
 * MGTC 2025 Emission Factors for Malaysia
 */
export const EMISSION_FACTORS = {
  electricity: {
    peninsular: 0.587, // kg CO2e/kWh (TNB grid)
    sabah: 0.742,      // kg CO2e/kWh (SESB grid)
    sarawak: 0.851,    // kg CO2e/kWh (SEB grid)
    default: 0.587,    // Fallback to peninsular
  },
  water: {
    treatment: 0.298,     // kg CO2e/m³ (water treatment + distribution)
    desalination: 1.87,   // kg CO2e/m³ (desalination plants)
    default: 0.298,
  },
  fuel: {
    diesel_b10: 2.31,     // kg CO2e/L (B10 blend - standard)
    diesel_b20: 2.18,     // kg CO2e/L (B20 blend)
    petrol_ron95: 2.20,   // kg CO2e/L
    petrol_ron97: 2.23,   // kg CO2e/L
    lng: 2.75,            // kg CO2e/kg (compressed natural gas)
    default: 2.31,
  },
} as const;

export interface CO2eCalculationResult {
  co2e: number;           // kg CO2e
  emissionFactor: number; // kg CO2e per unit used
  calculationMethod: string; // Description of method used
}

/**
 * Calculate CO2e emissions for electricity consumption
 * @param kWh - Electricity consumption in kWh
 * @param region - Malaysian region (affects grid emission factor)
 */
export function calculateElectricityCO2e(
  kWh: number, 
  region: Region = 'peninsular'
): CO2eCalculationResult {
  const emissionFactor = EMISSION_FACTORS.electricity[region] || EMISSION_FACTORS.electricity.default;
  const co2e = kWh * emissionFactor;
  
  const regionNames = {
    peninsular: 'Peninsular Malaysia (TNB)',
    sabah: 'Sabah (SESB)',
    sarawak: 'Sarawak (SEB)',
  };
  
  return {
    co2e: Math.round(co2e * 100) / 100, // Round to 2 decimal places
    emissionFactor,
    calculationMethod: `MGTC 2025 - ${regionNames[region]} Grid: ${emissionFactor} kg CO2e/kWh`,
  };
}

/**
 * Calculate CO2e emissions for water consumption
 * @param cubicMeters - Water consumption in m³
 * @param isDesalination - Whether water is from desalination plant
 */
export function calculateWaterCO2e(
  cubicMeters: number, 
  isDesalination: boolean = false
): CO2eCalculationResult {
  const emissionFactor = isDesalination 
    ? EMISSION_FACTORS.water.desalination 
    : EMISSION_FACTORS.water.treatment;
  const co2e = cubicMeters * emissionFactor;
  
  return {
    co2e: Math.round(co2e * 100) / 100,
    emissionFactor,
    calculationMethod: `MGTC 2025 - Water ${isDesalination ? 'Desalination' : 'Treatment'}: ${emissionFactor} kg CO2e/m³`,
  };
}

/**
 * Calculate CO2e emissions for fuel consumption
 * @param amount - Fuel amount (liters for liquid fuel, kg for gas)
 * @param fuelType - Type of fuel
 */
export function calculateFuelCO2e(
  amount: number, 
  fuelType: FuelType = 'diesel_b10'
): CO2eCalculationResult {
  const emissionFactor = EMISSION_FACTORS.fuel[fuelType] || EMISSION_FACTORS.fuel.default;
  const co2e = amount * emissionFactor;
  
  const fuelNames: Record<FuelType, string> = {
    diesel_b10: 'Diesel B10',
    diesel_b20: 'Diesel B20',
    petrol_ron95: 'Petrol RON95',
    petrol_ron97: 'Petrol RON97',
    lng: 'LNG',
  };
  
  const unit = fuelType === 'lng' ? 'kg' : 'L';
  
  return {
    co2e: Math.round(co2e * 100) / 100,
    emissionFactor,
    calculationMethod: `MGTC 2025 - ${fuelNames[fuelType]}: ${emissionFactor} kg CO2e/${unit}`,
  };
}

/**
 * Generic CO2e calculation based on utility type
 * @param usage - Consumption amount
 * @param unit - Unit of measurement
 * @param utilityType - Type of utility
 * @param options - Additional options (region for electricity, fuel type, etc.)
 */
export function calculateCO2e(
  usage: number,
  unit: 'kWh' | 'm³' | 'L' | 'kg',
  utilityType: UtilityType,
  options?: {
    region?: Region;
    fuelType?: FuelType;
    isDesalination?: boolean;
  }
): CO2eCalculationResult {
  switch (utilityType) {
    case 'electricity':
      return calculateElectricityCO2e(usage, options?.region);
    case 'water':
      return calculateWaterCO2e(usage, options?.isDesalination);
    case 'fuel':
      return calculateFuelCO2e(usage, options?.fuelType);
    default:
      // For 'other' or unknown types, return zero with unknown method
      return {
        co2e: 0,
        emissionFactor: 0,
        calculationMethod: 'Unknown utility type - manual calculation required',
      };
  }
}

/**
 * Infer region from provider name
 * @param provider - The utility provider name from the bill
 */
export function inferRegionFromProvider(provider: string): Region {
  const providerLower = provider.toLowerCase();
  
  if (providerLower.includes('sesb') || providerLower.includes('sabah')) {
    return 'sabah';
  }
  if (providerLower.includes('seb') || providerLower.includes('sarawak')) {
    return 'sarawak';
  }
  // Default to peninsular (TNB territory)
  return 'peninsular';
}

/**
 * Get emission factor metadata for display
 */
export function getEmissionFactorMetadata() {
  return {
    source: 'Malaysia Green Technology and Climate Change Centre (MGTC)',
    version: '2025.1',
    lastUpdated: '2025-01-01',
    validUntil: '2025-12-31',
  };
}
