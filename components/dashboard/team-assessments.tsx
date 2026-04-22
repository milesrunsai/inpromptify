"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Users, Trophy, BarChart3, Plus, X } from "lucide-react";

export function TeamAssessments() {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [emails, setEmails] = useState<string[]>(['']);
  const [subject, setSubject] = useState('AI Proficiency Assessment Invitation');
  const [message, setMessage] = useState('You have been invited to complete an AI proficiency assessment for our team.');
  const [sending, setSending] = useState(false);

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const removeEmail = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const sendInvites = async () => {
    const validEmails = emails.filter(email => email.trim() && email.includes('@'));
    if (validEmails.length === 0) {
      alert('Please add at least one valid email');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/team/invite-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emails: validEmails,
          subject,
          message
        })
      });

      const result = await response.json();
      if (response.ok) {
        alert(`✅ ${result.invitesSent} assessment invites sent!`);
        setEmails(['']);
        setShowInviteForm(false);
      } else {
        alert(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      alert('❌ Failed to send invites');
    }
    setSending(false);
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Assessments Sent</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-xl font-bold">--</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Send Assessment Invites */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Assessment Invites
            </CardTitle>
            {!showInviteForm && (
              <Button onClick={() => setShowInviteForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Send Invites
              </Button>
            )}
          </div>
        </CardHeader>

        {showInviteForm && (
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subject Line</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Invitation message"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Addresses</label>
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="teammate@company.com"
                    type="email"
                  />
                  {emails.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeEmail(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addEmailField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Email
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={sendInvites} disabled={sending}>
                {sending ? "Sending..." : "Send Invites"}
              </Button>
              <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Team Results */}
      <Card>
        <CardHeader>
          <CardTitle>Team Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No assessments completed yet</p>
            <p className="text-sm">Send invites above to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}