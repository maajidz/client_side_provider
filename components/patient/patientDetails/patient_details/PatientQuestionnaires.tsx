import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchUserQuestionnaire } from "@/services/formServices";
import { QuestionnaireInterface } from "@/types/formInterface";
import React, { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import CustomTabsTrigger from "@/components/custom_buttons/buttons/CustomTabsTrigger";

const PatientQuestionnaires = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const limit = 15;
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
      <TabsList className="flex flex-col gap-4 h-full p-2 rounded-lg border">
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
      <div className="flex-1 p-4 rounded-lg border border-gray-300">
        {patientQuestionnaireTab.map((tab) => (
          <TabsContent value={tab.value} key={tab.value}>
            {loading && <LoadingButton />}
            <ScrollArea className="h-[calc(80vh-220px)] md:h-[calc(80dvh-200px)]">
              <div className="flex flex-col p-5">
                <div>{tab.label}</div>
                {resultList?.data?.map((result) => (
                  <div key={result.id} className="flex flex-col">
                    <div className="text-sm">{result.questionText}</div>
                    <div className="text-lg">{result.answerText}</div>
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
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default PatientQuestionnaires;
