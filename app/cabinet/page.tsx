"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { CabinetLayout } from "@/components/cabinet/cabinet-layout"
import { DashboardOverview } from "@/components/cabinet/dashboard-overview"
import { MyTrees } from "@/components/cabinet/my-trees"
import { DonationHistory } from "@/components/cabinet/donation-history"
import { Certificates } from "@/components/cabinet/certificates"
import { ProfileSettings } from "@/components/cabinet/profile-settings"
import { CabinetProtectedRoute } from "@/components/cabinet/cabinet-protected-route"

export type CabinetView = "overview" | "trees" | "history" | "certificates" | "settings"

// Separate component that uses useSearchParams
function CabinetContent({ initialView }: { initialView: CabinetView }) {
  const [currentView, setCurrentView] = useState<CabinetView>(initialView)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if a specific view is requested via URL parameter
    const viewParam = searchParams.get("view")
    if (viewParam && (viewParam === "overview" || viewParam === "trees" || viewParam === "history" || viewParam === "certificates" || viewParam === "settings")) {
      setCurrentView(viewParam as CabinetView)
    }
  }, [searchParams])

  return (
    <CabinetLayout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === "overview" && <DashboardOverview onNavigate={setCurrentView} />}
      {currentView === "trees" && <MyTrees />}
      {currentView === "history" && <DonationHistory />}
      {currentView === "certificates" && <Certificates />}
      {currentView === "settings" && <ProfileSettings />}
    </CabinetLayout>
  )
}

export default function CabinetPage() {
  return (
    <CabinetProtectedRoute>
      <CabinetContent initialView="overview" />
    </CabinetProtectedRoute>
  )
}