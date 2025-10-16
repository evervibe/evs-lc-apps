"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MessageSquare } from "lucide-react";

const tickets = [
  {
    id: 1,
    subject: "Cannot login to game",
    status: "open",
    priority: "high",
    created_at: "2024-01-15 10:30",
    updated_at: "2024-01-15 14:30",
    replies: 2,
  },
  {
    id: 2,
    subject: "Missing items after maintenance",
    status: "in_progress",
    priority: "medium",
    created_at: "2024-01-14 08:15",
    updated_at: "2024-01-15 09:00",
    replies: 5,
  },
  {
    id: 3,
    subject: "Question about guild system",
    status: "closed",
    priority: "low",
    created_at: "2024-01-10 16:45",
    updated_at: "2024-01-12 11:20",
    replies: 3,
  },
];

export default function TicketsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    message: "",
    priority: "medium",
  });

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log("Creating ticket:", newTicket);
    setIsDialogOpen(false);
    setNewTicket({ subject: "", message: "", priority: "medium" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-blue-500 bg-blue-500/10";
      case "in_progress":
        return "text-yellow-500 bg-yellow-500/10";
      case "closed":
        return "text-gray-500 bg-gray-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Support Tickets</h1>
          <p className="text-muted-foreground">
            Get help from our support team
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and we&apos;ll get back to you as soon as possible
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  placeholder="Detailed description of your issue"
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <Button type="submit" className="w-full">
                Submit Ticket
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace("_", " ")}
                  </span>
                  <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
              </div>
              <CardDescription>
                <div className="flex items-center gap-4 mt-2">
                  <span>Created: {ticket.created_at}</span>
                  <span>•</span>
                  <span>Updated: {ticket.updated_at}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {ticket.replies} replies
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link href={`/support/tickets/${ticket.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {tickets.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              You don&apos;t have any support tickets yet.
            </p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              Create Your First Ticket
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
