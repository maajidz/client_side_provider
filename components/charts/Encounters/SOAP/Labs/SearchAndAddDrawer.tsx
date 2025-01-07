import React, { useCallback, useEffect, useState } from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { LabsDataResponse, Test } from '@/types/chartsInterface'
import { createLabOrder, getLabsData } from '@/services/chartsServices'
import LoadingButton from '@/components/LoadingButton'
import FormLabels from '@/components/custom_buttons/FormLabels'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useToast } from '@/hooks/use-toast'
import { showToast } from '@/utils/utils'

const SearchAndAddDrawer = ({ userDetailsId }: { userDetailsId: string }) => {
    const [response, setResponse] = useState<LabsDataResponse>({ data: [], total: 0 });
    const [labTestResponse, setLabTestResponse] = useState<Test[]>([]);
    const [loadingLabs, setLoadingLabs] = useState<boolean>(false);
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false);
    const [selectedLab, setSelectedLab] = useState<string>("");
    const [selectedTest, setSelectedTest] = useState<string>("");
    const providerDetails = useSelector((state: RootState) => state.login);
    const {toast} = useToast();

    const fetchAndSetResponse = async (page = 1) => {
        setLoadingLabs(true)
        try {
            const data = await getLabsData({ page, limit: 10 });
            if (data) {
                setResponse((prev) => ({
                    data: [...prev.data, ...data.data],
                    total: data.total
                }));
                if (data.data.length < data.total) {
                    await fetchAndSetResponse(page + 1);
                }
            }
        } catch (e) {
            console.log("Error", e);
            setLoadingLabs(false);
        } finally {
            setLoadingLabs(false);
        }
    }

    const fetchLabTestsData = useCallback(async (labId: string) => {
        if (response && response.data) {
            const selectedLab = response.data.find((lab) => lab.id === labId);
            if (selectedLab) {
                setLabTestResponse(selectedLab? selectedLab.tests: []);
            }
        }
    }, [response])

    const handleLabOrder = async () => {
        if (!selectedLab || !selectedTest) {
            console.log("Please select both lab and test.")
            return
        }

        setLoadingOrder(true);
        const requestData = {
            userDetailsId: userDetailsId,
            orderedBy: providerDetails.providerId,
            date: new Date().toISOString().split('T')[0],
            labs: [
                selectedLab
            ],
            tests: [
                selectedTest
            ],
            isSigned: true
        }
        console.log("Labs", requestData)
        try {
            await createLabOrder({ requestData });
            showToast({ toast, type: "success", message: "Order placed successfully" })
            setSelectedLab("");
            setSelectedTest("");
        } catch (e) {
            console.log("Error", e);
            setLoadingOrder(false);
            showToast({ toast, type: "error", message: "Error!" })
        } finally {
            setLoadingOrder(false);
        }
    }

    useEffect(() => {
        if (selectedLab) {
            fetchLabTestsData(selectedLab)
        }
    }, [selectedLab, fetchLabTestsData])

    if (loadingOrder) {
        <LoadingButton />
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline' onClick={()=> fetchAndSetResponse(1)}>Search & Add</Button>
            </DrawerTrigger>
            <DrawerContent>
                {loadingLabs  ? (
                    <LoadingButton />
                ) : (
                    <div className="flex flex-col  justify-between mx-auto w-full max-w-sm p-3 gap-5">
                        <div className='flex items-center gap-3'>
                            <div className=''>Labs</div>
                            <Select onValueChange={(value) => setSelectedLab(value)} defaultValue={ selectedLab }>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a lab"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {response && response.data && response.data.length > 0 && (
                                        response.data.map((lab) => (
                                            <SelectItem key={lab.id} value={lab.id}>
                                                {lab.name}
                                            </SelectItem>
                                        )))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedLab && (
                            <div className='flex items-center gap-3 justtify-center'>
                                <FormLabels label='Test' value={
                                    <Select onValueChange={(value) => {
                                        setSelectedTest(value)
                                    }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder={"Select a Test"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {labTestResponse && labTestResponse.length > 0 && (
                                                labTestResponse.map((test) => (
                                                    <SelectItem key={test.id} value={test.id}>
                                                        {test.name}
                                                    </SelectItem>
                                                ))
                                            )
                                            }
                                        </SelectContent>
                                    </Select>
                                } />
                                <Button className='bg-[#84012A]' onClick={handleLabOrder}>Order Lab</Button>
                            </div>
                        )}
                    </div>
                )}
            </DrawerContent>
        </Drawer>
    )
}

export default SearchAndAddDrawer