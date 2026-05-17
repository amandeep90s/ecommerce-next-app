import { Spinner } from '@/components/ui/spinner';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loader({ message = '', fullScreen = true }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <Spinner className="h-10 w-10" />
      {message && <p className="text-muted-foreground text-sm">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="bg-background flex h-screen w-full items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-8">{content}</div>;
}
