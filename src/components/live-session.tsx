'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { Mic, MicOff, Copy, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { HistoryItem } from './history';
import { getAnswerAction } from '@/app/action';

interface LiveSessionProps {
  userName: string;
  resume: string;
  answerBank: string;
  interviewMode: boolean;
  addHistoryItem: (item: HistoryItem) => void;
}

export function LiveSession({
  userName,
  resume,
  answerBank,
  interviewMode,
  addHistoryItem,
}: LiveSessionProps) {
  const { toast } = useToast();
  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAnswer, setGeneratedAnswer] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  const transcriptRef = useRef(transcript);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
      transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    if (!isListening) {
        if(transcriptRef.current.trim().length > 0) {
            handleGetAnswer(transcriptRef.current);
        }
    }
  }, [isListening]);


  const handleGetAnswer = async (currentTranscript: string) => {
    if (!currentTranscript.trim()) return;

    setIsLoading(true);
    setGeneratedAnswer('');
    setLastQuestion(currentTranscript);

    const result = await getAnswerAction({
      transcript: currentTranscript,
      userName,
      answerBank,
      interviewMode,
      resumeData: resume,
    });

    setIsLoading(false);

    if (result.success && result.data) {
      if (result.data.questionDetected) {
        setGeneratedAnswer(result.data.answer);
        addHistoryItem({
          question: currentTranscript,
          answer: result.data.answer,
          timestamp: new Date(),
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedAnswer);
    toast({
      title: 'Copied to clipboard!',
    });
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Live Session</CardTitle>
            <CardDescription>Start listening to get real-time answers.</CardDescription>
          </div>
          <Button onClick={toggleListening} size="icon" disabled={!hasRecognitionSupport}>
            {isListening ? <MicOff /> : <Mic />}
            <span className="sr-only">{isListening ? 'Stop listening' : 'Start listening'}</span>
          </Button>
        </CardHeader>
        <CardContent>
          {!hasRecognitionSupport ? (
              <div className="flex items-center gap-2 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">
                  Speech recognition is not supported in your browser. Please try Chrome or Edge.
                </p>
              </div>
          ) : (
            <div className="min-h-[200px] w-full rounded-md border bg-muted p-4 text-sm">
                {transcript || <span className="text-muted-foreground">Waiting for speech...</span>}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Smart Answer</CardTitle>
          <CardDescription>Your AI-generated answer will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="relative min-h-[260px]">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md bg-background/50">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating answer...</p>
            </div>
          ) : generatedAnswer ? (
            <div>
                <Badge variant="secondary" className="mb-2">Detected Question</Badge>
                <p className="mb-4 text-sm italic text-muted-foreground">"{lastQuestion}"</p>
                <div className="relative">
                    <p className="font-code text-base">{generatedAnswer}</p>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-8 w-8"
                        onClick={handleCopy}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
              <p className="text-center text-muted-foreground">No question detected yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
