"use client";

import * as React from "react";
import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Upload, Eye, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUpload {
  file: File;
  id: string;
  progress: number;
  error?: string;
  status: "uploading" | "completed" | "error";
  preview?: string;
}

export interface FileUploaderProps {
  /**
   * Callback function that's called when files are uploaded successfully
   * The returned array contains the file paths returned from the server
   */
  onUploadComplete: (filePaths: string[]) => void;

  /**
   * Function to handle the actual file upload to the server
   * Receives the files to upload and returns an array of file paths
   */
  uploadHandler: (files: File[]) => Promise<string[]>;

  /**
   * User details ID needed for many uploads
   */
  userDetailsId?: string;

  /**
   * Additional ID for categorizing uploads (e.g., test ID)
   */
  categoryId?: string;

  /**
   * Whether to auto-upload files as soon as they are selected
   * @default true
   */
  autoUpload?: boolean;

  /**
   * Custom file accept types
   * @default image and pdf files
   */
  acceptedFileTypes?: Record<string, string[]>;

  /**
   * Label to show above the uploader
   */
  label?: string;

  /**
   * Allow multiple file selection
   * @default true
   */
  multiple?: boolean;

  /**
   * Custom CSS class name
   */
  className?: string;
}

export function FileUploader({
  onUploadComplete,
  uploadHandler,
  userDetailsId,
  // categoryId,
  autoUpload = true,
  acceptedFileTypes = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    "application/pdf": [".pdf"],
  },
  label,
  multiple = true,
  className,
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    { path: string; name: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(
    async (filesToUpload: FileUpload[]) => {
      if (!userDetailsId || filesToUpload.length === 0 || uploading) {
        return;
      }

      try {
        setUploading(true);

        // Update progress to show upload started
        setFiles((prev) =>
          prev.map((f) => {
            const fileToUpload = filesToUpload.find((file) => file.id === f.id);
            if (fileToUpload) {
              return { ...f, progress: 20, status: "uploading" };
            }
            return f;
          })
        );

        const imagesToUpload = filesToUpload.map((f) => f.file);

        const response = await uploadHandler(imagesToUpload);

        if (response) {
          // Update progress to show completion
          setFiles((prev) =>
            prev.map((f) => {
              const fileToUpload = filesToUpload.find(
                (file) => file.id === f.id
              );
              if (fileToUpload) {
                return { ...f, progress: 100, status: "completed" };
              }
              return f;
            })
          );

          // Process and store uploaded file info
          const newUploadedFiles = response.map((path) => ({
            path,
            name: path.split("/").pop() || "file",
          }));

          setUploadedFiles((prev) => [...prev, ...newUploadedFiles]);

          // Call onUploadComplete with response
          onUploadComplete(response);

          // Clear the uploading files view after a delay
          setTimeout(() => {
            setFiles((prev) =>
              prev.filter(
                (f) => !filesToUpload.some((file) => file.id === f.id)
              )
            );
          }, 1500);
        }
      } catch (error) {
        console.error("Error uploading files:", error);

        // Update progress to show error
        setFiles((prev) =>
          prev.map((f) => {
            const fileToUpload = filesToUpload.find((file) => file.id === f.id);
            if (fileToUpload) {
              return {
                ...f,
                progress: 0,
                status: "error",
                error: "Upload failed",
              };
            }
            return f;
          })
        );
      } finally {
        setUploading(false);
      }
    },
    [userDetailsId, onUploadComplete, uploadHandler, uploading]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!userDetailsId) {
        return;
      }

      const newFiles = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substring(7),
        progress: 0,
        status: "uploading" as const,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Start upload immediately if autoUpload is enabled
      if (autoUpload) {
        handleUpload(newFiles);
      }
    },
    [userDetailsId, handleUpload, autoUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: acceptedFileTypes,
    disabled: !userDetailsId || uploading,
  });

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const removeUploadedFile = (filePath: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.path !== filePath));

    // Get updated paths and notify parent component
    const updatedPaths = uploadedFiles
      .filter((file) => file.path !== filePath)
      .map((file) => file.path);

    onUploadComplete(updatedPaths);
  };

  const previewFile = (preview: string) => {
    window.open(preview, "_blank");
  };

  // Clean up ObjectURLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex flex-col gap-1">
        {label && <label>{label}</label>}

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : !userDetailsId
              ? "border-muted-foreground/25 opacity-50 cursor-not-allowed"
              : "border-muted-foreground/25 hover:border-primary/50",
            uploading && "pointer-events-none opacity-70"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium">
            {isDragActive
              ? "Drop files here"
              : !userDetailsId
              ? "Select a patient first"
              : uploading
              ? "Upload in progress..."
              : "Drag & drop files here"}
          </p>
          <p className="text-xs font-medium text-muted-foreground mt-1">
            {userDetailsId && !uploading && "or click to select files"}
          </p>
        </div>
      </div>
      {/* Files currently uploading */}
      {files.length > 0 && (
        <div className="space-y-1">
          {files.map((fileUpload) => (
            <div
              key={fileUpload.id}
              className="bg-card rounded-lg p-3 shadow-sm border"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium truncate">
                  {fileUpload.file.name}
                </p>
                <div className="flex items-center gap-2">
                  {fileUpload.preview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => previewFile(fileUpload.preview!)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  {fileUpload.status !== "uploading" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileUpload.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="w-full bg-secondary rounded-full h-1.5 mb-1">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${fileUpload.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span
                  className={cn(
                    fileUpload.status === "error" && "text-destructive",
                    fileUpload.status === "completed" && "text-green-600"
                  )}
                >
                  {fileUpload.status === "error"
                    ? fileUpload.error
                    : fileUpload.status === "completed"
                    ? "Upload complete"
                    : "Uploading..."}
                </span>
                <span>
                  {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Already uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Uploaded Files</h4>
          <div className="flex flex-wrap gap-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.path}
                className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs"
              >
                <FileIcon className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 rounded-full"
                  type="button"
                  onClick={() => previewFile(file.path)}
                >
                  <Eye className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 rounded-full"
                  onClick={() => removeUploadedFile(file.path)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual upload button if autoUpload is disabled */}
      {!autoUpload && files.length > 0 && (
        <Button
          onClick={() => handleUpload(files)}
          disabled={uploading || files.length === 0}
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload Files"}
        </Button>
      )}
    </div>
  );
}
