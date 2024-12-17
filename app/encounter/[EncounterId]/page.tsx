"use client"

import React, { useEffect, useState } from 'react'
import SOAPSection from '@/components/charts/Encounters/SOAPSection';
import PreviewBody from '@/components/charts/Encounters/Preview/PreviewBody';
import DetailsBody from '@/components/charts/Encounters/Details/DetailsBody';
import { getUserEncounterDetails } from '@/services/chartsServices';
import LoadingButton from '@/components/LoadingButton';
import { UserEncounterData } from '@/types/chartsInterface';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ArrowBigLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Encounter = ({ params }: { params: Promise<{ EncounterId: string }> }) => {
    const [encounterId, setEncounterId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<UserEncounterData>();
    const [isSOAPSectionVisible, setIsSOAPSectionVisible] = useState<boolean>(true);

    useEffect(() => {
        const unwrapParams = async () => {
            if (!encounterId) {
                const resolvedParams = await params;
                setEncounterId(resolvedParams.EncounterId);
            }
        };
        unwrapParams();
    }, [params, encounterId]);

    useEffect(() => {
        if (!encounterId) return;

        const fetchData = async () => {

            setLoading(true);

            try {
                const encounterData = await getUserEncounterDetails({ encounterId: encounterId });
                if (encounterData !== undefined && encounterData) {
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

    if (loading) {
        return (
            <div className='flex w-screen h-screen justify-center items-center'>
                <LoadingButton />
            </div>
        )
    }

    if (!data) {
        return <div>{encounterId} No encounter data available.</div>;
    }

    return (
        <div className='flex'>

            <DetailsBody patientDetails={data}   encounterId={encounterId!} />
            <ResizablePanelGroup
                direction="horizontal"
                className="rounded-lg border"
            >
                <ResizablePanel defaultSize={25}>
                    <PreviewBody />
                </ResizablePanel>
                <ResizableHandle><ArrowBigLeft /></ResizableHandle>
                {isSOAPSectionVisible ? (<ResizablePanel>

                    <SOAPSection
                        encounterId={encounterId!}
                        patientDetails={data}
                        onClose={() => setIsSOAPSectionVisible(false)}
                    />
                </ResizablePanel>
                ) : <Button className='bg-[#84012A]' onClick={() => setIsSOAPSectionVisible(true)}>Show SOAP</Button>}
            </ResizablePanelGroup>
        </div>
    )
}

export default Encounter
