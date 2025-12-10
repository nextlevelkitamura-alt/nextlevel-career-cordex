"use server";

import { createClient as createSupabaseClient } from "@/utils/supabase/server";

import { revalidatePath } from "next/cache";

// Check if current user is admin
export async function checkAdmin() {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return false;
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    return profile?.is_admin === true;
}

// Get all clients
export async function getClients() {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

// Create new client
export async function createClient(name: string) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("clients")
        .insert({ name })
        .select()
        .single();

    if (error) return { error: error.message };
    return { success: true, client: data };
}

// Get all jobs (with client name)
export async function getJobs(query?: string) {
    const supabase = createSupabaseClient();
    let builder = supabase
        .from("jobs")
        .select("*, clients(name)")
        .order("created_at", { ascending: false });

    if (query) {
        builder = builder.or(`title.ilike.%${query}%,job_code.ilike.%${query}%`);
    }

    const { data, error } = await builder;

    if (error) throw new Error(error.message);
    return data;
}

// Get single job
export async function getJob(id: string) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
        .from("jobs")
        .select("*, clients(name)")
        .eq("id", id)
        .single();

    if (error) throw new Error(error.message);
    return data;
}

// Create job
export async function createJob(formData: FormData) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const supabase = createSupabaseClient();
    const title = formData.get("title") as string;

    // Auto-generate 7-digit numeric Job Code (e.g., 1234567)
    const job_code = `${Math.floor(1000000 + Math.random() * 9000000)}`;

    const area = formData.get("area") as string;
    const type = formData.get("type") as string;
    const salary = formData.get("salary") as string;
    const category = formData.get("category") as string;
    const tags = (formData.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean);
    const pdfFile = formData.get("pdf_file") as File;
    const client_id = formData.get("client_id") as string || null;
    const hero_title = (formData.get("hero_title") as string | null) || null;
    const hero_lead = (formData.get("hero_lead") as string | null) || null;
    const hero_image_url = (formData.get("hero_image_url") as string | null) || null;
    const gallery_image_url = (formData.get("gallery_image_url") as string | null) || null;
    const recommendation = (formData.get("recommendation") as string | null) || null;
    const job_description = (formData.get("job_description") as string | null) || null;
    const work_location = (formData.get("work_location") as string | null) || null;
    const nearest_station = (formData.get("nearest_station") as string | null) || null;
    const work_time = (formData.get("work_time") as string | null) || null;
    const work_days = (formData.get("work_days") as string | null) || null;
    const holidays = (formData.get("holidays") as string | null) || null;
    const requirements = (formData.get("requirements") as string | null) || null;
    const welcome = (formData.get("welcome") as string | null) || null;
    const benefits = (formData.get("benefits") as string | null) || null;
    const selection_flow = (formData.get("selection_flow") as string | null) || null;
    const remarks = (formData.get("remarks") as string | null) || null;

    let pdf_url = null;

    // Handle PDF Upload
    if (pdfFile && pdfFile.size > 0) {
        const extension = pdfFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
        const { error: uploadError } = await supabase.storage
            .from("job-documents")
            .upload(fileName, pdfFile);

        if (uploadError) {
            return { error: "PDF upload failed: " + uploadError.message };
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from("job-documents")
            .getPublicUrl(fileName);

        pdf_url = publicUrl;
    }

    const { error } = await supabase.from("jobs").insert({
        title,
        job_code,
        area,
        type,
        salary,
        category,
        tags,
        pdf_url,
        client_id,
        hero_title,
        hero_lead,
        hero_image_url,
        gallery_image_url,
        recommendation,
        job_description,
        work_location,
        nearest_station,
        work_time,
        work_days,
        holidays,
        requirements,
        welcome,
        benefits,
        selection_flow,
        remarks,
    });

    if (error) return { error: error.message };

    revalidatePath("/jobs");
    revalidatePath("/admin/jobs");
    return { success: true };
}

// Update job
export async function updateJob(id: string, formData: FormData) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const supabase = createSupabaseClient();
    const title = formData.get("title") as string;
    const area = formData.get("area") as string;
    const type = formData.get("type") as string;
    const salary = formData.get("salary") as string;
    const category = formData.get("category") as string;
    const tags = (formData.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean);
    const pdfFile = formData.get("pdf_file") as File;
    const client_id = formData.get("client_id") as string || null;
    const job_code = (formData.get("job_code") as string | null)?.trim();
    const hero_title = (formData.get("hero_title") as string | null) || null;
    const hero_lead = (formData.get("hero_lead") as string | null) || null;
    const hero_image_url = (formData.get("hero_image_url") as string | null) || null;
    const gallery_image_url = (formData.get("gallery_image_url") as string | null) || null;
    const recommendation = (formData.get("recommendation") as string | null) || null;
    const job_description = (formData.get("job_description") as string | null) || null;
    const work_location = (formData.get("work_location") as string | null) || null;
    const nearest_station = (formData.get("nearest_station") as string | null) || null;
    const work_time = (formData.get("work_time") as string | null) || null;
    const work_days = (formData.get("work_days") as string | null) || null;
    const holidays = (formData.get("holidays") as string | null) || null;
    const requirements = (formData.get("requirements") as string | null) || null;
    const welcome = (formData.get("welcome") as string | null) || null;
    const benefits = (formData.get("benefits") as string | null) || null;
    const selection_flow = (formData.get("selection_flow") as string | null) || null;
    const remarks = (formData.get("remarks") as string | null) || null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
        title,
        area,
        type,
        salary,
        category,
        tags,
        client_id,
        hero_title,
        hero_lead,
        hero_image_url,
        gallery_image_url,
        recommendation,
        job_description,
        work_location,
        nearest_station,
        work_time,
        work_days,
        holidays,
        requirements,
        welcome,
        benefits,
        selection_flow,
        remarks,
    };

    if (job_code) {
        const isSevenDigits = /^\d{7}$/.test(job_code);
        if (!isSevenDigits) {
            return { error: "お仕事IDは7桁の数字で入力してください。" };
        }
        updateData.job_code = job_code;
    }

    // Handle PDF Upload (only if new file provided)
    if (pdfFile && pdfFile.size > 0) {
        const extension = pdfFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
        const { error: uploadError } = await supabase.storage
            .from("job-documents")
            .upload(fileName, pdfFile);

        if (uploadError) {
            return { error: "PDF upload failed: " + uploadError.message };
        }

        const { data: { publicUrl } } = supabase.storage
            .from("job-documents")
            .getPublicUrl(fileName);

        updateData.pdf_url = publicUrl;
    }

    const { error } = await supabase
        .from("jobs")
        .update(updateData)
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/jobs");
    revalidatePath("/admin/jobs");
    return { success: true };
}

// Delete job
export async function deleteJob(id: string) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) throw new Error("Unauthorized");

    const supabase = createSupabaseClient();
    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/jobs");
    revalidatePath("/admin/jobs");
    return { success: true };
}
