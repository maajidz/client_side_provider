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
import { ImagesResponseInterface, ImagesTestsResponseInterface, UserEncounterData } from '@/types/chartsInterface'
import { createLabOrder, getImagesData, getImagesTestsData } from '@/services/chartsServices'
import LoadingButton from '@/components/LoadingButton'
import FormLabels from '@/components/custom_buttons/FormLabels'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const AddImagesDrawer = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    const [response, setResponse] = useState<ImagesResponseInterface>()
    const [imageTestResponse, seImageTestResponse] = useState<ImagesTestsResponseInterface>()
    const [loadingImages, setLoadingImages] = useState<boolean>(false)
    const [loadingTests, setLoadingTests] = useState<boolean>(false)
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false)
    const [selectedImage, setSelectedImage] = useState<string>("")
    const [selectedTest, setSelectedTest] = useState<string>("")
    const providerDetails = useSelector((state: RootState) => state.login)

    const fetchAndSetResponse = async () => {
        setLoadingImages(true)
        try {
            const data = await getImagesData({ page: 1, limit: 10 });
            if (data) {
                setResponse(data);
            }
        } catch (e) {
            console.log("Error", e);
            setLoadingImages(false);
        } finally {
            setLoadingImages(false);
        }
    }

    const fetchImageTestsData = async () => {
        setLoadingTests(true)
        try {
            const responseData = await getImagesTestsData({ limit: 10, page: 1 })
            if (responseData) {
                seImageTestResponse(responseData)
            }
        } catch (e) {
            console.log("Error", e)
        } finally {
            setLoadingTests(false);
        }
    }

    const handleImageOrder = async () => {
        if (!selectedImage || !selectedTest) {
            console.log("Please select both lab and test.")
            return
        }

        setLoadingOrder(true);
        const requestData = {
            userDetailsId: patientDetails.userDetails.id,
            orderedBy: providerDetails.providerId,
            date: new Date().toISOString().split('T')[0],
            labs: [
                selectedImage
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
        if (selectedImage) {
            fetchImageTestsData()
        }
    }, [selectedImage])

    if (loadingOrder) {
        <LoadingButton />
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline' onClick={fetchAndSetResponse}>Search & Add</Button>
            </DrawerTrigger>
            <DrawerContent>
                {loadingImages || loadingTests ? (
                    <LoadingButton />
                ) : (
                    <div className="flex flex-col  justify-between mx-auto w-full max-w-sm p-3 gap-5">
                        <div className='flex items-center gap-3'>
                            <div className=''>Images</div>
                            <Select onValueChange={(value) => setSelectedImage(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={"Select a lab"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {response && response.data && response.data.length > 0 && (
                                        response.data.map((image) => (
                                            <SelectItem key={image.id} value={image.id}>
                                                {image.name}
                                            </SelectItem>
                                        )))}
                                </SelectContent>
                            </Select>
                        </div>
                        {selectedImage && (
                            <div className='flex items-center gap-3 justtify-center'>
                                <FormLabels label='Test' value={
                                    <Select onValueChange={(value) => {
                                        setSelectedTest(value)
                                    }}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder={"Select a Test"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {imageTestResponse && imageTestResponse.data && imageTestResponse.data.length > 0 && (
                                                imageTestResponse.data.map((test) => (
                                                    <SelectItem key={test.id} value={test.id}>
                                                        {test.name}
                                                    </SelectItem>
                                                ))
                                            )
                                            }
                                        </SelectContent>
                                    </Select>
                                } />
                                <Button className='bg-[#84012A]' onClick={handleImageOrder}>Order Image</Button>
                            </div>
                        )}
                    </div>
                )}
            </DrawerContent>
        </Drawer>
    )
}

export default AddImagesDrawer