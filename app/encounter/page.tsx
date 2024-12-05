"use client"

import React from 'react'
import "react-quill/dist/quill.snow.css";
import SOAPSection from '@/components/charts/Encounters/SOAPSection';
import PreviewBody from '@/components/charts/Encounters/Preview/PreviewBody';
import DetailsBody from '@/components/charts/Encounters/Details/DetailsBody';

const Encounter = () => {

    // const [chiefComplaints, setChiefComplaints] = useState("");

    return (
        <div className='flex w-full'>
            <DetailsBody />
            <PreviewBody />
            <SOAPSection />
        </div>
    )
}

export default Encounter
