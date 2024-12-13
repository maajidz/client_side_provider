import React from 'react'

const RxPatientDetailsSection = () => {
    return (
        <div className="flex gap-3 p-1 border rounded-lg">
            <div className='flex flex-col border-r p-3'>
                <div>Patient Name</div>
                <div>Patient ID</div>
                <div className='flex gap-2'>
                    <div>Gender</div>
                    <div>/</div>
                    <div>DOB</div>
                </div>
                <div>Address</div>
                <div>Phone No: Phoneno</div>
                <div>Cell: cell</div>
                <div>Vitals: weight</div>
            </div>
            <div className='flex flex-col p-3'>
                <div>Provider Name</div>
                <div>Provider ID</div>
                <div>Facility</div>
                <div>Address</div>
                <div>Phone No: Phoneno</div>
                <div>Fax: Fax</div>
            </div>
        </div>
    )
}

export default RxPatientDetailsSection