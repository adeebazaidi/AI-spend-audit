"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AITool, PlanType } from "@/lib/pricing";
import { runAudit } from "@/lib/audit-engine";
import { saveReport } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TOOL_OPTIONS: AITool[] = [
  "Cursor", "GitHub Copilot", "Claude", "ChatGPT", "Gemini", "Windsurf", "v0", "Anthropic API", "OpenAI API"
];

const PLAN_OPTIONS: PlanType[] = ["Free", "Individual/Pro", "Team", "Enterprise", "API"];

const USE_CASES = [
  { value: "coding", label: "Software Engineering" },
  { value: "writing", label: "Copywriting & Content" },
  { value: "research", label: "Research & Strategy" },
  { value: "data", label: "Data Analysis" },
  { value: "mixed", label: "Mixed / General Purpose" },
];

const toolSchema = z.object({
  tool: z.enum(["Cursor", "GitHub Copilot", "Claude", "ChatGPT", "Anthropic API", "OpenAI API", "Gemini", "Windsurf", "v0"]),
  plan: z.enum(["Free", "Individual/Pro", "Team", "Enterprise", "API"]),
  monthlySpend: z.coerce.number().min(0, "Must be positive"),
  seats: z.coerce.number().min(1, "Must be at least 1"),
});

const formSchema = z.object({
  teamSize: z.coerce.number().min(1, "Team size must be at least 1"),
  primaryUseCase: z.enum(["coding", "writing", "research", "data", "mixed"]),
  tools: z.array(toolSchema).min(1, "Add at least one tool to audit"),
});

type FormValues = z.infer<typeof formSchema>;

export function AuditForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      teamSize: 1,
      primaryUseCase: "coding",
      tools: [{ tool: "ChatGPT", plan: "Individual/Pro", monthlySpend: 20, seats: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "tools",
    control: form.control,
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const result = runAudit(data);
      const reportId = await saveReport(data, result);
      
      if (reportId) {
        router.push(`/report/results?id=${reportId}`);
      } else {
        // Fallback if Supabase is not configured
        const encodedData = btoa(JSON.stringify(data));
        router.push(`/report/results?data=${encodedData}`);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="teamSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Team Size</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormDescription>How many total employees are in the company?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primaryUseCase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Use Case</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a use case" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USE_CASES.map(uc => (
                      <SelectItem key={uc.value} value={uc.value}>{uc.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>What is the main driver of AI usage?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Current AI Tooling</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ tool: "Cursor", plan: "Individual/Pro", monthlySpend: 20, seats: 1 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Tool
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="relative shadow-sm border-border">
              <CardContent className="p-4 sm:p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
                <FormField
                  control={form.control}
                  name={`tools.${index}.tool`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tool" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TOOL_OPTIONS.map(tool => (
                            <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tools.${index}.plan`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Tier</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PLAN_OPTIONS.map(plan => (
                            <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tools.${index}.seats`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seats / Users</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`tools.${index}.monthlySpend`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Spend ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Analyzing..." : "Generate Optimization Report"}
          {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </Form>
  );
}
