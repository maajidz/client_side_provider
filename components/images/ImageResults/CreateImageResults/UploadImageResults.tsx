import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import { Input } from "@/components/ui/input";
import { uploadImageRequest } from "@/services/imageResultServices";
import React, { useState } from "react";
import formStyles from "@/components/formStyles.module.css";

const UploadImageResults = ({
  onUploadComplete,
  userDetailsId,
}: {
  onUploadComplete: (uploadedImages: string[]) => void;
  userDetailsId: string;
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

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
      <div className={formStyles.formBody}>
        <label htmlFor="images">Upload Images</label>
        <Input id="images" type="file" multiple onChange={handleFileChange} />
      </div>
      <DefaultButton disabled={uploading} onClick={handleimageSubmit}>
        {uploading ? "Uploading" : "Upload Images"}
      </DefaultButton>
    </>
  );
};

export default UploadImageResults;
