import { Button } from '@/components/ui/button'
import React from 'react'

const JoinButton = ({appointmentLink}: {appointmentLink: string}) => {
    const handleJoinClick = () => {
        window.open(appointmentLink, '_blank'); // Open the link in a new tab
    };
    return (
        <Button className='bg-[#84012A] h-7 rounded-lg px-3 py-4' onClick={handleJoinClick}>
            Join
        </Button>
    )
}

export default JoinButton