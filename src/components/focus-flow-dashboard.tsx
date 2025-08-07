"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { summarizeSession } from '@/ai/flows/summarize-session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Video, Bot, BarChart2, Zap, Play, Square, Loader2 } from 'lucide-react';
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type AttentionDataPoint = {
  time: string;
  attentionLevel: number;
};

const chartConfig = {
  attention: {
    label: "Attention",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function FocusFlowDashboard() {
  const [sessionActive, setSessionActive] = useState(false);
  const [attentionLevel, setAttentionLevel] = useState(0);
  const [attentionData, setAttentionData] = useState<AttentionDataPoint[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState("Ready to focus?");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const getAttentionStatus = useCallback((level: number) => {
    if (level < 40) return { text: "Distracted", color: "hsl(var(--destructive))" };
    if (level < 75) return { text: "Attentive", color: "hsl(var(--chart-4))" };
    return { text: "Focused", color: "hsl(var(--accent))" };
  }, []);

  useEffect(() => {
    const status = getAttentionStatus(attentionLevel);
    if(sessionActive) setStatusText(status.text);
  }, [attentionLevel, sessionActive, getAttentionStatus]);

  const startWebcam = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
      toast({
        variant: "destructive",
        title: "Webcam Error",
        description: "Could not access webcam. Please check permissions and try again.",
      });
      setSessionActive(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const startSession = () => {
    setSessionActive(true);
    setSummary(null);
    setAttentionData([]);
    setAttentionLevel(50); // Start at a neutral level
    setStatusText("Initializing...");
    startWebcam();
  };

  const endSession = async () => {
    setSessionActive(false);
    setIsLoading(true);
    setStatusText("Session Ended");
    
    if (attentionData.length > 1) {
      try {
        const sessionToSummarize = {
          attentionData: attentionData.map(d => ({ timestamp: d.time, attentionLevel: d.attentionLevel })),
          studySessionDetails: "A general study session."
        };
        const result = await summarizeSession(sessionToSummarize);
        setSummary(result.summary);
      } catch(error) {
        console.error("Error summarizing session:", error);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Could not generate session summary.",
        });
        setSummary("An error occurred while generating the summary.");
      }
    } else {
      setSummary("Not enough data was collected for a summary.");
    }
    
    setIsLoading(false);
    stopWebcam();
  };

  useEffect(() => {
    if (sessionActive && isClient) {
      intervalRef.current = setInterval(() => {
        const newAttentionLevel = Math.random() * 100;
        setAttentionLevel(newAttentionLevel)
        setAttentionData(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            attentionLevel: newAttentionLevel
          }
        ]);
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sessionActive, isClient]);
  
  useEffect(() => {
    return () => stopWebcam(); // Cleanup on component unmount
  }, []);

  if (!isClient) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Video className="h-6 w-6" />
                        <CardTitle>Live Feed</CardTitle>
                    </div>
                    <Skeleton className="h-10 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="aspect-video w-full overflow-hidden rounded-md border bg-secondary">
                        <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Video className="h-16 w-16" />
                            <p>Your webcam feed will appear here</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="flex w-full items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Attention Status</span>
                        <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                </CardFooter>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <BarChart2 className="h-6 w-6" />
                        <CardTitle>Session Analysis</CardTitle>
                    </div>
                    <CardDescription>
                        Your session analysis will appear here.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-4 rounded-lg bg-secondary">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Zap className="h-12 w-12" />
                            <p className="font-medium">Start a session to see your focus analysis.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6" />
            <CardTitle>Live Feed</CardTitle>
          </div>
          {!sessionActive ? (
            <Button onClick={startSession}><Play className="mr-2 h-4 w-4" /> Start Session</Button>
          ) : (
            <Button onClick={endSession} variant="destructive"><Square className="mr-2 h-4 w-4" /> End Session</Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full overflow-hidden rounded-md border bg-secondary">
            <video ref={videoRef} autoPlay playsInline muted className={`h-full w-full object-cover transition-opacity ${sessionActive ? 'opacity-100' : 'opacity-0 hidden'}`}/>
            {!sessionActive && (
                 <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Video className="h-16 w-16" />
                    <p>Your webcam feed will appear here</p>
                 </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
            <div className="flex w-full items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Attention Status</span>
                <span className="text-lg font-bold" style={{color: getAttentionStatus(attentionLevel).color}}>{statusText}</span>
            </div>
          <Progress value={attentionLevel} className="w-full h-3" />
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-6 w-6" />
            <CardTitle>Session Analysis</CardTitle>
          </div>
          <CardDescription>
            {sessionActive ? "Attention levels over time." : "Your session analysis will appear here."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center">
        {sessionActive && attentionData.length > 1 ? (
             <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <AreaChart accessibilityLayer data={attentionData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value, index) => index % 5 === 0 ? value : ''}
                  />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} />
                   <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="attentionLevel"
                    type="natural"
                    fill="var(--color-attention)"
                    fillOpacity={0.3}
                    stroke="var(--color-attention)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-4 rounded-lg bg-secondary">
                {isLoading ? (
                    <div className="space-y-4 w-full">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                ) : summary ? (
                    <div className="space-y-3 text-left">
                        <div className="flex items-center gap-2">
                            <Bot className="h-6 w-6 text-primary"/>
                            <h3 className="text-lg font-semibold">Session Summary</h3>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{summary}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Zap className="h-12 w-12" />
                        <p className="font-medium">Start a session to see your focus analysis.</p>
                    </div>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
