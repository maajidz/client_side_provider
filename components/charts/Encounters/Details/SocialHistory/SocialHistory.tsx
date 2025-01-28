import SubmitButton from '@/components/custom_buttons/SubmitButton'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { PlusCircle } from 'lucide-react'
import React from 'react'

const SocialHistory = () => {
    return (
        <div className='flex justify-between border-b pb-3 items-center'>
            <div>SocialHistory   ---Pending</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost"><PlusCircle /></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <SubmitButton label='Save Changes' />
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SocialHistory