import SubmitButton from "@/components/custom_buttons/buttons/SubmitButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { uploadDocumentSchema } from "@/schema/documentsSchema";
import { uploadDocument } from "@/services/documentsServices";
import { RootState } from "@/store/store";
import { UploadDocumentType } from "@/types/documentsInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import formStyles from "@/components/formStyles.module.css";

function UploadDocumentDialog({
  userDetailsId,
  open,
  droppedFiles,
  onFileSelected,
  onFetchDocuments,
}: {
  userDetailsId: string;
  open: boolean;
  droppedFiles: File[];
  onFileSelected: (status: boolean) => void;
  onFetchDocuments: () => void;
}) {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Ref for File Input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File Input State
  const [images, setImages] = useState<File[]>([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Toast State
  const { toast } = useToast();

  // Form State
  const form = useForm<z.infer<typeof uploadDocumentSchema>>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      file_for_review: false,
    },
  });

  useEffect(() => {
    if (droppedFiles.length > 0) {
      setImages(droppedFiles);
    }
  }, [droppedFiles]);

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setImages((prev) => [
        ...prev,
        ...selectedFiles.filter(
          (file) =>
            !prev.some((existingFile) => existingFile.name === file.name)
        ),
      ]);
    }
    onFileSelected(true);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (values: z.infer<typeof uploadDocumentSchema>) => {
    if (images.length === 0) {
      showToast({
        toast,
        type: "error",
        message: "Please upload at least one document.",
      });
      return;
    }

    setLoading(true);

    const finalRequestData: UploadDocumentType = {
      images,
      document_type: values.document_type,
      date: values.date,
      file_for_review: values.file_for_review,
      provderId: providerDetails.providerId,
      userDetailsId,
    };

    try {
      await uploadDocument({ requestData: finalRequestData });

      showToast({
        toast,
        type: "success",
        message: "Document(s) uploaded successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Document(s) upload failed",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "Document(s) upload failed. An unknown error occurred",
        });
      }
    } finally {
      form.reset();
      onFetchDocuments();
      setLoading(false);
      onFileSelected(false);
      setImages([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onFileSelected}>
      <DialogTrigger asChild>
        <div>
          <Button variant="ghost" onClick={handleButtonClick}>
            Import
          </Button>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileInput}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[30rem]">
        <DialogHeader>
          <DialogTitle asChild>Upload Document</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Documents */}
            <div className={formStyles.formBody}>
              <FormField
                control={form.control}
                name="file"
                render={() => (
                  <FormItem className={formStyles.formItem}>
                    <FormLabel>Documents</FormLabel>
                    <FormControl>
                      <div>
                        <ul className="text-sm mt-2">
                          {images.map((file, index) => (
                            <li
                              key={`${file} ${index}`}
                              className="font-semibold"
                            >
                              {file.name}
                            </li>
                          ))}
                        </ul>
                        <Input
                          type="file"
                          className="min-h-[90px] w-full"
                          multiple
                          onChange={handleFileInput}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-5">
                {/* Document Type */}
                <FormField
                  control={form.control}
                  name="document_type"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel>Document Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Document Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="labResults">
                              Lab Results
                            </SelectItem>
                            <SelectItem value="imageResults">
                              Image Results
                            </SelectItem>
                            <SelectItem value="other">
                              Other Documents
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className={formStyles.formItem}>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file_for_review"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormLabel className="text-sm font-medium">
                        File for Review
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(checked === true)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="flex flex-row-reverse gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-slate-200 hover:bg-slate-100"
                  onClick={() => {
                    onFileSelected(false);
                    setImages([]);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <SubmitButton label="Upload" disabled={loading} />
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UploadDocumentDialog;
