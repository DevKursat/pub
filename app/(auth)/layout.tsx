// Force dynamic rendering for auth pages so env vars are available at runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
