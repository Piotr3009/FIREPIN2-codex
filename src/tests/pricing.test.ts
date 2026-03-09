import { describe, expect, it } from 'vitest';
import { calculatePrice } from '@/lib/pricing';

describe('pricing', () => {
  it('calculates flat', () => expect(calculatePrice({ model: 'flat_per_pin', unitPrice: 100 })).toBe(100));
  it('calculates quantity', () => expect(calculatePrice({ model: 'quantity_based', quantity: 3, unitPrice: 25 })).toBe(75));
});
