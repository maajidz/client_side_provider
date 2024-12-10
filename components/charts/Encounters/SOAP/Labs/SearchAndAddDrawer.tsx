import React, { useState } from 'react'
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
import { LabsDataResponse, UserEncounterData } from '@/types/chartsInterface'
import { createLabOrder, createTests, getLabsData } from '@/services/chartsServices'
import LoadingButton from '@/components/LoadingButton'
import FormLabels from '@/components/custom_buttons/FormLabels'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const SearchAndAddDrawer = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    const [response, setResponse] = useState<LabsDataResponse>()
    const [loading, setLoading] = useState<boolean>(false)
    const page = 1;
    const [selectedLab, setSelectedLab] = useState<string>("")
    const providerDetails = useSelector((state: RootState) => state.login)

    const fetchAndSetResponse = async () => {
        setLoading(true)
        try {
            const data = await getLabsData({ page: page, limit: 10 });
            if (data) {
                setResponse(data);
            }
        } catch (e) {
            console.log("Error", e);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const selectedLabData = response?.data.find(lab => lab.id === selectedLab)

    const handleLabSelection = async (value: string) => {
            try {
                const selectedLab = response?.data.find(lab => lab.id === value);
                if (selectedLab) {
                    const requestData = {
                        name: selectedLab.name,
                        labId: value
                    };
                    console.log("Test", requestData);
                    const testResponse = await createTests({ requestData });
                    console.log(" Res", testResponse);
                }
            } catch (e) {
                console.log("Error", e);
            } finally {
                setLoading(false);
            }
    }

    const handleLabOrder = async () => {
        setLoading(true);
        const requestData = {
            userDetailsId: patientDetails.userDetails.id,
            orderedBy: providerDetails.providerId,
            date: new Date().toISOString().split('T')[0],
            labs: [
                selectedLab
            ],
            tests: [],
            isSigned: true
        }
        console.log("Labs", requestData)
        try {
            await createLabOrder({ requestData });

        } catch (e) {
            console.log("Error", e);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }


    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline' onClick={fetchAndSetResponse}>Search & Add</Button>
            </DrawerTrigger>
            <DrawerContent>
                {loading ? <LoadingButton /> : (
                    <div className="flex flex-col  justify-between mx-auto w-full max-w-sm p-3 gap-5">
                        <div className='flex items-center gap-3'>
                            <div className=''>Labs</div>
                            <Select onValueChange={(value) => {
                                setSelectedLab(value)
                                handleLabSelection(value)
                            }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={"Select a lab"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {response && response.data && response.data.length > 0 && (
                                        response.data.map((lab) => (
                                            <SelectItem key={lab.id} value={lab.id}>
                                                {lab.name}
                                            </SelectItem>
                                        ))
                                    )
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedLab && (
                            <div className='flex items-center gap-3 justtify-center'>
                                <FormLabels label='Test' value={selectedLabData?.name} />
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