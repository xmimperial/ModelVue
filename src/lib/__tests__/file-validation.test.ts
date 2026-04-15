
import { describe, it, expect } from 'vitest';
import { validateFile, MAX_FILE_SIZE_BYTES } from '../file-validation';

describe('file-validation utility', () => {
  it('should accept valid file formats', () => {
    const file = new File([''], 'model.glb', { type: '' });
    const result = validateFile(file);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should reject unsupported file formats', () => {
    const file = new File([''], 'document.pdf', { type: 'application/pdf' });
    const result = validateFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Unsupported format');
  });

  it('should reject files exceeding the size limit', () => {
    const largeFile = {
      name: 'large.obj',
      size: MAX_FILE_SIZE_BYTES + 1,
    } as File;
    const result = validateFile(largeFile);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('File is too large');
  });

  it('should sanitize filenames correctly', () => {
    const file = new File([''], 'my@model!.glb', { type: '' });
    const result = validateFile(file);
    expect(result.sanitizedName).toBe('my_model_.glb');
  });
});
