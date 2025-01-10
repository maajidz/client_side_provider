import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadImageRequest } from "@/services/imageResultServices";
import React, { useState } from "react";

const UploadImageResults = ({
  onUploadComplete,
}: {
  onUploadComplete: (uploadedImages: string[]) => void;
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const userDetailsId = "97f41397-3fe3-4f0b-a242-d3370063db33";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const handleimageSubmit = async () => {
    if (!userDetailsId || images.length === 0) {
      alert("Please provide all required information.");
      return;
    }
    console.log("Image Upload Data", images);

    try {
      setUploading(true);

      const response = await uploadImageRequest({
        requestData: {
          images,
          userDetailsId,
        },
      });
      if (response) {
        onUploadComplete(response);
        setImages([]);
      }
      console.log("Upload successful:", response);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div>
        <label htmlFor="images">Upload Images</label>
        <Input id="images" type="file" multiple onChange={handleFileChange} />
      </div>
      <Button disabled={uploading} onClick={handleimageSubmit}>
        {uploading ? "Uploading" : "Upload Images"}
      </Button>
    </>
  );
};

export default UploadImageResults;
