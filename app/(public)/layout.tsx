import { AppLayout } from '@/features/app/layouts/app-layout';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <AppLayout>{children}</AppLayout>;
}
