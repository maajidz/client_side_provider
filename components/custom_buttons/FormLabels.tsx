import React from 'react'

const FormLabels = ({ label, value }: { label: string, value: React.ReactNode;   }) => {
    return (
        <div className='flex gap-1 items-center'>
            <label className='text-base font-normal'>{label}:</label>
            <span className='text-base font-semibold'>{value}</span>
        </div>
    )
}

export default FormLabels
