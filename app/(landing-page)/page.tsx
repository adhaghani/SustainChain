"use client";

import { ArrowRight, BarChart3, CheckCircle2, Globe, LayoutDashboard, Leaf, ScanLine, ShieldCheck, Zap, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">SustainChain</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors relative group">
                {t.nav.features}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
              <Link href="#impact" className="text-muted-foreground hover:text-foreground transition-colors relative group">
                {t.nav.impact}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors relative group">
                {t.nav.howItWorks}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className="hidden sm:flex border-border/50 text-muted-foreground font-medium cursor-pointer hover:bg-accent hover:border-accent-foreground/20 transition-all"
                onClick={toggleLang}
              >
                <span className={lang === "en" ? "text-foreground font-semibold" : ""}>EN</span>
                <span className="mx-1 text-muted-foreground/50">/</span>
                <span className={lang === "bm" ? "text-foreground font-semibold" : ""}>BM</span>
              </Badge>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="font-medium">
                  {t.landing.buttons.signIn}
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="font-semibold shadow-lg shadow-primary/25">
                  {t.nav.getStarted}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <Badge className="bg-primary/10 hover:bg-primary/20 border-primary/20 text-primary px-4 py-2 text-sm font-semibold gap-2 transition-all cursor-default">
                <Sparkles className="w-3.5 h-3.5" />
                {t.hero.badge}
              </Badge>
            </div>
            
            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="block bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                  {t.hero.title}
                </span>
                <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                  {t.hero.subtitle}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t.hero.description}
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/sign-up" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group">
                  {t.hero.ctaStart}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-semibold border-border/50 hover:bg-accent hover:border-accent-foreground/20">
                  {t.landing.buttons.viewDemo}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">50+</div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">{t.landing.stats.enterprises}</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">10k+</div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">{t.landing.stats.billsAnalyzed}</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">99%</div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">{t.landing.stats.accuracy}</div>
              </div>
            </div>
            
            {/* Trust Logos */}
            <div className="pt-12">
              <p className="text-xs text-muted-foreground/60 mb-6 uppercase tracking-wider font-semibold">{t.hero.alignedWith}</p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40 hover:opacity-60 transition-opacity">
                <span className="text-sm md:text-base font-bold tracking-tight">BURSA MALAYSIA</span>
                <span className="text-sm md:text-base font-bold tracking-tight">MITI</span>
                <span className="text-sm md:text-base font-bold tracking-tight">UN SDGs</span>
                <span className="text-sm md:text-base font-bold tracking-tight">Google Cloud</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className="py-16 md:py-24 border-y border-border/40">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Problems */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Badge variant="outline" className="border-destructive/20 text-destructive bg-destructive/5 font-semibold">
                  {t.landing.badges.currentChallenges}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold">{t.problem.title}</h2>
              </div>
              
              <div className="space-y-4">
                <Card className="border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors group">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ShieldCheck className="w-5 h-5 text-destructive" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{t.problem.complianceTitle}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{t.problem.complianceDesc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors group">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BarChart3 className="w-5 h-5 text-destructive" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{t.problem.costTitle}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{t.problem.costDesc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Solution */}
            <div className="relative">
              <div className="absolute -inset-6 bg-primary/10 blur-3xl rounded-full opacity-30" />
              <Card className="relative border-primary/20 bg-card/50 backdrop-blur-sm shadow-xl shadow-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-primary" />
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">
                      {t.landing.badges.ourSolution}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl">{t.problem.solutionTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {t.problem.solutionFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className="shrink-0 mt-0.5">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                        <span className="text-sm md:text-base leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="font-semibold">{t.landing.badges.features}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold">{t.features.title}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t.features.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <Card className="relative group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  <ScanLine className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{t.features.cards[0].title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm leading-relaxed">{t.features.cards[0].desc}</p>
                <Badge variant="secondary" className="text-xs font-medium">{t.features.cards[0].highlight}</Badge>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="relative group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{t.features.cards[1].title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm leading-relaxed">{t.features.cards[1].desc}</p>
                <Badge variant="secondary" className="text-xs font-medium">{t.features.cards[1].highlight}</Badge>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="relative group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  <LayoutDashboard className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{t.features.cards[2].title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground text-sm leading-relaxed">{t.features.cards[2].desc}</p>
                <Badge variant="secondary" className="text-xs font-medium">{t.features.cards[2].highlight}</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-muted/30 border-y border-border/40">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="font-semibold">{t.landing.badges.simpleProcess}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold">{t.howItWorks.title}</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.howItWorks.steps.map((item, i) => (
              <div key={i} className="relative group">
                {/* Connector Line */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                
                <div className="relative space-y-4">
                  {/* Number Badge */}
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors" />
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
                      <span className="text-2xl font-bold text-primary-foreground">{i + 1}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDGs Impact */}
      <section id="impact" className="py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="font-semibold">{t.landing.badges.unSdgAligned}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold">{t.impact.title}</h2>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { num: "8", title: t.impact.sdgs[0].title, color: "bg-[#A21942]", icon: TrendingUp },
              { num: "9", title: t.impact.sdgs[1].title, color: "bg-[#FD6925]", icon: Zap },
              { num: "12", title: t.impact.sdgs[2].title, color: "bg-[#BF8B2E]", icon: Leaf },
            ].map((sdg) => {    
              const Icon = sdg.icon;
              return (
                <Card key={sdg.num} className={`relative group overflow-hidden border-0 ${sdg.color} hover:scale-105 transition-transform cursor-pointer`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/20" />
                  <CardContent className="relative p-6 h-48 flex flex-col justify-between text-white">
                    <div className="flex items-start justify-between">
                      <span className="text-6xl font-bold opacity-90 leading-none">{sdg.num}</span>
                      <Icon className="w-8 h-8 opacity-60" />
                    </div>
                    <p className="text-sm font-bold leading-tight">{sdg.title}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-2xl shadow-primary/10">
            <CardContent className="p-8 md:p-12 lg:p-16 text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold">{t.cta.title}</h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t.cta.description}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/sign-up">
                  <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all">
                    {t.cta.button}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-semibold border-border/50">
                    {t.landing.buttons.viewDemo}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">SustainChain</span>
            </div>
            
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © 2026 SustainChain. {t.footer.builtFor}
            </p>
            
            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.footer.privacy}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.footer.terms}
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.footer.contact}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
