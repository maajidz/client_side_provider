"use client"


import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import "react-quill/dist/quill.snow.css";
import PageContainer from '@/components/layout/page-container'
import DetailsComponent from '@/components/charts/Encounters/SOAP/DetailsComponent'
import TabMenu from '@/components/charts/Encounters/SOAP/TabMenu'
import ChartNotesTabBody from '@/components/charts/Encounters/SOAP/ChartNotesTabBody';
import MUBody from '@/components/charts/Encounters/MU/MUBody';

const Encounter = () => {
    
    // const [chiefComplaints, setChiefComplaints] = useState("");
    
    return (
        <PageContainer>
            <div className='flex flex-col gap-3 border '>
                <DetailsComponent />
                <Tabs defaultValue="chartNotes" className="w-full">
                    <div className='flex  flex-row justify-between p-5'>
                        <TabsList className="grid w-[500px] grid-cols-2">
                            <TabsTrigger value="chartNotes">Chart Notes</TabsTrigger>
                            <TabsTrigger value="mu">MU</TabsTrigger>
                        </TabsList>
                       <TabMenu />
                    </div>
                    <TabsContent value="chartNotes">
                        <ChartNotesTabBody />
                    </TabsContent>
                    <TabsContent value="mu">
                        <MUBody />
                    </TabsContent>
                </Tabs>
            </div>
        </PageContainer>
    )
}

export default Encounter
