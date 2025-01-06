"use client"

import { Breadcrumbs } from "@/components/breadcrumbs"
import PageContainer from "@/components/layout/page-container"
import Images from "./Images"

const breadcrumbItems = [
  {title: 'Dashboard', link: '/dashboard'},
  {title: 'Images', link: '/dashboard/labs'}
]

function ImagesPage() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <Images />
      </div>
    </PageContainer>
  )
}

export default ImagesPage