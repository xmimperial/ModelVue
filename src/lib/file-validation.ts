/**
 * @fileOverview Security & File Validation Layer for ModelVue
 */

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Comprehensive list of supported formats based on available Three.js loaders
 * and common professional interchange formats.
 */
export const SUPPORTED_EXTENSIONS = [
  '3dm', '3ds', '3mf', 'amf', 'bim', 'brep', 'dae', 'fbx', 'fcstd', 
  'gltf', 'glb', 'ifc', 'iges', 'step', 'stl', 'obj', 'off', 'ply', 'wrl'
];

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
  sanitizedName: string | null;
}

/**
 * Validates a file against security and performance constraints.
 */
export function validateFile(file: File): ValidationResult {
  // 1. Sanitize Filename
  const sanitizedName = file.name.replace(/[^\w\s\.-]/gi, '_');
  
  // 2. Extension Validation
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !SUPPORTED_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: `Unsupported format: .${extension}. Please use a supported 3D format.`,
      sanitizedName: null
    };
  }

  // 3. File Size Validation (50MB Limit)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Max limit is ${MAX_FILE_SIZE_MB}MB.`,
      sanitizedName: null
    };
  }
  
  return {
    isValid: true,
    error: null,
    sanitizedName
  };
}
