"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { DonationsManagement } from "@/components/admin/donations-management"
import { UsersManagement } from "@/components/admin/users-management"
import { LocationsManagement } from "@/components/admin/locations-management"
import { ContentManagement } from "@/components/admin/content-management"
import { CertificatesManagement } from "@/components/admin/certificates-management"
import { ReportsAnalytics } from "@/components/admin/reports-analytics"
import { NewsManagement } from "@/components/admin/news-management"
import { PartnershipInquiries } from "@/components/admin/partnership-inquiries"
import { AdminProtectedRoute } from "@/components/admin/admin-protected-route"

export type AdminView =
  | "dashboard"
  | "donations"
  | "users"
  | "locations"
  | "content"
  | "news"
  | "certificates"
  | "reports"
  | "settings"
  | "partnerships"

export default function AdminPage() {
  const [currentView, setCurrentView] = useState<AdminView>("dashboard")

  return (
    <AdminProtectedRoute>
      <AdminLayout currentView={currentView} onViewChange={setCurrentView}>
        {currentView === "dashboard" && <AdminDashboard onNavigate={setCurrentView} />}
        {currentView === "donations" && <DonationsManagement />}
        {currentView === "users" && <UsersManagement />}
        {currentView === "locations" && <LocationsManagement />}
        {currentView === "content" && <ContentManagement />}
        {currentView === "news" && <NewsManagement />}
        {currentView === "certificates" && <CertificatesManagement />}
        {currentView === "reports" && <ReportsAnalytics />}
        {currentView === "partnerships" && <PartnershipInquiries />}
      </AdminLayout>
    </AdminProtectedRoute>
  )
}
