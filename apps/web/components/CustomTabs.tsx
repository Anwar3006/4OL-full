"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CustomTabs = ({ tabs, defaultValue }: TTabsProps) => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0].value);

  if (!tabs.length) return null;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      {/* Mobile: Dropdown Select */}
      {isMobile ? (
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Select a tab" />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        // Desktop: Traditional Tabs
        <TabsList className="w-full h-full justify-start mb-6 bg-muted/50 p-1 md:grid md:gap-1 md:grid-cols-3 lg:grid-cols-4">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 data-[state=active]:bg-green-300 truncate"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      )}

      {/* Tab content (same for both) */}
      <div>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

export default CustomTabs;
