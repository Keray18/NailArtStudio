import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { cloudinary, isCloudinaryConfigured } from '../config/cloudinary';
import { AppError } from '../utils/appError';

export interface UploadOptions {
  folder?: string;
  publicId?: string;
  tags?: string[];
  transformation?: Record<string, unknown>[];
}

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export interface CloudinaryDeleteResult {
  result: string;
}

/**
 * Service handling Cloudinary media storage operations.
 * Dedicated upload routes and product media workflows will be plugged in subsequent phases.
 */
export class CloudinaryService {
  /**
   * Upload an image buffer or file path to Cloudinary.
   */
  public static async uploadImage(
    filePathOrBase64: string,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    if (!isCloudinaryConfigured()) {
      throw new AppError('Cloudinary is not configured on this server.', 500);
    }

    try {
      const response: UploadApiResponse = await cloudinary.uploader.upload(filePathOrBase64, {
        folder: options.folder || 'nail-art-products',
        public_id: options.publicId,
        tags: options.tags,
        transformation: options.transformation,
        resource_type: 'image',
      });

      return {
        publicId: response.public_id,
        url: response.url,
        secureUrl: response.secure_url,
        format: response.format,
        width: response.width,
        height: response.height,
        bytes: response.bytes,
      };
    } catch (err: unknown) {
      const error = err as UploadApiErrorResponse;
      throw new AppError(
        `Failed to upload image to Cloudinary: ${error.message || 'Unknown error'}`,
        502,
        error
      );
    }
  }

  /**
   * Delete an image from Cloudinary by its public ID.
   */
  public static async deleteImage(publicId: string): Promise<CloudinaryDeleteResult> {
    if (!isCloudinaryConfigured()) {
      throw new AppError('Cloudinary is not configured on this server.', 500);
    }

    try {
      const response = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });

      return { result: response.result };
    } catch (err: unknown) {
      const error = err as UploadApiErrorResponse;
      throw new AppError(
        `Failed to delete image from Cloudinary: ${error.message || 'Unknown error'}`,
        502,
        error
      );
    }
  }
}

