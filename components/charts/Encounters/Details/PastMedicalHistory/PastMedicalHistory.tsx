import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusCircle } from 'lucide-react'
import React from 'react'

const PastMedicalHistory = () => {
    return (
        <div className='flex justify-between border-b pb-3 items-center'>
            <div>Past Medical History</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost"><PlusCircle /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Past Medical History</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default PastMedicalHistory