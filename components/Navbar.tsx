import Link from "next/link";
import { Building2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";

export function Navbar() {
  return (
    <header className="border-b bg-white dark:bg-zinc-950">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-900 dark:text-blue-100">
          <Building2 className="h-6 w-6" />
          <span>ConTech Manager</span>
        </Link>
        <nav className="flex items-center gap-4">
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
          <form action={logout} >
            <Button variant="ghost" size="sm">
              Log out
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
}
