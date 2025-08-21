import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, FileText, CheckCircle, AlertTriangle, DollarSign } from "lucide-react";

const stats = [
  {
    title: "Documents Processed",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: FileText,
    color: "text-primary"
  },
  {
    title: "Auto-Approved",
    value: "89.3%",
    change: "+2.1%",
    trend: "up", 
    icon: CheckCircle,
    color: "text-success"
  },
  {
    title: "Pending Review",
    value: "23",
    change: "-5",
    trend: "down",
    icon: AlertTriangle,
    color: "text-warning"
  },
  {
    title: "Duties Calculated",
    value: "₹45.2L",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "text-accent"
  }
];

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-elegant">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className={`mr-1 h-3 w-3 ${
                stat.trend === 'up' ? 'text-success' : 'text-destructive'
              }`} />
              <span className={stat.trend === 'up' ? 'text-success' : 'text-destructive'}>
                {stat.change}
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};