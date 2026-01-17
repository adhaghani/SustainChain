"use client";

import { ArrowRight, BarChart3, CheckCircle2, Globe, LayoutDashboard, Leaf, ScanLine, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "@/components/landing/feature-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { translations } from "@/lib/i18n";

export default function LandingPage() {
  const [lang, setLang] = useState<"en" | "bm">("en");
  const t = translations[lang];

  const toggleLang = () => {
    setLang(lang === "en" ? "bm" : "en");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-emerald-500/30">
      {/* Navbar Overlay */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">SustainChain</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
             <Link href="#features" className="hover:text-white transition-colors">{t.nav.features}</Link>
             <Link href="#impact" className="hover:text-white transition-colors">{t.nav.impact}</Link>
             <Link href="#how-it-works" className="hover:text-white transition-colors">{t.nav.howItWorks}</Link>
          </div>
          <div className="flex items-center gap-4">
            <Badge 
              variant="outline" 
              className="border-white/10 text-gray-400 font-medium cursor-pointer hover:bg-white/5 transition-colors"
              onClick={toggleLang}
            >
              <span className={lang === "en" ? "text-white" : ""}>EN</span> / <span className={lang === "bm" ? "text-white" : ""}>BM</span>
            </Badge>
            <Link href="/sign-in">
              <Button variant="ghost" className="rounded-full font-medium hover:bg-white/5 transition-colors text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="secondary" className="rounded-full font-semibold hover:bg-gray-200 transition-colors">
                {t.nav.getStarted}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-[#0A0A0A] to-[#0A0A0A]" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
            <Badge variant="secondary" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 mb-8 px-3 py-1 gap-2 hover:bg-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {t.hero.badge}
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent max-w-4xl mx-auto leading-[1.1]">
              {t.hero.title} <br />
              <span className="text-white">{t.hero.subtitle}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 py-6 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all flex items-center justify-center gap-2 group text-lg">
                  {t.hero.ctaStart}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 rounded-full border-white/10 hover:bg-white/10 text-white font-semibold transition-all text-lg bg-white/5">
                  {t.hero.ctaDemo}
                </Button>
              </Link>
            </div>
            
            {/* Social Proof / Trust */}
            <div className="mt-16 pt-8 border-t border-white/5">
                <p className="text-sm text-gray-500 mb-4">{t.hero.alignedWith}</p>
                <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholders for logos */}
                    <span className="text-lg font-bold text-white">BURSA MALAYSIA</span>
                    <span className="text-lg font-bold text-white">MITI</span>
                    <span className="text-lg font-bold text-white">UN SDGs</span>
                    <span className="text-lg font-bold text-white">Google Cloud</span>
                </div>
            </div>
        </div>
      </section>

      {/* Problem vs Solution - The "Why Now" */}
      <section className="py-24 bg-white/5">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                   <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.problem.title}</h2>
                   <div className="space-y-6">
                        <div className="flex gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <div className="shrink-0 mt-1">
                                <ShieldCheck className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-200 mb-1">{t.problem.complianceTitle}</h3>
                                <p className="text-sm text-red-200/60">{t.problem.complianceDesc}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                             <div className="shrink-0 mt-1">
                                <BarChart3 className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-200 mb-1">{t.problem.costTitle}</h3>
                                <p className="text-sm text-red-200/60">{t.problem.costDesc}</p>
                            </div>
                        </div>
                   </div>
                </div>
                
                <div className="relative">
                   <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-full opacity-30" />
                   <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><Leaf className="w-5 h-5"/></span>
                            {t.problem.solutionTitle}
                        </h2>
                        <ul className="space-y-4">
                            {t.problem.solutionFeatures.map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-300">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                   </div>
                </div>
            </div>
        </div>
      </section>

      {/* Features - Technical Depth */}
      <section id="features" className="py-24 relative overflow-hidden">
         <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.features.title}</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    {t.features.description}
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <FeatureCard 
                    icon={ScanLine}
                    title={t.features.cards[0].title}
                    description={t.features.cards[0].desc}
                    highlight={t.features.cards[0].highlight}
                />
                 <FeatureCard 
                    icon={Globe}
                    title={t.features.cards[1].title}
                    description={t.features.cards[1].desc}
                    highlight={t.features.cards[1].highlight}
                />
                 <FeatureCard 
                    icon={LayoutDashboard}
                    title={t.features.cards[2].title}
                    description={t.features.cards[2].desc}
                    highlight={t.features.cards[2].highlight}
                />
            </div>
         </div>
      </section>

      {/* How It Works - Demo Flow */}
      <section id="how-it-works" className="py-24 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">{t.howItWorks.title}</h2>
            
            <div className="grid md:grid-cols-4 gap-8">
                {t.howItWorks.steps.map((item, i) => (
                    <Card key={i} className="relative group bg-transparent border-none shadow-none">
                        <CardHeader className="p-0">
                            <div className="text-6xl font-bold text-white/5 absolute -top-4 -left-4 font-mono select-none group-hover:text-emerald-500/10 transition-colors">
                                {`0${i+1}`}
                            </div>
                            <CardTitle className="text-xl font-bold mb-2 relative z-10 text-white">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mt-2">
                             <p className="text-gray-400 relative z-10">{item.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </section>

       {/* SDGs */}
       <section id="impact" className="py-24">
        <div className="container mx-auto px-6 text-center">
             <h2 className="text-3xl md:text-5xl font-bold mb-16">{t.impact.title}</h2>
             <div className="flex flex-wrap justify-center gap-6">
                {[
                    { num: "8", title: t.impact.sdgs[0].title, color: "bg-[#A21942]" },
                    { num: "9", title: t.impact.sdgs[1].title, color: "bg-[#FD6925]" },
                    { num: "12", title: t.impact.sdgs[2].title, color: "bg-[#BF8B2E]" },
                ].map((sdg) => (    
                    <div key={sdg.num} className={`w-40 h-40 ${sdg.color} rounded-xl p-4 flex flex-col justify-between items-start text-white shadow-lg transform hover:scale-105 transition-transform`}>
                        <span className="text-4xl font-bold opacity-80">{sdg.num}</span>
                        <span className="text-xs font-bold leading-tight text-left">{sdg.title}</span>
                    </div>
                ))}
             </div>
        </div>
       </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900/20" />
        <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">{t.cta.title}</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                {t.cta.description}
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="px-10 py-8 rounded-full bg-white text-emerald-900 font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl shadow-emerald-900/20">
                  {t.cta.button}
              </Button>
            </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-[#050505] text-gray-400 text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                 <Leaf className="w-4 h-4 text-emerald-500" />
                 <span className="font-semibold text-white">SustainChain</span>
            </div>
            <p>© 2026 SustainChain. {t.footer.builtFor}</p>
            <div className="flex items-center gap-6">
                <Link href="#" className="hover:text-white">{t.footer.privacy}</Link>
                <Link href="#" className="hover:text-white">{t.footer.terms}</Link>
                <Link href="#" className="hover:text-white">{t.footer.contact}</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
