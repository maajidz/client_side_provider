import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImagesResponseInterface,
  ImagesTestsResponseInterface,
  TestInterface,
} from "@/types/chartsInterface";
import {
  createImageOrder,
  getImagesData,
  getImagesTestsData,
} from "@/services/chartsServices";
import LoadingButton from "@/components/LoadingButton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const AddImagesDialog = ({ userDetailsId }: { userDetailsId: string }) => {
  const [response, setResponse] = useState<ImagesResponseInterface>();
  const [imageTestResponse, setImageTestResponse] =
    useState<ImagesTestsResponseInterface>();
  const [loadingImages, setLoadingImages] = useState<boolean>(false);
  const [loadingTests, setLoadingTests] = useState<boolean>(false);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedTest, setSelectedTest] = useState<TestInterface[]>([]);
  const providerDetails = useSelector((state: RootState) => state.login);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fetchAndSetResponse = async () => {
    setLoadingImages(true);
    try {
      const data = await getImagesData({ page: 1, limit: 10 });
      if (data) {
        setResponse(data);
      }
    } catch (e) {
      console.log("Error", e);
      setLoadingImages(false);
    } finally {
      setLoadingImages(false);
    }
  };

  const fetchImageTestsData = async () => {
    setLoadingTests(true);
    try {
      const responseData = await getImagesTestsData({ limit: 10, page: 1 });
      if (responseData) {
        setImageTestResponse(responseData);
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleImageOrder = async () => {
    if (!selectedImage || !selectedTest.length) {
      console.log("Please select both image and test.");
      return;
    }

    setLoadingOrder(true);
    const requestData = {
      userDetailsId: userDetailsId,
      providerId: providerDetails.providerId,
      ordered_date: new Date().toISOString().split("T")[0],
      imageTypeId: selectedImage,
      imageTestIds: selectedTest.map((test) => test.id),
      note_to_patients: "",
      intra_office_notes: "",
    };
    console.log("Image Order", requestData);
    try {
      await createImageOrder({ requestData });
      showToast({
        toast,
        type: "success",
        message: "Order placed successfully!",
      });
      setSelectedImage("");
      setSelectedTest([]);
      setIsOpen(false);
    } catch (e) {
      console.log("Error", e);
      setLoadingOrder(false);
      showToast({ toast, type: "error", message: "Error!" });
    } finally {
      setLoadingOrder(false);
    }
  };

  useEffect(() => {
    if (selectedImage) {
      fetchImageTestsData();
    }
  }, [selectedImage]);

  if (loadingOrder) {
    return <LoadingButton />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} onClick={fetchAndSetResponse}>
          Search & Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Images</DialogTitle>
          {/* <DialogDescription>Add images to the patient.</DialogDescription> */}
        </DialogHeader>
        {loadingImages || loadingTests ? (
          <LoadingButton />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="image">Images</label>
              <Select
                onValueChange={(value) => setSelectedImage(value)}
                defaultValue={selectedImage}
              >
                <SelectTrigger>
                  <SelectValue placeholder={"Select an image"} />
                </SelectTrigger>
                <SelectContent>
                  {response &&
                    response.data &&
                    response.data.length > 0 &&
                    response.data.map((image) => (
                      <SelectItem key={image.id} value={image.id}>
                        {image.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {selectedImage && (
              <div className="flex flex-col gap-1">
                <label>Test</label>
                {imageTestResponse &&
                  imageTestResponse.data &&
                  imageTestResponse.data.map((item) => (
                    <Checkbox
                      label={item.name}
                      key={item.id}
                      checked={selectedTest.some((test) => test.id === item.id)}
                      onCheckedChange={(checked) => {
                        setSelectedTest((prevSelected) =>
                          checked
                            ? [...prevSelected, item]
                            : prevSelected.filter((test) => test.id !== item.id)
                        );
                      }}
                    />
                  ))}
              </div>
            )}
          </div>
        )}
        <div className="flex justify-end pt-6">
          <Button onClick={handleImageOrder}>Order Image</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddImagesDialog;
