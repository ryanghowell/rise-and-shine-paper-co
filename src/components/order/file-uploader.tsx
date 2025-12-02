import { useState, useRef } from "react"
import { Upload, X, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
    onFileSelect: (file: File | null) => void
    selectedFile: File | null
}

export function FileUploader({ onFileSelect, selectedFile }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0])
        }
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0])
        }
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-charcoal">
                Upload Artwork
            </h3>

            {!selectedFile ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200",
                        isDragging
                            ? "border-gold bg-gold/5"
                            : "border-charcoal/20 hover:border-charcoal/40 hover:bg-charcoal/5"
                    )}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInput}
                        className="hidden"
                        accept=".pdf,.ai,.eps"
                    />
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-charcoal/5 p-4 rounded-full">
                            <Upload className="w-8 h-8 text-charcoal/60" />
                        </div>
                        <div>
                            <p className="font-medium text-charcoal text-lg">
                                Click or drag file to upload
                            </p>
                            <p className="text-charcoal/60 mt-1">
                                PDF, AI, or EPS (Max 50MB)
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-off-white border border-charcoal/10 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-gold/10 p-3 rounded-lg">
                            <FileText className="w-6 h-6 text-gold" />
                        </div>
                        <div>
                            <p className="font-medium text-charcoal">
                                {selectedFile.name}
                            </p>
                            <p className="text-sm text-charcoal/60">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => onFileSelect(null)}
                        className="text-charcoal/40 hover:text-red-500 h-10 w-10 p-0"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            )}
        </div>
    )
}
