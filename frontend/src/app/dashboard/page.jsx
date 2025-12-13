"use client";

import ProtectedRoute from "@/components/protectedRoute";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
      </div>
    </ProtectedRoute>
  )
}
