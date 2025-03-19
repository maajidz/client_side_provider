import React from 'react'

const FormLabels = ({ label, value, className = '' }: { label?: string; value: React.ReactNode; className?: string; }) => {
    return (
        <div className={`flex gap-1 capitalize items-center text-xs ${className}`}>
            {label && <label className="text-xs font-semibold">{`${label}:`}</label>}
            <span className='font-semibold'>{value}</span>
        </div>
    )
}

export default FormLabels