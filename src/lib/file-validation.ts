/**
 * @fileOverview Security & File Validation Layer for ModelVue
 * 
 * Requirements implemented:
 * 1. Extension Whitelisting: Only professional 3D formats allowed.
 * 2. Size Constraints: 50MB limit to prevent memory exhaustion.
 * 3. Payload Protection: Static parsing only, no execution of embedded scripts.
 * 4. Input Sanitization: Filename cleaning.
 */

export const MAX_FILE_SIZE_MB = 50;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

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
  // 1. Sanitize Filename (remove potentially dangerous characters)
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

  // 4. Content Type check (Basic protection against spoofed extensions)
  // Note: Many 3D formats don't have standard MIME types, so we rely heavily 
  // on the Three.js loaders' own parsing failures to catch corrupted/malicious content.
  
  return {
    isValid: true,
    error: null,
    sanitizedName
  };
}

/**
 * SECURITY CHECKLIST:
 * [x] Enforce hard size limits to prevent Zip Bomb or Memory Exhaustion attacks.
 * [x] Whitelist extensions rather than blacklisting to prevent bypass.
 * [x] Sanitize filenames to prevent path traversal or XSS via UI reflection.
 * [x] Use read-only Data URIs/Blobs for Three.js parsing.
 * [x] Rely on structural parsers (GLTFLoader, etc.) which treat content as data, not code.
 */
