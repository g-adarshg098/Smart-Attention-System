import { FocusFlowDashboard } from '@/components/focus-flow-dashboard';
import { Logo } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-card">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">
              FocusFlow
            </h1>
          </div>
          <p className="hidden text-sm text-muted-foreground md:block">
            Your AI-powered attention tracking companion.
          </p>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <FocusFlowDashboard />
      </main>
    </div>
  );
}
