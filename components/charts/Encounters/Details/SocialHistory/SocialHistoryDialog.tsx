import SubmitButton from "@/components/custom_buttons/SubmitButton";
import LoadingButton from "@/components/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { addSocialHistorySchema } from "@/schema/addSocialHistorySchema";
import {
  createSocialHistory,
  updateSocialHistory,
} from "@/services/socialHistoryServices";
import { RootState } from "@/store/store";
import {
  CreateSocialHistoryType,
  SocialHistoryInterface,
} from "@/types/socialHistoryInterface";
import { showToast } from "@/utils/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { ContentState, EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Button } from "@/components/ui/button";
import formStyles from "@/components/formStyles.module.css";
import { ScrollArea } from "@/components/ui/scroll-area";

// Load Editor dynamically to prevent SSR issues
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

interface SocialHistoryDialogProps {
  socialHistoryData?: SocialHistoryInterface | null;
  userDetailsId: string;
  isOpen: boolean;
  onClose: () => void;
}

function SocialHistoryDialog({
  socialHistoryData,
  userDetailsId,
  isOpen,
  onClose,
}: SocialHistoryDialogProps) {
  // Editor State
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Provider Details
  const providerDetails = useSelector((state: RootState) => state.login);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Toast State
  const { toast } = useToast();

  // Form State
  const form = useForm<z.infer<typeof addSocialHistorySchema>>({
    resolver: zodResolver(addSocialHistorySchema),
    defaultValues: {
      content: socialHistoryData?.content ?? "",
    },
  });

  // Load existing content into Editor
  useEffect(() => {
    if (socialHistoryData?.content) {
      const blocksFromHtml = htmlToDraft(socialHistoryData.content);
      if (blocksFromHtml) {
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
      }
    }
  }, [socialHistoryData]);

  // Convert editor content to HTML
  const getHtmlOutput = () => {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };

  // Handle Form Submission
  const onSubmit = async () => {
    setLoading(true);

    const finalSocialHistoryData: CreateSocialHistoryType = {
      content: getHtmlOutput(),
      providerId: providerDetails.providerId,
      userDetailsId,
    };

    try {
      if (socialHistoryData) {
        await updateSocialHistory({
          id: socialHistoryData.id,
          requestData: finalSocialHistoryData,
        });
      } else {
        await createSocialHistory({ requestData: finalSocialHistoryData });
      }

      showToast({
        toast,
        type: "success",
        message: socialHistoryData
          ? "Social history updated successfully"
          : "Social history created successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: socialHistoryData
            ? "Social history update failed"
            : "Social history creation failed",
        });
      }
    } finally {
      setLoading(false);
      onClose();
      form.reset();
    }
  };

  if (loading) return <LoadingButton />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>
            {socialHistoryData ? "Update Social History" : "Add Social History"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="max-h-[30rem] h-auto">
              <div className={formStyles.formBody}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col gap-2 border rounded-lg p-2">
                          <Editor
                            editorState={editorState}
                            wrapperClassName="demo-wrapper"
                            editorClassName="demo-editor"
                            onEditorStateChange={(newState) => {
                              setEditorState(newState);
                              field.onChange(
                                draftToHtml(
                                  convertToRaw(newState.getCurrentContent())
                                )
                              );
                            }}
                            toolbar={{
                              options: ["inline", "list", "textAlign", "link"],
                              inline: {
                                options: [
                                  "bold",
                                  "italic",
                                  "underline",
                                  "strikethrough",
                                ],
                              },
                              list: {
                                options: ["unordered", "ordered"],
                              },
                              textAlign: {
                                options: ["left", "center", "right"],
                              },
                              link: {
                                options: ["link"],
                              },
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row gap-2">
                  <div className="w-full">
                    <Button
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        onClose();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <SubmitButton label="Save" disabled={loading} />
                </div>
              </div>
            </ScrollArea>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default SocialHistoryDialog;
