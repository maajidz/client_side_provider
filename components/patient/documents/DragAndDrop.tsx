import { useState } from "react";

const DragAndDrop = ({
  onFilesDropped,
}: {
  onFilesDropped: (status: boolean, files: File[]) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // dataTransfer.files gives you the list of files that were dropped
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);

    if (droppedFiles) {
      onFilesDropped(true, droppedFiles);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

      if (onFilesDropped) {
        onFilesDropped(true, selectedFiles);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Drag and Drop Document Upload</h1>

      {/* Drag-and-Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="w-full h-52 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center"
      >
        <p className="text-gray-600">Drag files here or click to upload</p>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="mt-4">
          <h2 className="font-bold">Uploaded Document(s):</h2>
          <ul className="mt-2">
            {files.map((file, index) => (
              <li key={index} className="text-sm text-gray-700">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DragAndDrop;




