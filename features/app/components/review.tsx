'use client';

import { Quote } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export function ReviewOne() {
  return (
    <Card className="not-prose w-full max-w-md border border-gray-300 p-0">
      <CardContent className="space-y-6 p-6">
        <Quote className="h-8 w-8 text-gray-300" />

        <p className="text-lg leading-relaxed">
          Love the headphones. Been using them for a week now, they are comfortable and have a good
          sound quality.
        </p>

        <div className="flex items-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <img
              src="https://pub-5f7cbdfd9ffa4c838e386788f395f0c4.r2.dev/people/simple_person_c.png"
              alt="Li Hua"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-lg font-semibold">Li Hua</h4>
            <p className="text-sm text-gray-500">@lihua_rav</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
