import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

    if (!profile?.is_admin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-sm">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">アクセス権限がありません</h1>
                    <p className="text-slate-600 mb-6">このページを表示するには管理者権限が必要です。</p>
                    <Link href="/" className="text-primary-600 hover:underline">
                        トップページへ戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <nav className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <Link href="/admin/jobs" className="text-xl font-bold text-slate-900">
                            管理画面
                        </Link>
                        <div className="flex gap-4">
                            <Link href="/admin/jobs" className="text-slate-600 hover:text-primary-600 font-medium">
                                求人管理
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">{user.email}</span>
                        <Link href="/" className="text-sm text-primary-600 hover:underline">
                            サイトを表示
                        </Link>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
