import React from 'react'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Clipboard, ClipboardPlus, FileText, FlaskConical } from 'lucide-react';
import ChartNotes from './ChartNotes';
// import FlowSheet from './FlowSheet';
// import TreatmentPlan from './TreatmentPlan';
import LabsPreview from './LabsPreview';
import ImagesPreview from './ImagesPreview';
import DocumentPreview from './Documents/DocumentPreview';
// import QuestionnairePreview from './QuestionnairePreview';
import { UserEncounterData } from '@/types/chartsInterface';

const PreviewBody = ({ patientDetails }: { patientDetails: UserEncounterData }) => {
    return (
        <div className='border w-full md:px-0'>
            <Tabs defaultValue="chartNotes" className="w-full">
                <TabsList className="flex w-full justify-between">
                    <TabsTrigger value="chartNotes"><Clipboard /></TabsTrigger>
                    {/* <TabsTrigger value="flowsheet"><Target /></TabsTrigger>
                    <TabsTrigger value="treatmentPlan"><Target /></TabsTrigger> */}
                    <TabsTrigger value="labs"><FlaskConical /></TabsTrigger>
                    <TabsTrigger value="images"><ClipboardPlus /></TabsTrigger>
                    <TabsTrigger value="documents"><FileText /></TabsTrigger>
                    {/* <TabsTrigger value="questionnaires"><FileQuestion /></TabsTrigger> */}
                </TabsList>
                <TabsContent value="chartNotes" className='md:px-0 p-0'>
                    <ChartNotes patientDetails={patientDetails}/>
                </TabsContent>
                {/* <TabsContent value="flowsheet">
                    <FlowSheet />
                </TabsContent>
                <TabsContent value="treatmentPlan">
                    <TreatmentPlan />
                </TabsContent> */}
                <TabsContent value="labs">
                    <LabsPreview />
                </TabsContent>
                <TabsContent value="images">
                    <ImagesPreview />
                </TabsContent>
                <TabsContent value="documents">
                    <DocumentPreview patientDetails={patientDetails} />
                </TabsContent>
                {/* <TabsContent value="questionnaires">
                    <QuestionnairePreview />
                </TabsContent> */}
            </Tabs>
        </div>
    )
}

export default PreviewBody