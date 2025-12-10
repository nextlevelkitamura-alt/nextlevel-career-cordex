"use client";

import { updateJob } from "../../../actions";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Job = {
    id: string;
    title: string;
    job_code?: string;
    area: string;
    type: string;
    salary: string;
    category: string;
    tags: string[] | null;
    pdf_url?: string | null;
    client_id?: string | null;
    hero_title?: string | null;
    hero_lead?: string | null;
    hero_image_url?: string | null;
    gallery_image_url?: string | null;
    recommendation?: string | null;
    job_description?: string | null;
    work_location?: string | null;
    nearest_station?: string | null;
    work_time?: string | null;
    work_days?: string | null;
    holidays?: string | null;
    requirements?: string | null;
    welcome?: string | null;
    benefits?: string | null;
    selection_flow?: string | null;
    remarks?: string | null;
};

import FileUploader from "@/components/admin/FileUploader";
import ClientSelect from "@/components/admin/ClientSelect";

export default function EditJobForm({ job }: { job: Job }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);

        if (file) {
            formData.set("pdf_file", file);
        }

        const result = await updateJob(job.id, formData);
        setIsLoading(false);

        if (result?.error) {
            alert(result.error);
        } else {
            router.push("/admin/jobs");
            router.refresh();
        }
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">お仕事ID（自動発行）</label>
                    <input
                        name="job_code"
                        defaultValue={job.job_code}
                        pattern="[0-9]{7}"
                        inputMode="numeric"
                        maxLength={7}
                        minLength={7}
                        required
                        className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="例：5415910"
                    />
                    <p className="text-xs text-slate-500">7桁の数字で編集できます。</p>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">求人タイトル</label>
                    <input
                        name="title"
                        defaultValue={job.title}
                        required
                        className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">キャッチコピー</label>
                    <input
                        name="hero_title"
                        defaultValue={job.hero_title || ""}
                        className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">リード文</label>
                    <input
                        name="hero_lead"
                        defaultValue={job.hero_lead || ""}
                        className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">メイン画像URL</label>
                    <input
                        name="hero_image_url"
                        defaultValue={job.hero_image_url || ""}
                        className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">サブ画像URL</label>
                    <input
                        name="gallery_image_url"
                        defaultValue={job.gallery_image_url || ""}
                        className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">求人票・画像</label>
                <FileUploader
                    onFileSelect={setFile}
                    currentFileUrl={job.pdf_url}
                    accept={{
                        "application/pdf": [".pdf"],
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/png": [".png"],
                    }}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">エリア</label>
                    <input
                        name="area"
                        defaultValue={job.area}
                        required
                        className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">雇用形態</label>
                    <select
                        name="type"
                        defaultValue={job.type}
                        required
                        className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                        <option value="派遣">派遣</option>
                        <option value="正社員">正社員</option>
                        <option value="紹介予定派遣">紹介予定派遣</option>
                        <option value="契約社員">契約社員</option>
                        <option value="アルバイト・パート">アルバイト・パート</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">給与</label>
                    <input
                        name="salary"
                        defaultValue={job.salary}
                        required
                        className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">職種カテゴリー</label>
                    <select
                        name="category"
                        defaultValue={job.category}
                        required
                        className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    >
                        <option value="事務">事務</option>
                        <option value="コールセンター">コールセンター</option>
                        <option value="営業">営業</option>
                        <option value="IT・エンジニア">IT・エンジニア</option>
                        <option value="クリエイティブ">クリエイティブ</option>
                        <option value="販売・接客">販売・接客</option>
                        <option value="その他">その他</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">タグ（カンマ区切り）</label>
                <input
                    name="tags"
                    defaultValue={job.tags?.join(", ")}
                    className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">求人元（取引先）<span className="text-xs font-normal text-slate-500 ml-2">※非公開</span></label>
                <ClientSelect name="client_id" defaultValue={job.client_id} />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">おすすめポイント</label>
                    <textarea
                        name="recommendation"
                        defaultValue={job.recommendation || ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">仕事内容</label>
                    <textarea
                        name="job_description"
                        defaultValue={job.job_description || ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">勤務地詳細</label>
                    <textarea
                        name="work_location"
                        defaultValue={job.work_location || ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={2}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">最寄駅・アクセス</label>
                    <textarea
                        name="nearest_station"
                        defaultValue={job.nearest_station || ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={2}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">勤務時間・シフト</label>
                    <textarea
                        name="work_time"
                        defaultValue={job.work_time || ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={2}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">勤務日数・休日</label>
                    <textarea
                        name="work_days"
                        defaultValue={job.work_days || ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={2}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">休日・休暇</label>
                <textarea
                    name="holidays"
                    defaultValue={job.holidays || ""}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">応募条件</label>
                    <textarea
                        name="requirements"
                        defaultValue={job.requirements || ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">歓迎スキル・人物像</label>
                    <textarea
                        name="welcome"
                        defaultValue={job.welcome || ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">待遇・福利厚生</label>
                <textarea
                    name="benefits"
                    defaultValue={job.benefits || ""}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">選考フロー</label>
                    <textarea
                        name="selection_flow"
                        defaultValue={job.selection_flow || ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">備考</label>
                    <textarea
                        name="remarks"
                        defaultValue={job.remarks || ""}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                    />
                </div>
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-bold"
                    disabled={isLoading}
                >
                    {isLoading ? "更新中..." : "求人を更新する"}
                </Button>
            </div>
        </form>
    );
}
