import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'
import AddMedicationBody from './AddMedicationBody'

const Medications = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

    return (
        <div className='flex justify-between border-b pb-3 items-center'>
            <div>Medications</div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost"><PlusCircle /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Add Medications</DialogTitle>
                    </DialogHeader>
                    <AddMedicationBody
                        onAddClick={() => {
                            setIsAddDialogOpen(false);
                            setIsDetailsDialogOpen(true);
                        }}
                    />
                </DialogContent>
            </Dialog>
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Medication Details</DialogTitle>
                    </DialogHeader>
                    <p>Details about the selected medication go here.</p>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Medications