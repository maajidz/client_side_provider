//dashboard/layout.tsx
import PatientSidebar from '@/components/patient/patientSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Metadata } from 'next';
import styles from './PatientLayout.module.css'; 
import PatientHeader from '@/components/patient/patientHeader';

export const metadata: Metadata = {
    title: 'Patients',
    description: 'Patients'
};

export default function PatientLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { userDetailsId: string }
}) {
    return (
        <div>
            <header className={styles.header}>
                <nav className={styles.nav}>
                  <PatientHeader userId={params.userDetailsId}/>
                </nav>
            </header>
            <div className="flex">
                <ScrollArea className='bg-[#84012A]'>
                    <PatientSidebar userDetailsId={params.userDetailsId}/>
                </ScrollArea>
                <main className="w-full flex-1 overflow-hidden">
                    {/* <Header />  */}
                    {children}
                </main>
            </div>
        </div>
    );
}
