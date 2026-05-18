import React from 'react';

import { APP_NAME } from '@/config/env';

export function Footer() {
  return (
    <footer className="border-t p-4 text-center">
      <p className="text-muted-foreground text-sm">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </p>
    </footer>
  );
}
