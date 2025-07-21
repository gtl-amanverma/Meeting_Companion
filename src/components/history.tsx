'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

export interface HistoryItem {
  question: string;
  answer: string;
  timestamp: Date;
}

interface HistoryProps {
  history: HistoryItem[];
  clearHistory: () => void;
}

export function History({ history, clearHistory }: HistoryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="font-headline">Session History</CardTitle>
          <CardDescription>
            A log of all detected questions and generated answers from your sessions.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={clearHistory} disabled={history.length === 0}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear History
        </Button>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {history.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className='flex flex-col text-left'>
                    <span className='text-sm font-medium'>{item.question}</span>
                    <span className='text-xs text-muted-foreground font-normal'>
                        {item.timestamp.toLocaleString()}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="font-code">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-center text-muted-foreground">
              Your session history is empty.
              <br />
              Start a live session to see your Q&A history here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
