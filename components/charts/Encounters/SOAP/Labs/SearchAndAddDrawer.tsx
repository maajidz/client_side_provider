import React, { useEffect, useState } from 'react'
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
import { LabsDataResponse, TestsResponseInterface, UserEncounterData } from '@/types/chartsInterface'
import { createLabOrder, getLabsData, getLabTestsData } from '@/services/chartsServices'
import LoadingButton from '@/components/LoadingButton'
import FormLabels from '@/components/custom_buttons/FormLabels'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const SearchAndAddDrawer = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    const [response, setResponse] = useState<LabsDataResponse>()
    const [labTestResponse, setLabTestResponse] = useState<TestsResponseInterface>()
    const [loadingLabs, setLoadingLabs] = useState<boolean>(false)
    const [loadingTests, setLoadingTests] = useState<boolean>(false)
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false)
    const [selectedLab, setSelectedLab] = useState<string>("")
    const [selectedTest, setSelectedTest] = useState<string>("")
    const providerDetails = useSelector((state: RootState) => state.login)

    const fetchAndSetResponse = async () => {
        setLoadingLabs(true)
        try {
            const data = await getLabsData({ page: 1, limit: 10 });
            if (data) {
                setResponse(data);
            }
        } catch (e) {
            console.log("Error", e);
            setLoadingLabs(false);
        } finally {
            setLoadingLabs(false);
        }
    }

    const fetchLabTestsData = async (labId: string) => {
        setLoadingTests(true)
        try {
            const responseData = await getLabTestsData({ limit: 10, page: 1 , query: labId})
            if (responseData) {
                setLabTestResponse(responseData)
            }
        } catch (e) {
            console.log("Error", e)
        } finally {
            setLoadingTests(false);
        }
    }

    // useEffect(() => {

    //     fetchLabTests()
    // }, [selectedLab])


    // const handleLabSelection = async (value: string) => {
    //     try {
    //         const selectedLab = response?.data.find(lab => lab.id === value);
    //         if (selectedLab) {
    //             const requestData = {
    //                 name: selectedLab.name,
    //                 labId: value
    //             };
    //             console.log("Test", requestData);
    //             const testResponse = await createTests({ requestData });
    //             console.log(" Res", testResponse);
    //         }
    //     } catch (e) {
    //         console.log("Error", e);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const handleLabOrder = async () => {
        if (!selectedLab || !selectedTest) {
            console.log("Please select both lab and test.")
            return
        }

        setLoadingOrder(true);
        const requestData = {
            userDetailsId: patientDetails.userDetails.id,
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

        } catch (e) {
            console.log("Error", e);
            setLoadingOrder(false);
        } finally {
            setLoadingOrder(false);
        }
    }

    useEffect(() => {
        if (selectedLab) {
            fetchLabTestsData(selectedLab)
        }
    }, [selectedLab])

    if (loadingOrder) {
        <LoadingButton />
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline' onClick={fetchAndSetResponse}>Search & Add</Button>
            </DrawerTrigger>
            <DrawerContent>
                {loadingLabs || loadingTests ? (
                    <LoadingButton />
                ) : (
                    <div className="flex flex-col  justify-between mx-auto w-full max-w-sm p-3 gap-5">
                        <div className='flex items-center gap-3'>
                            <div className=''>Labs</div>
                            <Select onValueChange={(value) => setSelectedLab(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={"Select a lab"} />
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
                                            {labTestResponse && labTestResponse.data && labTestResponse.data.length > 0 && (
                                                labTestResponse.data.map((test) => (
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