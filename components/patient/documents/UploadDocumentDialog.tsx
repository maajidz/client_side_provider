import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
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
import { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";

function UploadDocumentDialog({ userDetailsId }: { userDetailsId: string }) {
  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Ref for File Input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // File Input State
  const [fileInput, setFileInput] = useState<File[]>([]);

  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

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

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // const files = Array.from(event.target.files);
      setFileInput(Array.from(event.target.files));
    }
    setIsOpen(true);
  };

  const handleButtonClick = () => {
    // opens the file dialog
    fileInputRef.current?.click();
  };

  const onSubmit = async (values: z.infer<typeof uploadDocumentSchema>) => {
    setLoading(true);

    const finalRequestData: UploadDocumentType = {
      images: fileInput[0],
      document_type: values.document_type,
      date: values.date,
      file_for_review: values.file_for_review,
      provderId: providerDetails.providerId,
      userDetailsId,
    };

    console.log(finalRequestData);
    try {
      await uploadDocument({ requestData: finalRequestData });
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
      setLoading(false);
      setIsOpen(false);
      setFileInput([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button
          variant="default"
          className="bg-[#84012A] hover:bg-[#6C011F]"
          onClick={handleButtonClick}
        >
          Import
        </Button>
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileInput}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Documents */}
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Documents</FormLabel>
                  <FormControl>
                    <>
                      {fileInput && (
                        <ul className="text-sm mt-2">
                          {Array.from(fileInput).map((file, index) => (
                            <li key={index} className="font-semibold">
                              {file.name}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Input
                        type="file"
                        className="min-h-[90px] w-full"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            const selectedFiles = Array.from(e.target.files);

                            setFileInput((prev) => {
                              const newFiles = selectedFiles.filter(
                                (file) =>
                                  !prev.some(
                                    (existingFile) =>
                                      existingFile.name === file.name
                                  )
                              );
                              return [...prev, ...newFiles];
                            });
                            field.onChange(selectedFiles);
                          }
                        }}
                      />
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col justify-center gap-6">
              {/* Document Type */}
              <FormField
                control={form.control}
                name="document_type"
                render={({ field }) => (
                  <FormItem>
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
                          <SelectItem value="other">Other Documents</SelectItem>
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
                  <FormItem>
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

              {/* For Review Checkbox */}
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
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Share With Patient */}
              {/* <div className="flex items-center gap-6">
                <FormField
                  control={form.control}
                  name="file_for_review"
                  render={() => (
                    <FormItem className="flex flex-row items-center gap-2 space-y-0">
                      <FormLabel
                        htmlFor="share"
                        className="text-sm font-medium"
                      >
                        Share document(s) with patient
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Checkbox id="share" />
                          <FormLabel
                            htmlFor="share"
                            className="text-sm font-medium"
                          >
                            To PHR
                          </FormLabel>
                          <Checkbox id="share" />
                          <FormLabel
                            htmlFor="share"
                            className="text-sm font-medium"
                          >
                            By Text
                          </FormLabel>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}
            </div>
            <DialogFooter className="flex flex-row-reverse gap-2">
              <Button
                type="button"
                variant="outline"
                className="bg-slate-200 hover:bg-slate-100"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#84012A] rounded-md hover:bg-[#6C011F]"
                disabled={loading}
              >
                Upload
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UploadDocumentDialog;

