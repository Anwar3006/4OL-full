"use client";
import React, { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { nanoid } from "nanoid";
import { trpc } from "@/lib/trpc";
import { Trash, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type ImageDropZoneProps = {
  text: string;
  filePath: string;
  onFilesChange?: (urls: string[]) => void;
  initialFiles?: string[];
};

const ImageDropZone = ({
  text,
  onFilesChange,
  filePath,
  initialFiles,
}: ImageDropZoneProps) => {
  const [files, setFiles] = useState<
    Array<{
      id: string;
      file: File;
      uploading: boolean;
      progress: number;
      key?: string;
      isDeleting: boolean;
      error: boolean;
      objectUrl?: string;
    }>
  >([]);

  const storageTrpc = trpc.mediaStorage.getPresignedUploadUrl.useMutation();

  const notifyParent = useCallback(
    (updatedFiles: typeof files) => {
      if (onFilesChange) {
        const successfulKeys = updatedFiles
          .filter((f) => f.key && !f.error)
          .map((f) => f.key!);
        onFilesChange(successfulKeys);
      }
    },
    [onFilesChange]
  );

  const uploadFile = async (file: File) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.file === file ? { ...f, uploading: true } : f))
    );

    const fileKey = `${filePath}.${file.type.split("/")[1]}`;

    try {
      const data = await storageTrpc.mutateAsync({
        uniqueKey: fileKey,
        fileSize: file.size,
        fileType: file.type,
      });

      if (!data?.url) {
        throw new Error("No presigned URL received");
      }

      // Use XMLHttpRequest for progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setFiles((prevFiles) =>
              prevFiles.map((f) =>
                f.file === file ? { ...f, progress: percentComplete } : f
              )
            );
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            setFiles((prevFiles) => {
              const updated = prevFiles.map((f) =>
                f.file === file
                  ? { ...f, uploading: false, progress: 100, key: fileKey }
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

        xhr.addEventListener("error", () => {
          reject(new Error("Network error during upload"));
        });

        xhr.open("PUT", data.url);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file); // ✅ Send raw file, not JSON.stringify(file)
      });
    } catch (error) {
      console.error("Upload error:", error);
      setFiles((prevFiles) => {
        const updated = prevFiles.map((f) =>
          f.file === file
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
  };

  const removeFile = useCallback(
    (fileId: string) => {
      setFiles((prevFiles) => {
        const updated = prevFiles.filter((f) => f.id !== fileId);
        notifyParent(updated);
        return updated;
      });
    },
    [notifyParent]
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file: File) => ({
          id: nanoid(6),
          file,
          uploading: false,
          progress: 0,
          isDeleting: false,
          error: false,
          objectUrl: URL.createObjectURL(file),
        })),
      ]);

      acceptedFiles.forEach(uploadFile);
    }
  }, []);

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
    maxSize: 1024 * 1024 * 6,
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

            {/* Success Indicator */}
            {!file.uploading && !file.error && file.key && (
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
              className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageDropZone;
