
import { describe, it, expect, vi } from 'vitest';
import { LoaderManager } from '../loader-manager';

describe('LoaderManager selection', () => {
  it('should identify the correct extension for routing', async () => {
    // We mock the actual loading but test the extension logic
    const file = new File([''], 'test.glb', { type: '' });
    
    // Testing the logic inside load by verifying it doesn't throw early for valid extensions
    // even if the dynamic import fails in a test environment without full mock setup
    try {
      await LoaderManager.load(file);
    } catch (e: any) {
      // In JSDOM, we expect it to fail further down the line (dynamic import), 
      // but NOT because the extension is unsupported.
      expect(e.message).not.toContain('is not supported by the loader manager');
    }
  });

  it('should throw error for invalid extensions immediately', async () => {
    const file = new File([''], 'test.txt', { type: '' });
    await expect(LoaderManager.load(file)).rejects.toThrow('Format .txt is not supported');
  });
});
