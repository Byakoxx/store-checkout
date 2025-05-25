import { detectCardType, CARD_LOGOS } from '../../../utils/cardUtils';

describe('detectCardType', () => {
  it('detects Visa', () => {
    expect(detectCardType('4111 1111 1111 1111')).toBe('visa');
    expect(detectCardType('4')).toBe('visa');
  });

  it('detects Mastercard', () => {
    expect(detectCardType('5105 1051 0510 5100')).toBe('mastercard');
    expect(detectCardType('5500 0000 0000 0004')).toBe('mastercard');
  });

  it('detects Amex', () => {
    expect(detectCardType('3400 0000 0000 009')).toBe('amex');
    expect(detectCardType('3700 0000 0000 002')).toBe('amex');
  });

  it('detects Discover', () => {
    expect(detectCardType('6011 0000 0000 0004')).toBe('discover');
    expect(detectCardType('6500 0000 0000 0002')).toBe('discover');
  });

  it('detects Diners', () => {
    expect(detectCardType('3000 0000 0000 04')).toBe('diners');
    expect(detectCardType('3600 0000 0000 08')).toBe('diners');
    expect(detectCardType('3800 0000 0000 09')).toBe('diners');
  });

  it('detects JCB', () => {
    expect(detectCardType('3528 0000 0000 0000')).toBe('jcb');
    expect(detectCardType('3530 1113 3330 0000')).toBe('jcb');
  });

  it('detects UnionPay', () => {
    expect(detectCardType('6240 0000 0000 0000')).toBe('unionpay');
    expect(detectCardType('6221 2600 0000 0000')).toBe('unionpay');
  });

  it('detects MIR', () => {
    expect(detectCardType('2200 0000 0000 0000')).toBe('mir');
  });

  it('detects Maestro', () => {
    expect(detectCardType('5018 0000 0000 0009')).toBe('maestro');
    expect(detectCardType('5020 0000 0000 0000')).toBe('maestro');
    expect(detectCardType('5038 0000 0000 0000')).toBe('maestro');
    expect(detectCardType('6304 0000 0000 0000')).toBe('maestro');
    expect(detectCardType('6703 0000 0000 0000')).toBe('maestro');
    expect(detectCardType('6761 0000 0000 0000')).toBe('maestro');
    expect(detectCardType('0604 0000 0000 0000')).toBe('maestro');
    expect(detectCardType('6390 0000 0000 0000')).toBe('maestro');
  });

  it('returns null for unknown or empty', () => {
    expect(detectCardType('')).toBeNull();
    expect(detectCardType(undefined)).toBeNull();
    expect(detectCardType(null)).toBeNull();
    expect(detectCardType('1234')).toBeNull();
  });
});

describe('CARD_LOGOS', () => {
  it('should have all expected card types as keys', () => {
    const expected = [
      'visa', 'mastercard', 'amex', 'discover', 'diners',
      'jcb', 'unionpay', 'mir', 'maestro'
    ];
    expected.forEach(type => {
      expect(CARD_LOGOS).toHaveProperty(type);
    });
  });
});
