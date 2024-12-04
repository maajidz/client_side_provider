import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

const AddLabsDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className='text-blue-500 underline'>Add Labs</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Lab Orders</DialogTitle>
                    <DialogDescription>
                        <div className='flex justify-between items-center'>
                            <div className='font-normal text-black'>Choose Labs</div>
                            <Button className='bg-[#84012A]'>
                                <PlusIcon />
                                <div>New Lab</div>
                            </Button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-4 gap-4 py-4">
                    <div>CBC</div>
                    <div>General</div>
                    <div>B12 Panel</div>
                    <div>CBC</div>
                    <div>General</div>
                    <div>B12 Panel</div>
                </div>
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddLabsDialog