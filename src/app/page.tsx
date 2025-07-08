"use client";

import { useState } from "react";
import { Code, Play, Loader2, Terminal, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { compileCode, runCode, CompileResponse, RunResponse } from "@/lib/api";
import RustEditor from "@/components/rust-editor";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const initialCode = `fn main() {
    let mut x: i32 = 1;
    let mut y: i32 = 10;
    let mut z: i64 = 1000000;

    x = 20;

    println!("{}", x);
    println!("{}", y);
    println!("{}", z);
}`;

export default function Home() {
  const [rustCode, setRustCode] = useState<string>(initialCode);
  const [compilationResult, setCompilationResult] =
    useState<CompileResponse | null>(null);
  const [executionResult, setExecutionResult] = useState<RunResponse | null>(
    null
  );
  const [isCompiling, setIsCompiling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const handleCodeChange = (value: string | undefined) => {
    setRustCode(value || "");
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompilationResult(null);
    setExecutionResult(null);
    try {
      const result = await compileCode(rustCode);
      setCompilationResult(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Compilation Failed",
        description: "An unexpected error occurred during compilation.",
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleRun = async () => {
    if (!compilationResult || !compilationResult.success) {
      toast({
        variant: "destructive",
        title: "Cannot Run Code",
        description: "Please compile the code successfully before running.",
      });
      return;
    }
    setIsRunning(true);
    setExecutionResult(null);
    try {
      const result = await runCode(compilationResult.code);
      setExecutionResult(result);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Execution Failed",
        description: "An unexpected error occurred during execution.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 fill-primary"><title>Rust</title><path d="M22.015 14.343a.95.95 0 0 0-.8-.43h-4.226l.413-1.46h2.26a.94.94 0 0 0 .813-.438.92.92 0 0 0-.155-1.025l-5.32-4.63a.94.94 0 0 0-1.186 0l-5.32 4.63a.92.92 0 0 0-.155 1.025.94.94 0 0 0 .812.438h2.26l.413 1.46H1.786a.95.95 0 0 0-.8.43.92.92 0 0 0 .155 1.025l5.32 4.63c.33.286.756.443 1.186.443s.855-.157 1.186-.443l5.32-4.63a.92.92 0 0 0 .154-1.025zM12 1.957a.94.94 0 0 0-.813.438L5.867 7.02a.92.92 0 0 0 .155 1.025.95.95 0 0 0 .8.43h10.36a.95.95 0 0 0 .8-.43.92.92 0 0 0 .155-1.025l-5.32-4.63a.94.94 0 0 0-.813-.438z"/></svg>
          <h1 className="text-2xl font-bold font-headline">Rustinator</h1>
        </div>
      </header>

      <main className="flex-grow p-4 min-h-0">
        <ResizablePanelGroup direction="vertical" className="h-full rounded-lg border">
          <ResizablePanel defaultSize={70} minSize={20}>
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={50} minSize={25}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-2 border-b shrink-0">
                    <h2 className="font-semibold font-headline">Rust Code</h2>
                    <Button onClick={handleCompile} disabled={isCompiling}>
                      {isCompiling ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="mr-2 h-4 w-4" />
                      )}
                      Compile
                    </Button>
                  </div>
                  <div className="flex-grow min-h-0">
                    <RustEditor value={rustCode} onChange={handleCodeChange} />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={25}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-2 border-b shrink-0">
                    <h2 className="font-semibold font-headline">Compiled Assembly</h2>
                    <Button
                      onClick={handleRun}
                      disabled={
                        isRunning || !compilationResult?.success
                      }
                    >
                      {isRunning ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Terminal className="mr-2 h-4 w-4" />
                      )}
                      Run
                    </Button>
                  </div>
                  <div className="flex-grow p-4 overflow-auto bg-[#1e1e1e] font-code text-sm">
                    {compilationResult && (
                       <pre className={cn("whitespace-pre-wrap transition-opacity duration-500", compilationResult.success ? 'text-success' : 'text-destructive')}>
                         <code>{compilationResult.code}</code>
                       </pre>
                    )}
                     {!compilationResult && !isCompiling && (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Press 'Compile' to see the assembly output.</p>
                        </div>
                    )}
                    {isCompiling && (
                         <div className="flex items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                            <p>Compiling...</p>
                        </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30} minSize={10}>
            <div className="flex flex-col h-full">
              <div className="flex items-center p-2 border-b shrink-0">
                <h2 className="font-semibold font-headline">Execution Output</h2>
              </div>
              <div className="flex-grow p-4 overflow-auto bg-[#1e1e1e] text-sm">
                 {executionResult && (
                    <div className={cn("transition-opacity duration-500 whitespace-pre-wrap", executionResult.success ? 'text-foreground' : 'text-destructive')}>
                      <div className="flex items-center gap-2 mb-2 font-headline">
                        {executionResult.success ? <CheckCircle2 className="text-success"/> : <AlertTriangle className="text-destructive" />}
                        <span className="font-bold">{executionResult.success ? 'Execution Succeeded' : 'Execution Failed'}</span>
                      </div>
                       <pre className="font-code">
                         <code>{executionResult.message}</code>
                       </pre>
                    </div>
                )}
                 {!executionResult && !isRunning && (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Press 'Run' to see the execution output.</p>
                    </div>
                 )}
                 {isRunning && (
                         <div className="flex items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                            <p>Running...</p>
                        </div>
                    )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
