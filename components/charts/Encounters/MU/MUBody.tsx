import GhostButton from '@/components/custom_buttons/buttons/GhostButton';
import { Checkbox } from '@/components/ui/checkbox'
import { RootState } from '@/store/store';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

const MUBody = () => {
    const providerDetails = useSelector((state: RootState) => state.login);
    const [isReferralChecked, setIsReferralChecked] = useState(false);
    const [isFirstEncounterChecked, setIsFirstEncounterChecked] = useState(false);

    const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<boolean>>) => (checked: boolean) => {
        setter(checked);
    };

    return (
        <div className='flex flex-col p-5'>
            <div className='flex flex-col gap-2'>
                <div className='underline'>
                    Meaningful Use Entries
                </div>
                <div className='border p-4 bg-[#e5e2e2] text-center'>
                    No Clinical Quality Measures configured for {providerDetails.firstName} {providerDetails.lastName}. Choose the required CQMs from <br />
                    <GhostButton>Settings</GhostButton>
                </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
                <div className="font-semibold">Referral / Reconciliation</div>

                {/* First Checkbox */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        checked={isReferralChecked}
                        onCheckedChange={handleCheckboxChange(setIsReferralChecked)}
                    />
                    <span>This encounter is based on a Referral or Transition of Care incoming request.</span>
                </div>

                {/* Second Checkbox */}
                <div className="flex items-center space-x-2">
                    <Checkbox
                        checked={isFirstEncounterChecked}
                        onCheckedChange={handleCheckboxChange(setIsFirstEncounterChecked)}
                    />
                    <span>This is the first encounter with this patient.</span>
                </div>
            </div>

            {/* Conditional Section */}
            {(isReferralChecked || isFirstEncounterChecked) && (
                <div className="mt-4 border p-4">
                    <div className="font-semibold mb-2">Incorporate CCDA:</div>
                    <p className="text-sm">
                        Upload the electronic summary of care document (CCDA) received for this patient.
                    </p>
                    <p className="text-blue-800 underline cursor-pointer text-sm">
                        Choose from Patient Document or Upload from Local Disk
                    </p>

                    <div className="mt-4">
                        <div className="font-semibold">Reconciliation done for</div>
                        <div className="flex flex-col gap-2 mt-2">
                            
                            <div className="flex items-center space-x-2">
                                <Checkbox />
                                <span>Medications</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox />
                                <span>Allergies</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox />
                                <span>Problems</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                                <Checkbox />
                                <span>CCDA Document not available due to reason below.</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MUBody