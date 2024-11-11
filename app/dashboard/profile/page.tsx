//dashboard/profile
'use client'
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserDetailsForm } from '@/components/forms/user-details-form';
import PageContainer from '@/components/layout/page-container';
import LoadingButton from '@/components/LoadingButton';
import { fetchProviderDetails } from '@/services/registerServices';
import { RootState } from '@/store/store';
import { ProviderDetails } from '@/types/providerDetailsInterface';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Profile', link: '/dashboard/profile' }
];

export default function Profile() {
  const savedProviderAuthId = useSelector((state: RootState) =>
    state.login.providerAuthId);
  const providerID = useSelector((state: RootState) =>
    state.login.providerId);
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<ProviderDetails | undefined>(undefined);

  const defaultValues = {
    professionalSummary: initialData?.professionalSummary || '',
    gender: initialData?.gender || '',
    roleName: initialData?.roleName || '',
    nip: initialData?.nip || '',
    licenseNumber: initialData?.licenseNumber || '',
    yearsOfExperience: initialData?.yearsOfExperience || 0,
    providerAuthId: savedProviderAuthId
  };

  useEffect(() => {
    if (!providerID || initialData) return;

    const fetchAndSetResponse = async () => {
      try {
        setLoading(true);
        const data = await fetchProviderDetails({ id: providerID });
        if (data) {
          setInitialData({
            professionalSummary: data.professionalSummary,
            gender: data.gender,
            roleName: data.roleName,
            nip: data.nip,
            licenseNumber: data.roleName,
            yearsOfExperience: data.yearsOfExperience,
            providerAuthId: savedProviderAuthId
          });
        }
      } catch (error) {
        console.error('Error fetching provider details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndSetResponse();
  }, [providerID, initialData, savedProviderAuthId]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <LoadingButton />
        </div>
    );
}

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        {initialData ? (
          <UserDetailsForm
            initialData={initialData}
            key={savedProviderAuthId}
          />
        ) : (
          <UserDetailsForm
            initialData={defaultValues}
            key={savedProviderAuthId}
          />
        )}
      </div>
    </PageContainer>
  );
}
