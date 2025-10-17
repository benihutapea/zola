import React, { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  accept?: string
  className?: string
  children?: React.ReactNode
}

export function FileUploader({
  onFilesSelected,
  maxFiles = 5,
  accept = "image/*",
  className = "",
  children
}: FileUploaderProps) {
  const t = useTranslations()
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const acceptedFiles = Array.from(e.dataTransfer.files)
        .filter(file => file.type.match(accept.replace("*", ".*")))
        .slice(0, maxFiles)
      
      onFilesSelected(acceptedFiles)
    }
  }, [onFilesSelected, maxFiles, accept])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const acceptedFiles = Array.from(e.target.files)
        .filter(file => file.type.match(accept.replace("*", ".*")))
        .slice(0, maxFiles)
      
      onFilesSelected(acceptedFiles)
    }
  }, [onFilesSelected, maxFiles, accept])

  return (
    <div 
      className={`relative ${className} ${
        dragActive ? 'border-primary bg-primary/10' : ''
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept={accept}
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      {children}
    </div>
  )
}