import { createClient } from '@supabase/supabase-js';
import { AuditContext, AuditResult } from './audit-engine';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export async function saveReport(data: AuditContext, result: AuditResult): Promise<string | null> {
  if (!supabase) return null; // Fallback to URL encoded if no Supabase configured

  try {
    const { data: record, error } = await supabase
      .from('audits')
      .insert([
        { 
          context: data, 
          result,
          annual_savings: result.annualSavings,
          created_at: new Date().toISOString()
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Error saving report to Supabase:', error);
      return null;
    }

    return record.id;
  } catch (err) {
    console.error('Exception saving report:', err);
    return null;
  }
}

export async function captureLead(email: string, reportId?: string): Promise<boolean> {
  if (!supabase) return true; // Pretend it succeeded if no Supabase

  try {
    const { error } = await supabase
      .from('leads')
      .insert([
        { 
          email, 
          report_id: reportId || null,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error capturing lead:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception capturing lead:', err);
    return false;
  }
}

export async function getReport(id: string): Promise<{ context: AuditContext, result: AuditResult } | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('audits')
      .select('context, result')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      context: data.context as AuditContext,
      result: data.result as AuditResult
    };
  } catch (err) {
    return null;
  }
}
