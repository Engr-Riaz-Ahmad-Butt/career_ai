import { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FileUploaderProps {
  /**
   * Accepted file types (e.g., ".pdf,.docx,.doc")
   */
  accept?: string;
  
  /**
   * Maximum file size in bytes
   */
  maxSizeMB?: number;
  
  /**
   * Allow multiple files
   */
  multiple?: boolean;
  
  /**
   * Callback when files are selected
   */
  onFilesSelected: (files: File[]) => void;
  
  /**
   * Current uploaded files
   */
  files?: File[];
  
  /**
   * Callback to remove a file
   */
  onRemoveFile?: (index: number) => void;
  
  /**
   * Custom label text
   */
  label?: string;
  
  /**
   * Description text
   */
  description?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Reusable file uploader component with drag-and-drop
 * Standardizes file upload UI across the app
 */
export function FileUploader({
  accept = '.pdf,.docx,.doc',
  maxSizeMB = 10,
  multiple = false,
  onFilesSelected,
  files = [],
  onRemoveFile,
  label = 'Upload File',
  description,
  disabled = false,
  className,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const validateFiles = (fileList: File[]): boolean => {
    setError(null);

    for (const file of fileList) {
      if (file.size > maxSizeBytes) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return false;
      }
    }

    return true;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0 && validateFiles(selectedFiles)) {
      onFilesSelected(selectedFiles);
    }
    // Reset input to allow re-upload of same file
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0 && validateFiles(droppedFiles)) {
      onFilesSelected(droppedFiles);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer',
          isDragging && 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20',
          !isDragging && 'border-gray-300 dark:border-gray-700 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
          aria-label={label}
        />

        <div className="flex flex-col items-center text-center">
          <Upload className="h-10 w-10 text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description || `Drag and drop or click to upload (${accept})`}
          </p>
          {maxSizeMB && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Max size: {maxSizeMB}MB
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              {onRemoveFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFile(index);
                  }}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
