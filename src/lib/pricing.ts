export type PricingModel =
  | 'flat_per_pin'
  | 'area_mm2'
  | 'linear_mm'
  | 'quantity_based'
  | 'base_plus_overage'
  | 'manual_override';

export type PricingInput = {
  model: PricingModel;
  unitPrice?: number;
  basePrice?: number;
  includedAreaMm2?: number;
  includedLengthMm?: number;
  overageUnitPrice?: number;
  widthMm?: number;
  heightMm?: number;
  diameterMm?: number;
  quantity?: number;
  manualPrice?: number;
};

export function calculatePrice(input: PricingInput): number {
  switch (input.model) {
    case 'flat_per_pin':
      return input.unitPrice ?? 0;
    case 'area_mm2':
      return (input.widthMm ?? 0) * (input.heightMm ?? 0) * (input.unitPrice ?? 0);
    case 'linear_mm':
      return (input.diameterMm ?? Math.max(input.widthMm ?? 0, input.heightMm ?? 0)) * (input.unitPrice ?? 0);
    case 'quantity_based':
      return (input.quantity ?? 1) * (input.unitPrice ?? 0);
    case 'base_plus_overage': {
      const amount = (input.widthMm ?? 0) * (input.heightMm ?? 0);
      const included = input.includedAreaMm2 ?? input.includedLengthMm ?? 0;
      const over = Math.max(0, amount - included);
      return (input.basePrice ?? 0) + over * (input.overageUnitPrice ?? 0);
    }
    case 'manual_override':
      return input.manualPrice ?? 0;
  }
}
