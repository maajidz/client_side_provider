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
import { createImageOrder, getImagesData, getImagesTestsData } from '@/services/chartsServices'
import LoadingButton from '@/components/LoadingButton'
import FormLabels from '@/components/custom_buttons/FormLabels'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const AddImagesDrawer = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    const [response, setResponse] = useState<ImagesResponseInterface>()
    const [imageTestResponse, seImageTestResponse] = useState<ImagesTestsResponseInterface>()
    const [loadingImages, setLoadingImages] = useState<boolean>(false)
    const [loadingTests, setLoadingTests] = useState<boolean>(false)
    const [loadingOrder, setLoadingOrder] = useState<boolean>(false)
    const [selectedImage, setSelectedImage] = useState<string>("")
    const [selectedTest, setSelectedTest] = useState<string>("")
    const providerDetails = useSelector((state: RootState) => state.login)
    const {toast} = useToast();

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
            providerId: providerDetails.providerId,
            ordered_date: new Date().toISOString().split('T')[0],
            imageTypeId: selectedImage,
            imageTestIds: 
                [selectedTest],
            note_to_patients: "",
            intra_office_notes: ""
        }
        console.log("Labs", requestData)
        try {
            await createImageOrder({ requestData });
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                ),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-[#18A900] h-9 w-9 rounded-md items-center justify-center'><Check color='#FFFFFF' /></div>
                    <div>Order places successfully!</div>
                </div>
            });
            setSelectedImage("");
            setSelectedTest("");

        } catch (e) {
            console.log("Error", e);
            setLoadingOrder(false);
            toast({
                className: cn(
                    "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                ),
                variant: "default",
                description: <div className='flex flex-row items-center gap-4'>
                    <div className='flex bg-red-600 h-9 w-9 rounded-md items-center justify-center'><X color='#FFFFFF' /></div>
                    <div>error</div>
                </div>
            });
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
                            <Select onValueChange={(value) => setSelectedImage(value)} defaultValue={selectedImage}>
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