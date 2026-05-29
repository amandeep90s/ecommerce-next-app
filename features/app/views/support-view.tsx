'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle2Icon,
  ClockIcon,
  HeadphonesIcon,
  LifeBuoyIcon,
  MailIcon,
  ShieldCheckIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitSupportTicket } from '@/features/app/hooks/use-submit-support-ticket';

const ticketSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  orderId: z.string().max(100).optional(),
  category: z.enum(['order', 'product', 'shipping', 'billing', 'account', 'other'], {
    message: 'Please select a category',
  }),
  priority: z.enum(['low', 'medium', 'high']),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

function SuccessCard({ ticketNumber }: { ticketNumber: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-10 text-center">
      <CheckCircle2Icon className="text-primary size-12" />
      <div>
        <h3 className="text-xl font-semibold">Ticket Submitted!</h3>
        <p className="text-muted-foreground mt-1 text-sm">Your support ticket has been received.</p>
      </div>
      <div className="bg-muted rounded-lg px-6 py-3">
        <p className="text-muted-foreground text-xs">Your ticket number</p>
        <p className="font-mono text-xl font-bold">{ticketNumber}</p>
      </div>
      <p className="text-muted-foreground max-w-sm text-sm">
        Keep this number for reference. We&apos;ll reply to your email as soon as possible.
      </p>
    </div>
  );
}

export function SupportView() {
  const { mutate: submitTicket, isPending } = useSubmitSupportTicket();
  const [submittedTicketNumber, setSubmittedTicketNumber] = useState<string | null>(null);

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      name: '',
      email: '',
      orderId: '',
      category: undefined,
      priority: 'medium',
      subject: '',
      message: '',
    },
  });

  function onSubmit(values: TicketFormValues) {
    const payload = { ...values, orderId: values.orderId || undefined };
    submitTicket(payload, {
      onSuccess: (res) => {
        if (res.data?.ticketNumber) {
          setSubmittedTicketNumber(res.data.ticketNumber);
        } else {
          toast.success(res.message);
        }
        form.reset();
      },
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
            <HeadphonesIcon className="text-primary size-8" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-balance md:text-4xl">Support Center</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Can&apos;t find what you&apos;re looking for? Submit a support ticket and our team will
            get back to you as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="py-6">
              <CardHeader className="px-6">
                <CardTitle className="text-balance">Submit a Support Ticket</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                {submittedTicketNumber ? (
                  <SuccessCard ticketNumber={submittedTicketNumber} />
                ) : (
                  <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                    <FieldGroup>
                      {/* Name + Email */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field>
                          <FieldLabel htmlFor="name">Full name</FieldLabel>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            className="h-9"
                            {...form.register('name')}
                          />
                          {form.formState.errors.name && (
                            <p className="text-destructive text-xs">
                              {form.formState.errors.name.message}
                            </p>
                          )}
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="email">Email address</FieldLabel>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            className="h-9"
                            {...form.register('email')}
                          />
                          {form.formState.errors.email && (
                            <p className="text-destructive text-xs">
                              {form.formState.errors.email.message}
                            </p>
                          )}
                        </Field>
                      </div>

                      {/* Order ID + Category */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Field>
                          <FieldLabel htmlFor="orderId">
                            Order ID{' '}
                            <span className="text-muted-foreground font-normal">(optional)</span>
                          </FieldLabel>
                          <Input
                            id="orderId"
                            placeholder="e.g. ORD-12345"
                            className="h-9"
                            {...form.register('orderId')}
                          />
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="category">Category</FieldLabel>
                          <Controller
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id="category" className="h-9">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="order">Order Issue</SelectItem>
                                  <SelectItem value="product">Product Question</SelectItem>
                                  <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                                  <SelectItem value="billing">Billing & Payments</SelectItem>
                                  <SelectItem value="account">Account Help</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {form.formState.errors.category && (
                            <p className="text-destructive text-xs">
                              {form.formState.errors.category.message}
                            </p>
                          )}
                        </Field>
                      </div>

                      {/* Priority */}
                      <Field>
                        <FieldLabel htmlFor="priority">Priority</FieldLabel>
                        <Controller
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger id="priority" className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low — General question</SelectItem>
                                <SelectItem value="medium">
                                  Medium — Needs attention soon
                                </SelectItem>
                                <SelectItem value="high">High — Urgent issue</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </Field>

                      {/* Subject */}
                      <Field>
                        <FieldLabel htmlFor="subject">Subject</FieldLabel>
                        <Input
                          id="subject"
                          placeholder="Brief description of your issue"
                          className="h-9"
                          {...form.register('subject')}
                        />
                        {form.formState.errors.subject && (
                          <p className="text-destructive text-xs">
                            {form.formState.errors.subject.message}
                          </p>
                        )}
                      </Field>

                      {/* Message */}
                      <Field>
                        <FieldLabel htmlFor="message">Message</FieldLabel>
                        <Textarea
                          id="message"
                          placeholder="Please describe your issue in detail…"
                          className="min-h-[140px]"
                          {...form.register('message')}
                        />
                        {form.formState.errors.message && (
                          <p className="text-destructive text-xs">
                            {form.formState.errors.message.message}
                          </p>
                        )}
                      </Field>
                    </FieldGroup>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="mt-6 h-9 w-full cursor-pointer"
                    >
                      {isPending ? 'Submitting…' : 'Submit Ticket'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar info */}
          <div className="flex flex-col gap-6">
            <Card className="gap-3 py-6">
              <CardHeader className="px-6">
                <CardTitle className="text-lg text-balance">What to expect</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 px-6">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
                    <MailIcon className="text-primary size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Confirmation email</h4>
                    <p className="text-muted-foreground text-xs">
                      We&apos;ll send a confirmation with your ticket number immediately.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
                    <ClockIcon className="text-primary size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Response time</h4>
                    <p className="text-muted-foreground text-xs">
                      We typically respond within 24–48 hours on business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
                    <ShieldCheckIcon className="text-primary size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Secure & private</h4>
                    <p className="text-muted-foreground text-xs">
                      Your information is kept private and only used to resolve your issue.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gap-3 py-6">
              <CardHeader className="px-6">
                <CardTitle className="text-lg text-balance">Need faster help?</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <p className="text-muted-foreground mb-4 text-sm">
                  Browse our FAQ for instant answers to common questions.
                </p>
                <Button variant="outline" className="h-9 w-full" asChild>
                  <a href="/faqs">
                    <LifeBuoyIcon className="size-4" />
                    Browse FAQs
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
