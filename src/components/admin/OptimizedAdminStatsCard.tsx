
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface OptimizedAdminStatsCardProps {
  title: string;
  count: number;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onButtonClick: () => void;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

const OptimizedAdminStatsCard = memo<OptimizedAdminStatsCardProps>(({
  title,
  count,
  description,
  icon: Icon,
  buttonText,
  onButtonClick,
  trend,
  isLoading = false
}) => {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50" />
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Icon className="h-4 w-4 text-blue-600" />
          </div>
          {title}
        </CardTitle>
        {trend && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${
            trend.isPositive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </CardHeader>
      
      <CardContent className="relative">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          ) : (
            count
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          {description}
        </p>
        
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full bg-white/80 hover:bg-white transition-colors disabled:opacity-50"
          onClick={onButtonClick}
          disabled={isLoading}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
});

OptimizedAdminStatsCard.displayName = 'OptimizedAdminStatsCard';

export default OptimizedAdminStatsCard;
