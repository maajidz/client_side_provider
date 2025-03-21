"use client";

import React from "react";
import { FileUploader } from "@/components/ui/fileUploader";
import { uploadLabFilesRequest } from "@/services/labResultServices";

interface LabFileUploaderProps {
  onUploadComplete: (uploadedFiles: string[]) => void;
  userDetailsId: string;
  testId?: string;
  label?: string;
}

/**
 * Adapter component for Lab Results that uses the generic FileUploader
 * with the specific uploadLabFilesRequest service
 */
export default function LabFileUploader({
  onUploadComplete,
  userDetailsId,
  testId,
  label = "Upload Lab Files"
}: LabFileUploaderProps) {
  // Custom handler that adapts to the uploadLabFilesRequest API
  const handleUpload = async (files: File[]): Promise<string[]> => {
    if (!userDetailsId || files.length === 0) {
      return [];
    }

    try {
      const response = await uploadLabFilesRequest({
        requestData: {
          files,
          userDetailsId,
        },
      });
      
      return response;
    } catch (error) {
      console.error("Error uploading lab files:", error);
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
        'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'text/csv': ['.csv'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
      }}
    />
  );
} 