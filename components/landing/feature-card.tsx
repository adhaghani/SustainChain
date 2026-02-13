import { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon?: LucideIcon | React.ElementType;
  title: string;
  description: string;
  className?: string;
  highlight?: string;
}

export function FeatureCard({ icon: Icon, title, description, className = "", highlight }: FeatureCardProps) {
  return (
    <Card className={cn("bg-white/5 border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all duration-300 group selection:bg-emerald-500/30", className)}>
      <CardHeader>
        {Icon && (
          <div className="mb-4 inline-flex p-3 rounded-lg bg-linear-to-br from-emerald-500/20 to-teal-500/20 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-colors w-fit">
            <Icon className="w-6 h-6 text-emerald-400" />
          </div>
        )}
        <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 leading-relaxed mb-4">{description}</p>
        {highlight && (
          <div className="pt-4 border-t border-white/5">
            <span className="text-sm font-medium text-emerald-400">{highlight}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
