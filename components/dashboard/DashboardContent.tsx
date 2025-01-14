'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserOverviewTab } from "@/components/dashboard/user-tabs/UserOverviewTab";
import { UserQuizzesTab } from "@/components/dashboard/user-tabs/UserQuizzesTab";
import { UserHistoryTab } from "@/components/dashboard/user-tabs/UserHistoryTab";
import { UserProfileTab } from "@/components/dashboard/user-tabs/UserProfileTab";
import { UserAITutorTab } from "@/components/dashboard/user-tabs/UserAITutorTab";
import { UserLearningGoalsTab } from "@/components/dashboard/user-tabs/UserLearningGoalsTab";
import { UserAnalyticsTab } from "@/components/dashboard/user-tabs/UserAnalyticsTab";

export function DashboardContent() {
  return (
    <main className="h-screen w-full dashboard-gradient">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">QuizzQ</h1>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#12141C] border-blue-500/20">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="ai-tutor">AI Tutor</TabsTrigger>
            <TabsTrigger value="learning-goals">Learning Goals</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <UserOverviewTab />
          </TabsContent>
          <TabsContent value="quizzes" className="mt-6">
            <UserQuizzesTab />
          </TabsContent>
          <TabsContent value="history" className="mt-6">
            <UserHistoryTab />
          </TabsContent>
          <TabsContent value="profile" className="mt-6">
            <UserProfileTab />
          </TabsContent>
          <TabsContent value="ai-tutor" className="mt-6">
            <UserAITutorTab />
          </TabsContent>
          <TabsContent value="learning-goals" className="mt-6">
            <UserLearningGoalsTab />
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <UserAnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
