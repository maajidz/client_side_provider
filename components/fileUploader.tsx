"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/progress";
import { ProgressCircular } from "@/components/ui/progressCircular";
import { X, Upload, Eye } from "lucide-react";

interface FileUpload {
  file: File;
  id: string;
  progress: number;
  error?: string;
  status: "uploading" | "completed" | "error";
  preview?: string;
}

export function FileUploader() {
  const [files, setFiles] = useState<FileUpload[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
      progress: 0,
      status: "uploading" as const,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload for each file
    newFiles.forEach((fileUpload) => {
      simulateUpload(fileUpload.id);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id === fileId && f.status === "uploading") {
            const newProgress = Math.min(f.progress + 10, 100);
            if (newProgress === 100) {
              clearInterval(interval);
              return { ...f, progress: newProgress, status: "completed" };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        })
      );
    }, 500);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const previewFile = (preview: string) => {
    window.open(preview, "_blank");
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium">
          {isDragActive ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          or click to select files
        </p>
      </div>

      <div className="space-y-4">
        {files.map((fileUpload) => (
          <div
            key={fileUpload.id}
            className="bg-card rounded-lg p-4 shadow-sm border"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(fileUpload.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Progress
                    value={fileUpload.progress}
                    className="flex-1"
                  />
                  <ProgressCircular
                    value={fileUpload.progress}
                    size="sm"
                    className="shrink-0"
                  />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <p
                    className={`text-xs ${
                      fileUpload.status === "error"
                        ? "text-destructive"
                        : fileUpload.status === "completed"
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {fileUpload.status === "error"
                      ? fileUpload.error
                      : fileUpload.status === "completed"
                      ? "Upload complete"
                      : "Uploading..."}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}