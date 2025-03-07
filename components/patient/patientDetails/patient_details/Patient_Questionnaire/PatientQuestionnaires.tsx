import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { fetchUserQuestionnaire } from "@/services/formServices";
import { QuestionnaireInterface } from "@/types/formInterface";
import React, { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";
import styles from "./questionnaire.module.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateQuestionnairePDF } from "./generateQuestionnairePDF";
import { Copy, EllipsisVertical, FileUp } from "lucide-react";
import { cn } from "@/lib/utils";

const PatientQuestionnaires = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const limit = 5;
  const [resultList, setResultList] = useState<QuestionnaireInterface>();
  const [totalPages, setTotalPages] = useState<number>(1);
  const [type, setType] = useState<string>("onBoarding");

  const patientQuestionnaireTab = [
    {
      value: "onBoarding",
      label: "Onboarding",
    },
    { value: "General-health", label: "General health" },
    {
      value: "Diabetes",
      label: "Diabetes",
    },
    {
      value: "cancel-subscription",
      label: "Cancel Subscription",
    },
  ];

  const handleCopyContent = () => {
    if (!resultList?.data || resultList.data.length === 0) {
      alert("No questionnaire data to copy.");
      return;
    }

    const textToCopy = resultList.data
      .map(
        (result, index) =>
          `Q${index + 1}. ${result.questionText}\nA: ${result.answerText}`
      )
      .join("\n\n");

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Content copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const getUserQuestionnaire = useCallback(
    async (type: string, page?: number, limit?: number) => {
      try {
        setLoading(true);
        const response = await fetchUserQuestionnaire({
          userDetailsId: userDetailsId,
          limit: limit,
          page: page,
          type: type,
        });
        if (response) {
          setResultList(response);
          setTotalPages(Math.ceil(response.total / (limit || 5)));
        }
      } catch (error) {
        setLoading(false);
        console.log("Error", error);
      } finally {
        setLoading(false);
      }
    },
    [userDetailsId]
  );

  useEffect(() => {
    getUserQuestionnaire(type, page, limit);
  }, [getUserQuestionnaire, type, page, limit]);

  return (
    <Tabs value={type} className="flex gap-4 bg-white">
      <div className={styles.questionnaireContainer}>
        <div className="flex flex-row justify-between items-center">
          <TabsList className="pl-4 flex w-fit flex-row gap-4 rounded-lg border bg-white border-none self-end">
            {patientQuestionnaireTab.map((tab) => (
              <CustomTabsTrigger
                value={tab.value}
                key={tab.value}
                onClick={() => setType(tab.value)}
              >
                {tab.label}
              </CustomTabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center justify-end gap-2">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        <TabsContent value={type} key={type} className="flex flex-col gap-4">
          {loading ? (
            <LoadingButton />
          ) : (
            <div className={cn(styles.infoContainer, "group")}>
              <div
                className={cn(
                  styles.buttonContainer,
                  "absolute invisible right-4 group-hover:visible"
                )}
              >
                <Button
                  variant={"outline"}
                  onClick={handleCopyContent}
                  className="p-3"
                >
                  <Copy />
                </Button>
                <Button
                  className="p-3"
                  variant={"outline"}
                  onClick={() => {
                    if (resultList?.data) {
                      generateQuestionnairePDF({ data: resultList.data });
                    }
                  }}
                >
                  <FileUp />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="border border-[#D9D9D9] px-2 h-9 items-center rounded-md">
<<<<<<< HEAD
                    <EllipsisVertical size={16} className="text-gray-500"/>
=======
                    <EllipsisVertical size={16} color="gray" />
>>>>>>> 5c353e5 (Added UI Styles - Badges, Indicators and Misc fixes)
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className={styles.detailsContainer}>
                {resultList?.data ? (
                  resultList?.data?.map((result) => (
                    <div key={result.id} className="flex flex-col">
                      <div className={styles.detailsLabel}>
                        Q. {result.questionText}
                      </div>
                      <div className={`${styles.detailsValue} pl-5 capitalize`}>
                        {result.answerText}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-row w-full justify-center items-center h-full min-h-52">
                    No Questionnaire data found.
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default PatientQuestionnaires;
