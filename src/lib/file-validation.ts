/**
 * @fileOverview Security & File Validation Layer for ModelVue
 */

export const MAX_FILE_SIZE_MB = 100; // Increased to 100MB for professional use
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Comprehensive list of supported formats. 
 */
export const SUPPORTED_EXTENSIONS = [
  'gltf', 'glb', 'obj', 'fbx', 'stl', 'ply', 'dae', 
  '3mf', '3ds', 'amf', 'wrl'
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
  
  // Industrial CAD formats that we want to provide specific feedback for
  const cadFormats = ['step', 'stp', 'iges', 'igs', 'brep', 'fcstd', 'ifc', 'bim', '3dm', 'off'];
  
  if (extension && cadFormats.includes(extension)) {
    return {
      isValid: false,
      error: `Format .${extension} is an industrial CAD format. These require server-side conversion or specialized WASM parsers not available in this client-side viewer.`,
      sanitizedName: null
    };
  }

  if (!extension || !SUPPORTED_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: `Unsupported format: .${extension || 'unknown'}. Please use standard 3D formats like GLB, FBX, OBJ, or STL.`,
      sanitizedName: null
    };
  }

  // 3. File Size Validation (100MB Limit)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Max limit is ${MAX_FILE_SIZE_MB}MB for browser inspection.`,
      sanitizedName: null
    };
  }
  
  return {
    isValid: true,
    error: null,
    sanitizedName
  };
}
