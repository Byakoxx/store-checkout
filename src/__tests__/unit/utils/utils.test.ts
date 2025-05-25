import { cn } from '../../../utils/utils';

describe('utils', () => {
  it('should be implemented', () => { });
});

describe('cn', () => {
  it('combina clases simples', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('omite valores falsy', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('combina arrays y objetos', () => {
    expect(cn(['a', 'b'], { c: true, d: false }, 'e')).toBe('a b c e');
  });

  it('elimina duplicados usando tailwind-merge', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4'); // tailwind-merge mantiene el último
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('funciona con clases condicionales', () => {
    expect(cn('a', { b: true, c: false })).toBe('a b');
  });

  it('devuelve string vacío si no hay clases', () => {
    expect(cn()).toBe('');
    expect(cn(null, undefined, false, '')).toBe('');
  });
});
