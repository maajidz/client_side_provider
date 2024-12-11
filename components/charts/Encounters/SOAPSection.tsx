import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import DetailsComponent from '@/components/charts/Encounters/SOAP/DetailsComponent'
import TabMenu from '@/components/charts/Encounters/SOAP/TabMenu'
import ChartNotesTabBody from '@/components/charts/Encounters/SOAP/ChartNotesTabBody';
import MUBody from '@/components/charts/Encounters/MU/MUBody';
import { UserEncounterData } from '@/types/chartsInterface';

const SOAPSection = ({encounterId, patientDetails}: {encounterId: string, patientDetails: UserEncounterData}) => {
    return (
        <div className='flex flex-col gap-3 border '>
            <DetailsComponent />
            <Tabs defaultValue="chartNotes" className="w-full">
                <div className='flex  flex-row justify-between p-5 gap-4'>
                    <TabsList className="grid w-[500px] grid-cols-2">
                        <TabsTrigger value="chartNotes">Chart Notes</TabsTrigger>
                        <TabsTrigger value="mu">MU</TabsTrigger>
                    </TabsList>
                    <TabMenu patientDetails={patientDetails}/>
                </div>
                <TabsContent value="chartNotes">
                    <ChartNotesTabBody encounterId={encounterId} patientDetails={patientDetails}/>
                </TabsContent>
                <TabsContent value="mu">
                    <MUBody />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default SOAPSection