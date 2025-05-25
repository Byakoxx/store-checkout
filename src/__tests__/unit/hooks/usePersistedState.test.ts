import { renderHook, act } from '@testing-library/react';
import { usePersistedState } from '../../../hooks/usePersistedState';

describe('usePersistedState', () => {
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
  };

  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('should initialize with default value when no stored value exists', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => usePersistedState('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should initialize with stored value when it exists', () => {
    const storedValue = 'stored-value';
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedValue));
    const { result } = renderHook(() => usePersistedState('test-key', 'default'));
    expect(result.current[0]).toBe(storedValue);
  });

  it('should update localStorage when state changes', () => {
    const { result } = renderHook(() => usePersistedState('test-key', 'default'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('new-value')
    );
    expect(result.current[0]).toBe('new-value');
  });

  it('should handle complex objects', () => {
    const defaultValue = { name: 'John', age: 30 };
    const { result } = renderHook(() => usePersistedState('test-key', defaultValue));

    const newValue = { name: 'Jane', age: 25 };
    act(() => {
      result.current[1](newValue);
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify(newValue)
    );
    expect(result.current[0]).toEqual(newValue);
  });

  it('should handle invalid stored JSON', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json');
    const { result } = renderHook(() => usePersistedState('test-key', 'default'));
    expect(result.current[0]).toBe('default');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should handle error when saving to localStorage', () => {
    mockLocalStorage.setItem.mockImplementation(() => { throw new Error('fail'); });
    const { result } = renderHook(() => usePersistedState('test-key', 'default'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should save to localStorage without error (camino feliz)', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const { result } = renderHook(() => usePersistedState('test-key', 'default'));
    act(() => {
      result.current[1]('new-value');
    });
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'));
    expect(result.current[0]).toBe('new-value');
  });
});
