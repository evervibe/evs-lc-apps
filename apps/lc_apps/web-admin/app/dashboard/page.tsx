import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Admin",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
          <p className="text-3xl font-bold mt-2">12,345</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Today</h3>
          <p className="text-3xl font-bold mt-2">1,234</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Open Tickets</h3>
          <p className="text-3xl font-bold mt-2">56</p>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue Today</h3>
          <p className="text-3xl font-bold mt-2">$1,234</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>New user registration: player123</span>
            <span className="text-sm text-gray-500">2 mins ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Support ticket #123 opened</span>
            <span className="text-sm text-gray-500">5 mins ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Purchase: Epic Sword - $9.99</span>
            <span className="text-sm text-gray-500">10 mins ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
