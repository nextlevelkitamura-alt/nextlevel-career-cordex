"use client";

import { createJob } from "../../actions";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import FileUploader from "@/components/admin/FileUploader";
import ClientSelect from "@/components/admin/ClientSelect";

export default function CreateJobPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);

        if (file) {
            formData.set("pdf_file", file);
        }

        const result = await createJob(formData);
        setIsLoading(false);

        if (result?.error) {
            alert(result.error);
        } else {
            router.push("/admin/jobs");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900">求人新規作成</h1>
                <Link href="/admin/jobs">
                    <Button variant="outline">キャンセル</Button>
                </Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">求人タイトル</label>
                        <input
                            name="title"
                            required
                            className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="例：【未経験OK】一般事務スタッフ"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">キャッチコピー</label>
                            <input
                                name="hero_title"
                                className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="例：<未経験OK>スマホ問合せ窓口スタッフ"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">リード文</label>
                            <input
                                name="hero_lead"
                                className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="例：研修充実＆シフト柔軟。20〜30代活躍中！"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">メイン画像URL</label>
                            <input
                                name="hero_image_url"
                                className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="例：https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">サブ画像URL</label>
                            <input
                                name="gallery_image_url"
                                className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="例：https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">求人票・画像（任意）</label>
                        <FileUploader
                            onFileSelect={setFile}
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
                                required
                                className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="例：東京"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">雇用形態</label>
                            <select
                                name="type"
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
                                required
                                className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="例：時給 1,600円〜"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">職種カテゴリー</label>
                            <select
                                name="category"
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
                            className="w-full h-12 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="例：未経験OK, 駅チカ, 残業少なめ"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">求人元（取引先）<span className="text-xs font-normal text-slate-500 ml-2">※非公開</span></label>
                        <ClientSelect name="client_id" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">おすすめポイント</label>
                            <textarea
                                name="recommendation"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={3}
                                placeholder="例：20〜30代活躍中 / 研修サポート充実 など"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">仕事内容</label>
                            <textarea
                                name="job_description"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={3}
                                placeholder="例：スマホに関する問い合わせ対応、データ入力 など"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">勤務地詳細</label>
                            <textarea
                                name="work_location"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={2}
                                placeholder="例：○○線××駅 徒歩5分、在宅とのハイブリッド可 など"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">最寄駅・アクセス</label>
                            <textarea
                                name="nearest_station"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={2}
                                placeholder="例：渋谷駅 徒歩5分 / バス停◯◯より徒歩2分"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">勤務時間・シフト</label>
                            <textarea
                                name="work_time"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={2}
                                placeholder="例：9:00〜18:00（休憩1h）/ 週4日〜OK など"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">勤務日数・休日</label>
                            <textarea
                                name="work_days"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={2}
                                placeholder="例：土日祝休み / シフト制 / 年間休日120日 など"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">休日・休暇</label>
                        <textarea
                            name="holidays"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={2}
                            placeholder="例：土日祝休み / シフト制で週2日休み など"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">応募条件</label>
                            <textarea
                                name="requirements"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={3}
                                placeholder="例：PC基本操作ができる方 / コール経験1年以上 など"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">歓迎スキル・人物像</label>
                            <textarea
                                name="welcome"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={3}
                                placeholder="例：接客経験 / 柔軟なシフト対応が可能な方 など"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">待遇・福利厚生</label>
                        <textarea
                            name="benefits"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            rows={3}
                            placeholder="例：交通費全額 / 社会保険完備 / 研修充実 など"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">選考フロー</label>
                            <textarea
                                name="selection_flow"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={3}
                                placeholder="例：応募→書類選考→面談→職場見学→内定"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">備考</label>
                            <textarea
                                name="remarks"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={3}
                                placeholder="例：服装自由・ネイルOK など補足事項"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-bold"
                            disabled={isLoading}
                        >
                            {isLoading ? "作成中..." : "求人を作成する"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
