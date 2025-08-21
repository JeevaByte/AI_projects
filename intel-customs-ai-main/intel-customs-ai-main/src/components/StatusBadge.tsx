import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

export type StatusType = "approved" | "pending" | "rejected" | "review";

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
}

const statusConfig = {
  approved: {
    variant: "default" as const,
    icon: CheckCircle,
    className: "bg-success text-success-foreground hover:bg-success/80"
  },
  pending: {
    variant: "secondary" as const,
    icon: Clock,
    className: "bg-warning text-warning-foreground hover:bg-warning/80"
  },
  rejected: {
    variant: "destructive" as const,
    icon: XCircle,
    className: ""
  },
  review: {
    variant: "outline" as const,
    icon: AlertTriangle,
    className: "border-warning text-warning-foreground"
  }
};

export const StatusBadge = ({ status, children }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {children}
    </Badge>
  );
};