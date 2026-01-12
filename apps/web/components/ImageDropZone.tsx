"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { Trash, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  useGetPresignedUploadUrl,
  useUploadToSupabase,
  useDeleteFile,
} from "@/hooks/supabase-calls/useMediaStorage";

type ImageDropZoneProps = {
  text: string;
  filePath: string;
  onFilesChange?: (keys: string[]) => void;
  initialFiles?: string[];
};

interface FileState {
  id: string;
  file: File;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
}

const ImageDropZone = ({
  text,
  onFilesChange,
  filePath,
  initialFiles,
}: ImageDropZoneProps) => {
  const [files, setFiles] = useState<FileState[]>([]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.objectUrl) URL.revokeObjectURL(file.objectUrl);
      });
    };
  }, [files]);

  const getPresignedUrlMutation = useGetPresignedUploadUrl();
  // const uploadToSupabaseMutation = useUploadToSupabase();
  const deleteFileMutation = useDeleteFile();

  const notifyParent = useCallback(
    (updatedFiles: FileState[]) => {
      if (onFilesChange) {
        const successfulKeys = updatedFiles
          .filter((f) => f.key && !f.error)
          .map((f) => f.key!);

        // Defer to next tick to avoid setState during render warning
        queueMicrotask(() => {
          onFilesChange(successfulKeys);
        });
      }
    },
    [onFilesChange]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const fileId = nanoid(6);
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/\s/g, "_");

      const fileKey = `${filePath}/${nanoid(4)}-${sanitizedFileName}`;

      // Add file to state with uploading status
      setFiles((prevFiles) => [
        ...prevFiles,
        {
          id: fileId,
          file,
          uploading: true,
          progress: 0,
          isDeleting: false,
          error: false,
          objectUrl: URL.createObjectURL(file),
        },
      ]);

      try {
        // Step 1: Get presigned URL from server action
        const { signedUrl, token, path } =
          await getPresignedUrlMutation.mutateAsync(fileKey);

        // Step 2: Upload to Supabase with progress tracking
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          // Track upload progress
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const percentComplete = (e.loaded / e.total) * 100;
              setFiles((prevFiles) =>
                prevFiles.map((f) =>
                  f.id === fileId ? { ...f, progress: percentComplete } : f
                )
              );
            }
          });

          // Handle successful upload
          xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
              setFiles((prevFiles) => {
                const updated = prevFiles.map((f) =>
                  f.id === fileId
                    ? { ...f, uploading: false, progress: 100, key: path }
                    : f
                );
                notifyParent(updated);
                return updated;
              });
              toast.success(`${file.name} uploaded successfully!`);
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          });

          // Handle network errors
          xhr.addEventListener("error", () => {
            reject(new Error("Network error during upload"));
          });

          // Open connection and send file
          xhr.open("PUT", signedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.setRequestHeader("x-upsert", "true");
          xhr.send(file);
        });
      } catch (error) {
        console.error("Upload error:", error);
        setFiles((prevFiles) => {
          const updated = prevFiles.map((f) =>
            f.id === fileId
              ? { ...f, error: true, uploading: false, progress: 0 }
              : f
          );
          notifyParent(updated);
          return updated;
        });
        toast.error(
          `Failed to upload ${file.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    },
    [filePath, getPresignedUrlMutation, notifyParent]
  );

  const removeFile = useCallback(
    async (fileId: string) => {
      const fileToRemove = files.find((f) => f.id === fileId);

      if (!fileToRemove) return;

      // If file has a key (uploaded), delete from storage
      if (fileToRemove.key) {
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === fileId ? { ...f, isDeleting: true } : f
          )
        );

        try {
          await deleteFileMutation.mutateAsync(fileToRemove.key);
        } catch (error) {
          console.error("Delete error:", error);
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.id === fileId ? { ...f, isDeleting: false } : f
            )
          );
          return;
        }
      }

      // Remove from state and cleanup object URL
      setFiles((prevFiles) => {
        if (fileToRemove.objectUrl) {
          URL.revokeObjectURL(fileToRemove.objectUrl);
        }
        const updated = prevFiles.filter((f) => f.id !== fileId);
        notifyParent(updated);
        return updated;
      });
    },
    [files, deleteFileMutation, notifyParent]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        acceptedFiles.forEach(uploadFile);
      }
    },
    [uploadFile]
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const tooManyFiles = fileRejections.find(
        (fr) => fr.errors[0].code === "too-many-files"
      );
      const fileTooLarge = fileRejections.find(
        (fr) => fr.errors[0].code === "file-too-large"
      );

      if (tooManyFiles) {
        toast.error("Too many files! You can upload 5-6 images maximum.");
        return;
      }
      if (fileTooLarge) {
        toast.error("File too large! Maximum size is 6MB per image.");
        return;
      }
      toast.error(`Upload failed: ${fileRejections[0].errors[0].message}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: 6,
    minSize: 5,
    maxSize: 1024 * 1024 * 6, // 6MB
    accept: {
      "image/*": [],
    },
  });

  return (
    <>
      <Card
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 ease-in-out w-full h-64",
          isDragActive
            ? "border-primary bg-primary/10 border-solid"
            : "border-border hover:border-primary"
        )}
        {...getRootProps()}
      >
        <CardContent className="flex flex-col items-center justify-center h-full w-full">
          <p className="text-sm text-muted-foreground mb-4">{text}</p>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-y-3">
              <p className="text-xs md:text-sm text-muted-foreground">
                Drag & drop your files here or click to upload
              </p>
              <Button type="button">Upload a file</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {files.map((file) => (
          <div key={file.id} className="relative group">
            <img
              src={file.objectUrl}
              alt={file.file.name}
              className="rounded-xl w-full h-48 object-cover"
            />

            {/* Upload Progress Overlay */}
            {file.uploading && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white mb-2" />
                <span className="text-white text-sm font-medium">
                  {Math.round(file.progress)}%
                </span>
              </div>
            )}

            {/* Deleting Overlay */}
            {file.isDeleting && (
              <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white mb-2" />
                <span className="text-white text-sm font-medium">
                  Deleting...
                </span>
              </div>
            )}

            {/* Success Indicator */}
            {!file.uploading && !file.error && file.key && !file.isDeleting && (
              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            )}

            {/* Error Indicator */}
            {file.error && (
              <div className="absolute inset-0 bg-red-500/20 rounded-xl flex flex-col items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500 mb-1" />
                <span className="text-red-500 text-xs font-medium">
                  Upload Failed
                </span>
              </div>
            )}

            {/* Delete Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(file.id);
              }}
              disabled={file.uploading || file.isDeleting}
              className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
            >
              <Trash className="w-4 h-4 text-white" />
            </button>

            {/* File Name */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 rounded-b-xl p-2">
              <p className="text-white text-xs truncate">{file.file.name}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageDropZone;
