"use client"

import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-3xl mx-auto">
        <div className="h-10 w-40 bg-muted/50 rounded mb-6 animate-pulse"></div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="w-40 h-8 bg-muted/50 rounded animate-pulse"></div>
              <div className="w-24 h-6 bg-muted/50 rounded animate-pulse"></div>
            </div>
            
            <div className="h-10 bg-muted/50 rounded mt-4 animate-pulse"></div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-md overflow-hidden">
                <div className="p-4 bg-muted/30 flex items-center justify-between">
                  <div className="w-32 h-6 bg-muted/50 rounded animate-pulse"></div>
                  <div className="w-6 h-6 bg-muted/50 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-3 p-3">
                  <div className="h-20 bg-muted/50 rounded animate-pulse"></div>
                  <div className="h-20 bg-muted/50 rounded animate-pulse"></div>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="p-4 bg-muted/30 flex items-center justify-between">
                  <div className="w-32 h-6 bg-muted/50 rounded animate-pulse"></div>
                  <div className="w-6 h-6 bg-muted/50 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-3 p-3">
                  <div className="h-20 bg-muted/50 rounded animate-pulse"></div>
                  <div className="h-20 bg-muted/50 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
