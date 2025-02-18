import CustomTabsTrigger from '@/components/custom_buttons/buttons/CustomTabsTrigger';
import {
    Tabs,
    TabsContent,
    TabsList,
} from "@/components/ui/tabs"
import DetailsComponent from '@/components/charts/Encounters/SOAP/DetailsComponent'
import TabMenu from '@/components/charts/Encounters/SOAP/TabMenu'
import ChartNotesTabBody from '@/components/charts/Encounters/SOAP/ChartNotesTabBody';
import MUBody from '@/components/charts/Encounters/MU/MUBody';
import { UserEncounterData } from '@/types/chartsInterface';

const SOAPSection = ({encounterId, patientDetails, onClose}: {encounterId: string, patientDetails: UserEncounterData, onClose: () => void;}) => {
    return (
        <div className='flex flex-col gap-3 border '>
            <DetailsComponent patientDetails={patientDetails}/>
            <Tabs defaultValue="chartNotes" className="w-full">
                <div className='flex  flex-row justify-between p-5 gap-4'>
                    <TabsList className="grid w-[500px] grid-cols-2">
                        <CustomTabsTrigger value="chartNotes">Chart Notes</CustomTabsTrigger>
                        <CustomTabsTrigger value="mu">MU</CustomTabsTrigger>
                    </TabsList>
                    <TabMenu patientDetails={patientDetails} onClose={onClose} />
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