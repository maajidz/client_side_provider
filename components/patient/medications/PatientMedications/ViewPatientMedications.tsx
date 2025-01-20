import React from "react";

const ViewPatientMedications = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  // const providerDetails = useSelector((state: RootState) => state.login);
  // const [resultList, setResultList] = useState<SupplementInterface[]>();
  // const [loading, setLoading] = useState(true);
  // const [page, setPage] = useState<number>(1);
  // const [totalPages, setTotalPages] = useState<number>(1);
  // const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // const [editData, setEditData] = useState<SupplementInterface | null>(null);
  // const { toast } = useToast();

  // const fetchSupplementsList = useCallback(
  //   async (userDetailsId: string) => {
  //     try {
  //       if (providerDetails) {
  //         const response = await getSupplements({
  //           userDetailsId,
  //         });
  //         if (response) {
  //           setResultList(response?.data);
  //           setTotalPages(Math.ceil(response.total / response.limit));
  //         }
  //         setLoading(false);
  //       }
  //     } catch (e) {
  //       console.log("Error", e);
  //     }
  //   },
  //   [providerDetails]
  // );

  // useEffect(() => {
  //   fetchSupplementsList(userDetailsId);
  // }, [fetchSupplementsList, userDetailsId]);

  // if (loading) {
  //   return <LoadingButton />;
  // }

  return (
    <>
      <div className="py-5">
        {userDetailsId}
        {/* {resultList && (
          <DataTable
            searchKey="id"
            columns={columns({
              setEditData,
              setIsDialogOpen,
              setLoading,
              showToast: () =>
                showToast({
                  toast,
                  type: "success",
                  message: "Deleted Successfully",
                }),
              fetchSupplementsList: () => fetchSupplementsList(userDetailsId),
            })}
            data={resultList}
            pageNo={page}
            totalPages={totalPages}
            onPageChange={(newPage: number) => setPage(newPage)}
          />
        )} */}
      </div>
    </>
  );
};

export default ViewPatientMedications;
