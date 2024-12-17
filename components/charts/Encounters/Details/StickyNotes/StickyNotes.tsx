import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle } from 'lucide-react'
import React, { useState } from 'react'

const StickyNotes = () => {
    const [backgroundColor, setBackgroundColor] = useState<string>("#F4F39E");
    const [content, setContent] = useState("");

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    return (
        <div className='flex justify-between border-b pb-3 items-center'>
            <div>StickyNotes</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost"><PlusCircle /></Button>
                </DialogTrigger>
                <DialogContent className={`sm:max-w-[425px] bg-[${backgroundColor ? backgroundColor : '#F4F39E'}]`}>
                    <DialogHeader>
                        <DialogTitle>
                            <div className='flex gap-2'>
                                <Button variant={'outline'} className='bg-[#F4F39E] border-black' onClick={() => setBackgroundColor("#F4F39E")}>
                                    <div className='h-1'></div>
                                </Button>
                                <Button variant={'outline'} className='bg-[#FFBEFF] border-black' onClick={() => setBackgroundColor("#FFBEFF")}>
                                    <div className='h-1'></div>
                                </Button>
                                <Button variant={'outline'} className='bg-[#91CFFF] border-black' onClick={() => setBackgroundColor("#91CFFF")}>
                                    <div className='h-1'></div>
                                </Button>
                                <Button variant={'outline'} className='bg-[#C2CF6C] border-black' onClick={() => setBackgroundColor("#C2CF6C")}>
                                    <div className='h-1'></div>
                                </Button>
                                <Button variant={'outline'} className='bg-[#FF7878] border-black' onClick={() => setBackgroundColor("#FF7878")}>
                                    <div className='h-1'></div>
                                </Button>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <Textarea
                        value={content}
                        onChange={handleContentChange}
                        autoFocus
                        placeholder='Type something...'
                        className={`border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0`}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StickyNotes