"use client";

import React from "react";
import { FileUploader } from "@/components/ui/fileUploader";
import { uploadImageRequest } from "@/services/imageResultServices";

interface ImageFileUploaderProps {
  onUploadComplete: (uploadedImages: string[]) => void;
  userDetailsId: string;
  testId?: string;
  label?: string;
}

/**
 * Adapter component for Image Results that uses the generic FileUploader
 * with the specific uploadImageRequest service
 */
export default function ImageFileUploader({
  onUploadComplete,
  userDetailsId,
  testId,
  label = ""
}: ImageFileUploaderProps) {
  // Custom handler that adapts to the uploadImageRequest API
  const handleUpload = async (files: File[]): Promise<string[]> => {
    if (!userDetailsId || files.length === 0) {
      return [];
    }

    try {
      const response = await uploadImageRequest({
        requestData: {
          images: files,
          userDetailsId,
        },
      });
      
      return response;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  return (
    <FileUploader
      onUploadComplete={onUploadComplete}
      uploadHandler={handleUpload}
      userDetailsId={userDetailsId}
      categoryId={testId}
      label={label}
      autoUpload={true}
      acceptedFileTypes={{
        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
        'application/pdf': ['.pdf'],
      }}
    />
  );
} 