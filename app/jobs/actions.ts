"use server";

import { createClient } from "@/utils/supabase/server";

export async function getPublicJobs() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("jobs")
        // select all to avoid errors when columns are not yet added on the DB
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching jobs:", error);
        return [];
    }

    // Omit PDF URL for public
    return (data || []).map((item) => {
        const sanitized = { ...item } as Record<string, unknown>;
        delete sanitized.pdf_url;
        return sanitized;
    });
}

export async function getPublicJob(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("jobs")
        // select all to avoid errors when columns are not yet added on the DB
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching job:", error);
        return null;
    }

    if (!data) return null;

    // Remove PDF URL from public response
    const sanitized = { ...(data as Record<string, unknown>) };
    delete sanitized.pdf_url;
    return sanitized;
}
