import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  IconHome,
  IconArrowLeft,
  IconHelp,
  IconSearch,
  IconLeaf
} from '@tabler/icons-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4">
      <Card className="w-full max-w-2xl border-white/10 bg-slate-900/50 backdrop-blur">
        <CardContent className="pt-12 pb-12 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center border border-emerald-500/30">
              <IconLeaf className="w-10 h-10 text-emerald-500" />
            </div>
          </div>

          {/* 404 */}
          <div className="mb-6">
            <h1 className="text-8xl md:text-9xl font-bold text-white/5 select-none">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white -mt-16 mb-4">
              Page Not Found
            </h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                <IconHome className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-700/50">
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Help Links */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-slate-500 mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/dashboard/help" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                <IconHelp className="w-4 h-4" />
                Help Center
              </Link>
              <Link href="/dashboard/entries" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                <IconSearch className="w-4 h-4" />
                Search Bills
              </Link>
              <Link href="/dashboard/reports" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                View Reports
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
