import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { getCurrentUser } from "@/lib/auth";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <Header user={user ? { name: user.name || "", email: user.email } : undefined} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
