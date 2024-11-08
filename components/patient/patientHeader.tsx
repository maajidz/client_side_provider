'use client'
import React, { useEffect, useState } from 'react'
import styles from './patient.module.css';
import { UserInfo } from '@/types/userInterface';
import { fetchUserInfo } from '@/services/userServices';
import LoadingButton from '../LoadingButton';
import PatientLabelDetails from './patientLabelDetails';

const PatientHeader = ({ userId }: { userId: string }) => {
    const [response, setResponse] = useState<UserInfo>();
    const [loading, setLoading] = useState(false);
    // const router = useRouter();
    // const handleBackClick = () => {
    //     router.push('/dashboard/patient');
    // }

    useEffect(() => {
        const fetchAndSetResponse = async () => {
            setLoading(true)
            const userData = await fetchUserInfo({ userId: userId });
            if (userData) {
                setResponse(userData);
                setLoading(false);
            }
        };

        fetchAndSetResponse();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingButton />
            </div>
        );
    }

    return (
        <div className='flex flex-row w-full items-center gap-3'>
            <div className={styles.infoContainer}>
                <div className={styles.infoBox}>
                    <PatientLabelDetails label='Name:' value={`${response?.data.firstName} ${response?.data.lastName}`} />
                    <div className='flex flex-row gap-3'>
                        <div>{response?.data.userDetails.gender}/Age</div>
                        <PatientLabelDetails label='ID:' value={userId} />
                    </div>
                    <PatientLabelDetails label='DOB:' value={`${response?.data.userDetails.dob}`} />
                </div>
                <div className={styles.infoBox}>
                    <PatientLabelDetails label='Weight:' value={`${response?.data.userDetails.weight} ${response?.data.userDetails.weightType}`} />
                    <PatientLabelDetails label='Height:' value={`${response?.data.userDetails.height} ${response?.data.userDetails.heightType}`} />
                </div>
            </div>
        </div>
    )
}

export default PatientHeader