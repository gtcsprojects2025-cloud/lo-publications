// src/components/admin/FileDropzone.tsx
"use client";

import { Accept } from "react-dropzone";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, Image as ImageIcon, File } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type FileDropzoneProps = {
  onUploadComplete: (publicUrl: string | null) => void; // Callback when upload finishes
  bucket: string; // e.g. "team-photos", "book-covers", "thumbnails"
  currentUrl?: string | null; // Show existing image if editing
  accept?: Accept; // e.g. "image/*" or ".pdf,.docx"
  maxSizeMB?: number;
  label?: string;
};

export default function FileDropzone({
  onUploadComplete,
  bucket,
  currentUrl,
  accept = { "image/*": [".png", ".gif", ".jpeg", ".jpg"], "application/pdf": [".pdf"] },
  maxSizeMB = 10,
  label = "Upload Photo / File",
}: FileDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Size check
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large (max ${maxSizeMB}MB)`);
      return;
    }

    setError(null);
    setUploading(true);

    // Local preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null); // For PDF/docs, show icon
    }

   // Inside onDrop callback, replace the try block with this:

try {
  const supabase = createClient();

  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  console.log("Uploading to bucket:", bucket);
  console.log("File name:", fileName);
  console.log("File type/size:", file.type, file.size);

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error details:", uploadError);
    throw uploadError;
  }

  console.log("Upload success:", uploadData);

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

  console.log("Public URL:", urlData.publicUrl);

  if (!urlData.publicUrl) throw new Error("No public URL returned");

  onUploadComplete(urlData.publicUrl);
  setPreview(urlData.publicUrl);
} catch (err: any) {
  const errMsg = err.message || "Upload failed – check console";
  setError(errMsg);
  console.error("Full upload error:", err);
  setPreview(null);
  onUploadComplete(null);
}finally {
      setUploading(false);
    }
  }, [onUploadComplete, bucket, maxSizeMB]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize: maxSizeMB * 1024 * 1024,
  });

  const removeFile = () => {
    setPreview(null);
    onUploadComplete(null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
      )}

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center cursor-pointer transition-all
          ${isDragActive ? "border-red-900 bg-red-50" : "border-gray-300 hover:border-red-900"}`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin mb-4" size={48} />
            <p className="text-gray-600">Uploading...</p>
          </div>
        ) : preview ? (
          preview.startsWith("data:image") || preview.startsWith("https://") ? (
            <div className="relative mx-auto max-w-xs">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 rounded-lg object-contain mx-auto"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <File size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-600">File selected</p>
            </div>
          )
        ) : (
          <>
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-2 font-medium">
              {isDragActive ? "Drop file here..." : "Drag & drop or click to upload"}
            </p>
            <p className="text-sm text-gray-500">
              {Object.keys(accept).includes("application/pdf") ? "PDF, DOCX, JPG, PNG" : "JPG, PNG"} (max {maxSizeMB}MB)
            </p>
          </>
        )}
      </div>

      {preview && (
        <button
          onClick={removeFile}
          className="mt-3 text-red-600 hover:text-red-800 flex items-center gap-2 mx-auto text-sm"
        >
          <X size={16} /> Remove file
        </button>
      )}

      {error && <p className="text-red-600 mt-2 text-sm text-center">{error}</p>}
    </div>
  );
}