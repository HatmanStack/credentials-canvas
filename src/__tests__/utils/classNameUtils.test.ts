import { cn } from 'utils/classNameUtils';

describe('cn utility', () => {
  describe('basic functionality', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('should handle single class name', () => {
      expect(cn('foo')).toBe('foo');
    });

    it('should handle empty inputs', () => {
      expect(cn()).toBe('');
    });

    it('should handle multiple class names', () => {
      expect(cn('foo', 'bar', 'baz', 'qux')).toBe('foo bar baz qux');
    });
  });

  describe('conditional classes', () => {
    it('should handle conditional classes with boolean true', () => {
      expect(cn('foo', true && 'bar')).toBe('foo bar');
    });

    it('should handle conditional classes with boolean false', () => {
      expect(cn('foo', false && 'bar')).toBe('foo');
    });

    it('should handle multiple conditional classes', () => {
      expect(cn('foo', true && 'bar', false && 'baz', true && 'qux')).toBe('foo bar qux');
    });

    it('should handle ternary conditional classes', () => {
      const isActive = true;
      expect(cn('base', isActive ? 'active' : 'inactive')).toBe('base active');
    });

    it('should handle complex conditional expressions', () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn(
        'base',
        isActive && 'active',
        isDisabled && 'disabled',
        isActive && !isDisabled && 'enabled',
      )).toBe('base active enabled');
    });
  });

  describe('Tailwind class conflicts', () => {
    it('should handle padding conflicts', () => {
      expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('should handle margin conflicts', () => {
      expect(cn('m-2', 'm-4')).toBe('m-4');
    });

    it('should handle background color conflicts', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('should handle text size conflicts', () => {
      expect(cn('text-sm', 'text-lg')).toBe('text-lg');
    });

    it('should handle width conflicts', () => {
      expect(cn('w-full', 'w-1/2')).toBe('w-1/2');
    });

    it('should preserve non-conflicting classes', () => {
      expect(cn('px-2', 'py-4')).toBe('px-2 py-4');
    });

    it('should handle multiple conflict types', () => {
      expect(cn('px-2 py-4 bg-red-500', 'px-4 bg-blue-500')).toBe('py-4 px-4 bg-blue-500');
    });
  });

  describe('null and undefined handling', () => {
    it('should handle null', () => {
      expect(cn('foo', null, 'bar')).toBe('foo bar');
    });

    it('should handle undefined', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar');
    });

    it('should handle both null and undefined', () => {
      expect(cn('foo', null, undefined, 'bar')).toBe('foo bar');
    });

    it('should handle only null', () => {
      expect(cn(null)).toBe('');
    });

    it('should handle only undefined', () => {
      expect(cn(undefined)).toBe('');
    });
  });

  describe('arrays', () => {
    it('should handle arrays of class names', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('should handle nested arrays', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz');
    });

    it('should handle arrays with conditionals', () => {
      expect(cn(['foo', true && 'bar', false && 'baz'])).toBe('foo bar');
    });

    it('should handle empty arrays', () => {
      expect(cn([])).toBe('');
    });

    it('should handle arrays with null and undefined', () => {
      expect(cn(['foo', null, undefined, 'bar'])).toBe('foo bar');
    });
  });

  describe('objects', () => {
    it('should handle objects with boolean values', () => {
      expect(cn({ foo: true, bar: false })).toBe('foo');
    });

    it('should handle objects with all true values', () => {
      expect(cn({ foo: true, bar: true, baz: true })).toBe('foo bar baz');
    });

    it('should handle objects with all false values', () => {
      expect(cn({ foo: false, bar: false })).toBe('');
    });

    it('should handle objects with mixed values', () => {
      expect(cn({
        base: true,
        active: true,
        disabled: false,
        hover: true,
      })).toBe('base active hover');
    });

    it('should handle empty objects', () => {
      expect(cn({})).toBe('');
    });
  });

  describe('mixed inputs', () => {
    it('should handle strings, arrays, and objects together', () => {
      expect(cn(
        'base',
        ['foo', 'bar'],
        { active: true, disabled: false },
        'extra',
      )).toBe('base foo bar active extra');
    });

    it('should handle complex mixed inputs', () => {
      expect(cn(
        'px-2 py-1',
        true && 'bg-blue-500',
        ['text-white', false && 'hidden'],
        { rounded: true, shadow: false },
        null,
        undefined,
        'hover:bg-blue-600',
      )).toBe('px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600');
    });

    it('should handle conflicts in mixed inputs', () => {
      expect(cn(
        'px-2',
        ['px-4', 'py-2'],
        { active: true },
        'px-6',
      )).toBe('py-2 active px-6');
    });
  });

  describe('real-world scenarios', () => {
    it('should handle button classes with state', () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn(
        'px-4 py-2 rounded-lg font-semibold',
        'transition-all duration-200',
        isActive && 'bg-blue-500 text-white',
        !isActive && 'bg-gray-200 text-gray-700',
        isDisabled && 'opacity-50 cursor-not-allowed',
      )).toBe('px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-blue-500 text-white');
    });

    it('should handle responsive classes', () => {
      expect(cn(
        'w-full',
        'md:w-1/2',
        'lg:w-1/3',
        'xl:w-1/4',
      )).toBe('w-full md:w-1/2 lg:w-1/3 xl:w-1/4');
    });

    it('should handle hover and focus states', () => {
      expect(cn(
        'bg-blue-500',
        'hover:bg-blue-600',
        'focus:bg-blue-700',
        'active:bg-blue-800',
      )).toBe('bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-800');
    });

    it('should handle dark mode classes', () => {
      expect(cn(
        'bg-white text-black',
        'dark:bg-gray-900 dark:text-white',
      )).toBe('bg-white text-black dark:bg-gray-900 dark:text-white');
    });
  });

  describe('edge cases', () => {
    it('should handle very long class names', () => {
      const longClasses = 'this-is-a-very-long-class-name-that-should-still-work-properly';
      expect(cn(longClasses)).toBe(longClasses);
    });

    it('should handle special characters in class names', () => {
      expect(cn('foo-bar', 'baz_qux', 'test:123')).toBe('foo-bar baz_qux test:123');
    });

    it('should handle numbers in class names', () => {
      expect(cn('col-span-2', 'gap-4', 'p-8')).toBe('col-span-2 gap-4 p-8');
    });

    it('should trim whitespace', () => {
      expect(cn('  foo  ', '  bar  ')).toBe('foo bar');
    });

    it('should handle duplicate classes', () => {
      // Note: cn doesn't deduplicate non-Tailwind classes
      expect(cn('foo', 'bar', 'foo')).toBe('foo bar foo');
    });
  });
});
