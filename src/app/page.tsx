"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  History as HistoryIcon,
  Mic,
  Settings as SettingsIcon,
} from "lucide-react";
import { History, HistoryItem } from "@/components/history";
import { Header } from "@/components/header";
import { LiveSession } from "@/components/live-session";
import { Settings } from "@/components/settings";

export default function Home() {
  const [userName, setUserName] = useState("Aman");
  const [resume, setResume] = useState("");
  const [answerBank, setAnswerBank] = useState(
    JSON.stringify(
      {
        "experience with docker":
          "In my previous project, I containerized multiple services using Docker Compose and managed isolated dev environments efficiently.",
        "tell me about yourself":
          "I'm a passionate developer with experience in building scalable web applications and a keen interest in machine learning.",
      },
      null,
      2
    )
  );
  const [interviewMode, setInterviewMode] = useState(false);
  const [meetingUrls, setMeetingUrls] = useState<string[]>([
    "meet.google.com",
    "zoom.us",
    "teams.microsoft.com",
  ]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addHistoryItem = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="live-session" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="live-session">
              <Mic className="mr-2 h-4 w-4" />
              Live Session
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="history">
              <HistoryIcon className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="live-session" className="mt-4">
            <LiveSession
              userName={userName}
              resume={resume}
              answerBank={answerBank}
              interviewMode={interviewMode}
              addHistoryItem={addHistoryItem}
            />
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <Settings
              userName={userName}
              setUserName={setUserName}
              resume={resume}
              setResume={setResume}
              answerBank={answerBank}
              setAnswerBank={setAnswerBank}
              interviewMode={interviewMode}
              setInterviewMode={setInterviewMode}
              meetingUrls={meetingUrls}
              setMeetingUrls={setMeetingUrls}
            />
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <History history={history} clearHistory={clearHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
