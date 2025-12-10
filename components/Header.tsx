import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import SignOutButton from './SignOutButton';

export default async function Header() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isAdmin = false;
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();
        isAdmin = profile?.is_admin === true;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
            <div className="w-full flex h-16 items-center justify-between px-4 md:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <Image
                        src="/logo_large.png"
                        alt="Next Level Career"
                        width={200}
                        height={60}
                        className="h-10 w-auto object-contain"
                        priority
                    />
                </Link>
                <nav className="flex items-center gap-6">
                    {isAdmin && (
                        <Link href="/admin/jobs" className="text-base font-bold text-red-600 hover:text-red-700 transition-colors px-2 py-1 border border-red-200 rounded-lg bg-red-50">
                            管理画面
                        </Link>
                    )}
                    <Link href="/jobs" className="text-base font-bold text-slate-600 hover:text-primary-600 transition-colors px-2 py-1">
                        求人を探す
                    </Link>
                    <Link href="/#features" className="hidden md:block text-base font-bold text-slate-600 hover:text-primary-600 transition-colors px-2 py-1">
                        サービスの流れ
                    </Link>
                    {user ? (
                        <SignOutButton />
                    ) : (
                        <Link href="/login" className="hidden md:block text-base font-bold text-slate-600 hover:text-primary-600 transition-colors px-2 py-1">
                            ログイン
                        </Link>
                    )}
                    {!user && (
                        <Link href="/register" className="hidden md:block text-base font-bold text-slate-600 hover:text-primary-600 transition-colors px-2 py-1">
                            相談する
                        </Link>
                    )}
                    <Link href="/for-companies" className="hidden md:block text-base font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors px-4 py-2 rounded-full shadow-md">
                        採用企業様へ
                    </Link>
                </nav>
            </div>
        </header>
    );
}
