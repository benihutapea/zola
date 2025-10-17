import { ReactNode } from 'react';

export default function CreativeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
}