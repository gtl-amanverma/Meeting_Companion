'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';

interface SettingsProps {
  userName: string;
  setUserName: (name: string) => void;
  resume: string;
  setResume: (resume: string) => void;
  answerBank: string;
  setAnswerBank: (bank: string) => void;
  interviewMode: boolean;
  setInterviewMode: (enabled: boolean) => void;
  meetingUrls: string[];
  setMeetingUrls: (urls: string[]) => void;
}

export function Settings({
  userName,
  setUserName,
  resume,
  setResume,
  answerBank,
  setAnswerBank,
  interviewMode,
  setInterviewMode,
  meetingUrls,
  setMeetingUrls,
}: SettingsProps) {
  const [newUrl, setNewUrl] = useState('');
  const { toast } = useToast();

  const handleAddUrl = () => {
    if (newUrl && !meetingUrls.includes(newUrl)) {
      setMeetingUrls([...meetingUrls, newUrl]);
      setNewUrl('');
    }
  };

  const handleRemoveUrl = (urlToRemove: string) => {
    setMeetingUrls(meetingUrls.filter((url) => url !== urlToRemove));
  };

  const handleAnswerBankChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setAnswerBank(text);
    try {
        JSON.parse(text);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Invalid JSON",
            description: "The answer bank format is not valid JSON.",
        })
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">General Settings</CardTitle>
          <CardDescription>Configure your personal details and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="user-name">Your Name</Label>
            <Input
              id="user-name"
              placeholder="e.g., Aman"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">The AI will listen for questions directed at this name.</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
              <div className='space-y-0.5'>
                <Label htmlFor="interview-mode">Interview Mode</Label>
                <p className="text-xs text-muted-foreground">
                    Tailor answers for professional interview questions.
                </p>
              </div>
            <Switch
              id="interview-mode"
              checked={interviewMode}
              onCheckedChange={setInterviewMode}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resume">Your Resume/Profile</Label>
            <Textarea
              id="resume"
              placeholder="Paste your resume or a brief professional profile here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className="min-h-[150px] font-code"
            />
             <p className="text-xs text-muted-foreground">Used by Interview Mode to personalize answers.</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Assistant Configuration</CardTitle>
          <CardDescription>Manage meeting platforms and predefined answers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="meeting-urls">Meeting Platform URLs</Label>
            <div className="flex gap-2">
              <Input
                id="meeting-urls"
                placeholder="e.g., meet.google.com"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
              />
              <Button onClick={handleAddUrl}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {meetingUrls.map((url) => (
                <Badge key={url} variant="secondary" className="flex items-center gap-1 pr-1">
                  {url}
                  <button
                    onClick={() => handleRemoveUrl(url)}
                    className="rounded-full bg-background p-0.5 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="answer-bank">Predefined Answer Bank (JSON)</Label>
            <Textarea
              id="answer-bank"
              placeholder='{ "question keyword": "your predefined answer" }'
              value={answerBank}
              onChange={handleAnswerBankChange}
              className="min-h-[150px] font-code"
            />
            <p className="text-xs text-muted-foreground">Keywords from questions will be matched to these answers.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
