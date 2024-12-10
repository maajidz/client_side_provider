import React, {useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Check, PlusIcon, X } from 'lucide-react'
import { LabsDataResponse } from '@/types/chartsInterface'
import { createLabs, getLabsData } from '@/services/chartsServices'
import { Input } from '@/components/ui/input'
import LoadingButton from '@/components/LoadingButton'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

const AddLabsDialog = () => {
    const [response, setResponse] = useState<LabsDataResponse>()
    const [loading, setLoading] = useState<boolean>(false)
    const [showNewLab, setShowNewLab] = useState<boolean>(false)
    const [newLab, setNewLab] = useState<string>("");
    const { toast } = useToast();

    const fetchAndSetResponse = async () => {
        setLoading(true)
        try {
            const data = await getLabsData({ page: 1, limit: 10 });
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

    const createNewLab = async() => {
        if (newLab) {
            const requestData = {
                name: newLab,
                additionalText: ""
            }
            try {
                setLoading(true)
                await createLabs({ requestData: requestData })
                toast({
                    className: cn(
                        "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                    ),
                    variant: "default",
                    description: <div className='flex flex-row items-center gap-4'>
                        <div className='flex bg-[#18A900] h-9 w-9 rounded-md items-center justify-center'><Check color='#FFFFFF' /></div>
                        <div>New Lab added successfully</div>
                    </div>,
                });
                setNewLab("");
                await fetchAndSetResponse();
                setShowNewLab(!showNewLab)
            } catch (e) {
                toast({
                    className: cn(
                        "top-0 right-0 flex fixed md:max-w-fit md:top-4 md:right-4"
                    ),
                    variant: "destructive",
                    description: <div className='flex flex-row items-center gap-4'>
                        <div className='flex bg-red-700 h-9 w-9 rounded-md items-center justify-center'><X color='#FFFFFF' /></div>
                        <div>Faild to add New Lab</div>
                    </div>,
                });
                console.log("Error",e)
            } finally {
                setLoading(false);
            }
        }
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline' onClick={fetchAndSetResponse}>Add Labs</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Add Lab Orders</DialogTitle>
                    <DialogDescription>
                        <div className='flex justify-between items-center'>
                            <div className='font-normal text-black'>Choose Labs</div>
                            {!showNewLab && <Button className='bg-[#84012A]' onClick={() => { setShowNewLab(!showNewLab) }}>
                                <PlusIcon />
                                <div>New Lab</div>
                            </Button>}
                        </div>
                    </DialogDescription>
                </DialogHeader>
                {loading ? <LoadingButton /> : <div className='flex flex-col gap-3'>
                    {showNewLab ?
                        <div className='flex w-full justify-between gap-2'>
                            <div className='flex gap-2 w-full items-center'>
                                <div className='w-36'>
                                    Add New Lab
                                </div>
                                <Input
                                    value={newLab}
                                    onChange={(e) => setNewLab(e.target.value)}
                                    placeholder="Enter lab name"
                                />
                            </div>
                            <div className='flex gap-3'>
                                <Button onClick={createNewLab}>Add</Button>
                                <Button variant={"outline"} onClick={() => { setShowNewLab(!showNewLab) }}>Cancel</Button>
                            </div>
                        </div> :
                        <div></div>}
                    <div className="grid grid-cols-4 gap-4 py-4">
                        {response && response.data && response.data.length > 0 &&
                            response.data.map((lab) => (
                                <Button variant={'link'} key={lab.id}>
                                    {lab.name}
                                </Button >
                            ))
                        }
                    </div>
                </div>}
            </DialogContent>
        </Dialog>
    )
}

export default AddLabsDialog