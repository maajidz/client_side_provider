"use client"

import React, { useEffect, useState } from 'react'
import "react-quill/dist/quill.snow.css";
import SOAPSection from '@/components/charts/Encounters/SOAPSection';
import PreviewBody from '@/components/charts/Encounters/Preview/PreviewBody';
import DetailsBody from '@/components/charts/Encounters/Details/DetailsBody';
import { getUserEncounterDetails } from '@/services/chartsServices';
import LoadingButton from '@/components/LoadingButton';
import { UserEncounterData } from '@/types/chartsInterface';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ArrowBigLeft } from 'lucide-react';

const Encounter = ({ params }: { params: Promise<{ EncounterId: string }> }) => {
    const [encounterId, setEncounterId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<UserEncounterData>()

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setEncounterId(resolvedParams.EncounterId);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!encounterId) return;

        setLoading(true);
        const fetchData = async () => {
            try {
                const encounterData = await getUserEncounterDetails({ encounterId: encounterId });
                if (encounterData) {
                    setData(encounterData[0])
                }
            } catch (e) {
                console.log("Error", e)
            } finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [encounterId])
    // const [chiefComplaints, setChiefComplaints] = useState("");

    if (loading) {
        <div className='flex w-screen h-screen justify-center items-center'>
            <LoadingButton />
        </div>
    }

    return (
        <>
            {
                data && (
                    <div className='flex'>
                        <DetailsBody patientDetails={data} />
                        <ResizablePanelGroup
                            direction="horizontal"
                            className="rounded-lg border"
                        >
                            <ResizablePanel defaultSize={25}>
                                <PreviewBody />
                            </ResizablePanel>
                            <ResizableHandle><ArrowBigLeft /></ResizableHandle>
                            <ResizablePanel>
                                {encounterId && <SOAPSection encounterId={encounterId} patientDetails={data}/>}
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                )
            }
        </>
    )
}

export default Encounter
