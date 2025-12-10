import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getPublicJob } from "../actions";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    MapPin,
    Banknote,
    Briefcase,
    Tag,
    MessageCircleMore,
    Clock3,
    Bus,
    ClipboardList,
    Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

const lineUrl = process.env.NEXT_PUBLIC_LINE_URL || "https://line.me/ja/";

export default async function JobDetailPage({ params }: { params: { id: string } }) {
    const job = await getPublicJob(params.id);

    if (!job) {
        notFound();
    }

    const tags = job.tags || [];
    const createdAt = (() => {
        const value = job.created_at;
        if (typeof value === "string" || typeof value === "number" || value instanceof Date) {
            const parsed = new Date(value);
            return Number.isNaN(parsed.getTime()) ? null : parsed.toLocaleDateString("ja-JP");
        }
        return null;
    })();
    const heroImage = job.hero_image_url || job.gallery_image_url || "/jobs-bg.jpg";

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="relative">
                <div className="absolute inset-0">
                    <Image src={heroImage} alt={job.title} fill className="object-cover opacity-20" priority />
                    <div className="absolute inset-0 bg-slate-900/70" />
                </div>
                <div className="container relative z-10 mx-auto px-4 py-10">
                    <div className="mb-4">
                        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-primary-100 hover:text-white">
                            <ArrowLeft className="w-4 h-4" />
                            求人一覧に戻る
                        </Link>
                    </div>
                    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="px-3 py-1 rounded-full text-sm bg-primary-200/20 text-white border border-white/20">
                                        {job.category}
                                    </span>
                                    {job.job_code && (
                                        <span className="text-xs font-mono text-primary-100">ID: {job.job_code}</span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">{job.title}</h1>
                                {job.hero_title && (
                                    <p className="text-lg text-primary-50">{job.hero_title}</p>
                                )}
                                <div className="flex flex-wrap gap-4 text-primary-50 text-sm">
                                    <span className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {job.area}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        {job.type}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Banknote className="w-4 h-4" />
                                        {job.salary}
                                    </span>
                                    {createdAt && <span className="text-primary-100/80">掲載日: {createdAt}</span>}
                                </div>
                                {job.hero_lead && <p className="text-primary-50 leading-relaxed">{job.hero_lead}</p>}
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag: string, idx: number) => (
                                            <span
                                                key={`${tag}-${idx}`}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/15"
                                            >
                                                <Tag className="w-3 h-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[260px]">
                                <Button
                                    asChild
                                    className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 border-0"
                                >
                                    <Link href={lineUrl} target="_blank" rel="noopener noreferrer" prefetch={false}>
                                        <MessageCircleMore className="w-4 h-4 mr-2" />
                                        LINEで詳しく相談する
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-10 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {job.recommendation && (
                            <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="w-5 h-5 text-primary-600" />
                                    <h2 className="text-lg font-bold text-slate-900">こんな方におすすめ</h2>
                                </div>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{job.recommendation}</p>
                            </section>
                        )}

                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                            <div className="flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-primary-600" />
                                <h2 className="text-lg font-bold text-slate-900">求人詳細</h2>
                            </div>

                            {job.job_description && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 mb-1">仕事内容</p>
                                    <p className="text-slate-800 leading-relaxed whitespace-pre-line">{job.job_description}</p>
                                </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-4">
                                <DetailItem label="勤務地" value={job.work_location || job.area} icon={<MapPin className="w-4 h-4 text-slate-400" />} />
                                <DetailItem label="最寄駅・アクセス" value={job.nearest_station} icon={<Bus className="w-4 h-4 text-slate-400" />} />
                                <DetailItem label="勤務時間・シフト" value={job.work_time} icon={<Clock3 className="w-4 h-4 text-slate-400" />} />
                                <DetailItem label="勤務日数・休日" value={job.work_days || job.holidays} icon={<Briefcase className="w-4 h-4 text-slate-400" />} />
                                <DetailItem label="給与" value={job.salary} icon={<Banknote className="w-4 h-4 text-slate-400" />} />
                                <DetailItem label="雇用形態" value={job.type} icon={<Tag className="w-4 h-4 text-slate-400" />} />
                            </div>

                            {job.requirements && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 mb-1">応募条件</p>
                                    <p className="text-slate-800 leading-relaxed whitespace-pre-line">{job.requirements}</p>
                                </div>
                            )}

                            {job.welcome && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 mb-1">歓迎スキル・人物像</p>
                                    <p className="text-slate-800 leading-relaxed whitespace-pre-line">{job.welcome}</p>
                                </div>
                            )}

                            {job.benefits && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 mb-1">待遇・福利厚生</p>
                                    <p className="text-slate-800 leading-relaxed whitespace-pre-line">{job.benefits}</p>
                                </div>
                            )}

                            {job.selection_flow && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 mb-1">選考フロー</p>
                                    <p className="text-slate-800 leading-relaxed whitespace-pre-line">{job.selection_flow}</p>
                                </div>
                            )}

                            {job.remarks && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 mb-1">備考</p>
                                    <p className="text-slate-800 leading-relaxed whitespace-pre-line">{job.remarks}</p>
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="space-y-6">
                        {(job.hero_image_url || job.gallery_image_url) && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="aspect-[4/3] relative">
                                    <Image
                                        src={job.hero_image_url || job.gallery_image_url || "/jobs-bg.jpg"}
                                        alt="求人イメージ"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                {job.gallery_image_url && (
                                    <div className="p-3 border-t border-slate-200">
                                        <div className="aspect-[16/9] relative rounded-lg overflow-hidden bg-slate-100">
                                            <Image
                                                src={job.gallery_image_url}
                                                alt="サブイメージ"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="bg-slate-900 text-white rounded-xl p-5">
                            <h3 className="text-lg font-semibold mb-2">LINEで相談</h3>
                            <p className="text-sm text-slate-100 leading-relaxed mb-4">
                                求人の詳細や働き方の相談、応募手続きの流れもLINEでスムーズにご案内します。
                            </p>
                            <Button
                                asChild
                                className="w-full bg-green-500 hover:bg-green-600 text-white border-0"
                            >
                                <Link href={lineUrl} target="_blank" rel="noopener noreferrer" prefetch={false}>
                                    <MessageCircleMore className="w-4 h-4 mr-2" />
                                    LINEで相談する
                                </Link>
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value, icon }: { label: string; value?: string | null; icon: ReactNode }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
            <div className="mt-0.5">{icon}</div>
            <div>
                <p className="text-xs font-semibold text-slate-500">{label}</p>
                <p className="text-sm text-slate-800 whitespace-pre-line">{value}</p>
            </div>
        </div>
    );
}
