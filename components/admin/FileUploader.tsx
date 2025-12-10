"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
    onFileSelect: (file: File | null) => void;
    currentFileUrl?: string | null;
    accept?: Record<string, string[]>;
    label?: string;
}

export default function FileUploader({
    onFileSelect,
    currentFileUrl,
    accept = {
        "application/pdf": [".pdf"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
    },
    label = "ファイルをドラッグ＆ドロップ、またはクリックして選択",
}: FileUploaderProps) {
    const [previewFile, setPreviewFile] = useState<File | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                setPreviewFile(file);
                onFileSelect(file);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: 1,
    });

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewFile(null);
        onFileSelect(null);
    };

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                    isDragActive
                        ? "border-primary-500 bg-primary-50"
                        : "border-slate-300 hover:border-primary-400 hover:bg-slate-50",
                    (previewFile || currentFileUrl) && "bg-slate-50 border-solid border-slate-200"
                )}
            >
                <input {...getInputProps()} />

                {previewFile ? (
                    <div className="flex items-center justify-center gap-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-200">
                            {previewFile.type.includes("pdf") ? (
                                <FileText className="w-8 h-8 text-red-500" />
                            ) : (
                                <ImageIcon className="w-8 h-8 text-blue-500" />
                            )}
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-slate-900">{previewFile.name}</p>
                            <p className="text-xs text-slate-500">
                                {(previewFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            onClick={removeFile}
                            className="p-1 hover:bg-slate-200 rounded-full transition-colors ml-4"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                ) : currentFileUrl ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-primary-600 font-medium">
                            <FileText className="w-5 h-5" />
                            <span>現在登録済みのファイルがあります</span>
                        </div>
                        <p className="text-xs text-slate-500">
                            変更するには新しいファイルをドロップしてください
                        </p>
                        <a
                            href={currentFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:underline mt-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            現在のファイルを確認する
                        </a>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                        <UploadCloud className="w-10 h-10 mb-2 text-slate-400" />
                        <p className="font-medium">{label}</p>
                        <p className="text-xs">PDF, JPG, PNG (最大 10MB)</p>
                    </div>
                )}
            </div>
        </div>
    );
}
