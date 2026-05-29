'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitContact } from '@/features/app/hooks/use-submit-contact';

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactView() {
  const { mutate: submitContact, isPending } = useSubmitContact();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  function onSubmit(values: ContactFormValues) {
    submitContact(values, {
      onSuccess: (res) => {
        toast.success(res.message);
        form.reset();
      },
      onError: (e) => toast.error(e.message),
    });
  }

  return (
    <section className="py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-balance md:text-4xl">Get in Touch</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Have a question or want to work together? We&apos;d love to hear from you. Send us a
            message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* Contact Form */}
          <Card className="h-full py-6">
            <CardHeader className="px-6">
              <CardTitle className="text-balance">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 px-6">
              <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                <FieldGroup>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="firstName">First name</FieldLabel>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="h-9"
                        {...form.register('firstName')}
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-destructive text-xs">
                          {form.formState.errors.firstName.message}
                        </p>
                      )}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="h-9"
                        {...form.register('lastName')}
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-destructive text-xs">
                          {form.formState.errors.lastName.message}
                        </p>
                      )}
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
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
                  <Field>
                    <FieldLabel htmlFor="subject">Subject</FieldLabel>
                    <Input
                      id="subject"
                      placeholder="How can we help?"
                      className="h-9"
                      {...form.register('subject')}
                    />
                    {form.formState.errors.subject && (
                      <p className="text-destructive text-xs">
                        {form.formState.errors.subject.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="message">Message</FieldLabel>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your project..."
                      className="min-h-[120px]"
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
                  className="mt-6 h-9 w-full cursor-pointer px-4 py-2"
                >
                  {isPending ? 'Sending…' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information & Additional Info */}
          <div className="flex h-full flex-col gap-6">
            {/* Contact Information */}
            <Card className="flex-1 gap-3 py-6">
              <CardHeader className="px-6">
                <CardTitle className="text-lg text-balance">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                    <Mail className="text-primary size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Email</h4>
                    <p className="text-muted-foreground text-xs">hello@company.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                    <Phone className="text-primary size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Phone</h4>
                    <p className="text-muted-foreground text-xs">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 mt-0.5 flex size-8 items-center justify-center rounded-full">
                    <MapPin className="text-primary size-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Office</h4>
                    <p className="text-muted-foreground text-xs">
                      123 Business Ave, Suite 100
                      <br />
                      San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="gap-3 py-6">
              <CardHeader className="px-6">
                <CardTitle className="text-lg text-balance">Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="text-muted-foreground">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-muted-foreground">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alternative Contact */}
            <Card className="gap-3 py-6">
              <CardHeader className="px-6">
                <CardTitle className="text-lg text-balance">Prefer to Call?</CardTitle>
              </CardHeader>
              <CardContent className="px-6">
                <p className="text-muted-foreground mb-3 text-sm">
                  Speak directly with our team for immediate assistance.
                </p>
                <Button variant="outline" className="h-9 w-full cursor-pointer px-4 py-2">
                  <Phone />
                  Schedule a Call
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
