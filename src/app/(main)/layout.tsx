import  Footer  from '@/components/layout/footer';
import Header  from '@/components/layout/navbar';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-24 lg:pb-0">{children}</main>
            <Footer />
        </div>
    );
}
    
