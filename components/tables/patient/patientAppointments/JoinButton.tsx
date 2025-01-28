import DefaultButton from '@/components/custom_buttons/buttons/DefaultButton';
import React from 'react'

const JoinButton = ({appointmentLink}: {appointmentLink: string}) => {
    const handleJoinClick = () => {
        window.open(appointmentLink, '_blank'); // Open the link in a new tab
    };
    return (
        <DefaultButton  onClick={handleJoinClick}>
            Join
        </DefaultButton>
    )
}

export default JoinButton