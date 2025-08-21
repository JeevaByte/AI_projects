import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X, Calendar, BarChart3 } from "lucide-react";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onStatusFilter: (status: string) => void;
  onDateFilter: (period: string) => void;
  activeFilters: {
    search: string;
    status: string;
    dateRange: string;
  };
  onClearFilters: () => void;
}

export const SearchAndFilter = ({
  onSearch,
  onStatusFilter,
  onDateFilter,
  activeFilters,
  onClearFilters
}: SearchAndFilterProps) => {
  const [searchTerm, setSearchTerm] = useState(activeFilters.search);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const filterCount = Object.values(activeFilters).filter(v => v && v !== 'all').length;

  return (
    <Card className="shadow-elegant">
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents, HS codes, or product descriptions..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={activeFilters.status} onValueChange={onStatusFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="review">Review Required</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Select value={activeFilters.dateRange} onValueChange={onDateFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Toggle */}
          <Button variant="outline" className="relative">
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {filterCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                {filterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Active Filters Display */}
        {filterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilters.search && (
              <Badge variant="outline" className="gap-1">
                Search: {activeFilters.search}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleSearchChange('')}
                />
              </Badge>
            )}
            {activeFilters.status && activeFilters.status !== 'all' && (
              <Badge variant="outline" className="gap-1">
                Status: {activeFilters.status}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => onStatusFilter('all')}
                />
              </Badge>
            )}
            {activeFilters.dateRange && activeFilters.dateRange !== 'all' && (
              <Badge variant="outline" className="gap-1">
                Date: {activeFilters.dateRange}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => onDateFilter('all')}
                />
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex flex-wrap gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">1,247 Total Documents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span className="text-sm text-muted-foreground">89.3% Auto-approved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-warning"></div>
            <span className="text-sm text-muted-foreground">23 Pending Review</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};