import React from 'react'

const FormLabels = ({ label, value }: { label: string, value: React.ReactNode;   }) => {
    return (
        <div className='flex gap-1 items-center text-xs'>
            <label className=''>{label}:</label>
            <span className='font-semibold'>{value}</span>
        </div>
    )
}

export default FormLabels
