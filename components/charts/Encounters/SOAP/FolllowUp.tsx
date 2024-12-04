import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

const FolllowUp = () => {
  return (
    <div className='flex justify-between border-b pb-3'>
                <div>Follow Up</div>
                <div className="flex h-5 items-center space-x-4 text-sm">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className='text-blue-500 underline'>Add Follow up</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                            </DialogHeader>
                            <DialogFooter>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
  )
}

export default FolllowUp