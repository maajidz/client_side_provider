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
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { LabsDataResponse } from '@/types/chartsInterface'
import { getLabsData } from '@/services/chartsServices'
import { Input } from '@/components/ui/input'

const AddImagesDrawer = () => {
    const [response, setResponse] = useState<LabsDataResponse>()
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchAndSetResponse = async () => {
            setLoading(true)
            try {
                const data = await getLabsData({ page: 1, limit: 10 });
                if (data) {
                    setResponse(response);
                }
            } catch (e) {
                console.log("Error", e);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        }
        fetchAndSetResponse();
    })

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline'>Add Images</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="flex justify-between mx-auto w-full max-w-sm p-3 gap-5">
                    <div className='flex items-center gap-3'>
                        <div className='w-full'>Image Type</div>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder={loading ? "Loading..." : "Select Image Type"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Labs</SelectLabel>
                                    {response && response.data ? (
                                        response.data.map((lab) => (
                                            <SelectItem key={lab.id} value={lab.id}>
                                                {lab.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div>No Images Found</div>
                                    )
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='flex items-center gap-3 w-full'>
                        <div className=''>Test</div>
                        <Input  placeholder='Enter test name' className='w-96'/>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default AddImagesDrawer