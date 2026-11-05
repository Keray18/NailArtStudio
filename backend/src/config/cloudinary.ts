import { v2 as cloudinary } from 'cloudinary';
import { config } from './env';

// Configure Cloudinary SDK instance with backend environment variables
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Validates whether Cloudinary configuration has all required credentials.
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    config.CLOUDINARY_CLOUD_NAME &&
    config.CLOUDINARY_API_KEY &&
    config.CLOUDINARY_API_SECRET
  );
}

export { cloudinary };

