import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { generateQuestionnairePDF } from "./generateQuestionnairePDF";

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
    async (page?: number, limit?: number) => {
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
          setTotalPages(Math.ceil(response.total / Number(response.limit)));
        }
      } catch (error) {
        setLoading(false);
        console.log("Error", error);
      } finally {
        setLoading(false);
      }
    },
    [userDetailsId, type]
  );

  useEffect(() => {
    getUserQuestionnaire(page, limit);
  }, [getUserQuestionnaire, page, limit]);

  return (
    <Tabs defaultValue={type} className="flex gap-4">
      <TabsList className="flex flex-col gap-4 h-full p-2 rounded-lg border ">
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
      <div className={styles.questionnaireContainer}>
        {patientQuestionnaireTab.map((tab) => (
          <TabsContent value={tab.value} key={tab.value}>
            {loading && <LoadingButton />}
            <div className={styles.questionnaireContainer}>
              <div className={styles.buttonContainer}>
                <Button variant={"outline"} onClick={handleCopyContent}>
                  Copy Content
                </Button>
                <Button
                  variant={"outline"}
                  onClick={() => {
                    if (resultList?.data) {
                      generateQuestionnairePDF({ data: resultList.data });
                    }
                  }}
                >
                  Export as Pdf
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="border border-[#D9D9D9] p-2 rounded-md">
                    <DotsVerticalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className={styles.infoContainer}>
                <ScrollArea className="h-[calc(70vh-220px)] md:h-[calc(70dvh-200px)]">
                  <div className={styles.detailsContainer}>
                    {resultList?.data?.map((result) => (
                      <div key={result.id} className="flex flex-col">
                        <div className={styles.detailsLabel}>
                          Q. {result.questionText}
                        </div>
                        <div className={`${styles.detailsValue} pl-5 capitalize`}>
                          {result.answerText}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex items-center justify-end space-x-2 py-4">
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
            </div>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default PatientQuestionnaires;
