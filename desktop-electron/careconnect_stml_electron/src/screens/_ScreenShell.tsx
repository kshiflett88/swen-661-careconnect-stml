import type { ReactNode } from 'react';
import type { ScreenId } from './index';

type ScreenShellProps = {
  title: string;
  description?: string;
  onGo?: (screen: ScreenId) => void;
  children: ReactNode;
};

export default function ScreenShell({ title, description, children }: ScreenShellProps) {
  return (
    <section aria-label={title}>
      {description ? <p className="sr-only">{description}</p> : null}
      {children}
    </section>
  );
}
