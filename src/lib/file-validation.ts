/**
 * @fileOverview Security & File Validation Layer for ModelVue
 */

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Comprehensive list of supported formats. 
 * Note: CAD formats (.step, .ifc, etc.) are listed to provide better error messages
 * rather than just "unsupported".
 */
export const SUPPORTED_EXTENSIONS = [
  'gltf', 'glb', 'obj', 'fbx', 'stl', 'ply', 'dae', 
  '3mf', '3ds', 'amf', 'wrl', '3dm', 'step', 'stp', 
  'iges', 'igs', 'brep', 'fcstd', 'ifc', 'bim', 'off'
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
      error: `Unsupported format: .${extension}. Please use a common 3D interchange format like GLB, FBX, or OBJ.`,
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
