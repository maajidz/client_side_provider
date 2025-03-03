import { Button } from '@/components/ui/button';
import React from 'react'

const JoinButton = ({appointmentLink, disabled}: {appointmentLink: string, disabled?: boolean}) => {
    const handleJoinClick = () => {
        window.open(appointmentLink, '_blank'); // Open the link in a new tab
    };
    return (
        <Button variant="outline" disabled={disabled} onClick={handleJoinClick}>
            Join
        </Button>
    )
}

export default JoinButton