import { Button } from '@/components/ui/button';
import React from 'react'

const JoinButton = ({appointmentLink}: {appointmentLink: string}) => {
    const handleJoinClick = () => {
        window.open(appointmentLink, '_blank'); // Open the link in a new tab
    };
    return (
        <Button variant="outline" onClick={handleJoinClick}>
            Join
        </Button>
    )
}

export default JoinButton