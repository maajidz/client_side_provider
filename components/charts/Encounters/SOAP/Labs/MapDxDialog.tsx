import GhostButton from '@/components/custom_buttons/GhostButton'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import SubmitButton from '@/components/custom_buttons/SubmitButton'

const MapDxDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <GhostButton label='Map Dx' />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <SubmitButton label='Save Changes' />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MapDxDialog