import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Check, TrendingUp, Code, DollarSign, Home, Briefcase, Heart, Factory, GraduationCap, ShoppingCart, Plane } from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  Code,
  DollarSign,
  Home,
  Briefcase,
  Heart,
  Factory,
  GraduationCap,
  ShoppingCart,
  Plane,
  TrendingUp
};

export default function IndustrySelector({ onSelect, selectedIndustry }) {
  const [industries, setIndustries] = useState([]);
  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIndustries();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = industries.filter(industry =>
        industry.industry_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        industry.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIndustries(filtered);
    } else {
      setFilteredIndustries(industries);
    }
  }, [searchTerm, industries]);

  const fetchIndustries = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/industry-templates`);
      const data = await response.json();
      setIndustries(data);
      setFilteredIndustries(data);
    } catch (error) {
      console.error('Error fetching industries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFitScoreColor = (score) => {
    if (score >= 95) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 85) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-orange-600 bg-orange-50 border-orange-200";
  };

  const getFitScoreLabel = (score) => {
    if (score >= 95) return "Excellent Fit";
    if (score >= 85) return "Strong Fit";
    if (score >= 70) return "Good Fit";
    return "Configurable";
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search industries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline" className="whitespace-nowrap">
          {filteredIndustries.length} Industries
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIndustries.map((industry, index) => {
          const IconComponent = iconMap[industry.icon] || TrendingUp;
          const isSelected = selectedIndustry?.id === industry.id;

          return (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onSelect(industry)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="p-3 rounded-lg"
                      style={{
                        backgroundColor: `${industry.color_scheme?.primary}15`,
                        color: industry.color_scheme?.primary
                      }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {isSelected && (
                      <div className="bg-primary text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg">{industry.industry_name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {industry.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getFitScoreColor(industry.fit_score)}>
                        {industry.fit_score}% Match
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {getFitScoreLabel(industry.fit_score)}
                    </span>
                  </div>
                  
                  {industry.recommended_integrations?.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-1">Popular Integrations:</p>
                      <div className="flex flex-wrap gap-1">
                        {industry.recommended_integrations.slice(0, 3).map((integration) => (
                          <Badge key={integration} variant="secondary" className="text-xs">
                            {integration}
                          </Badge>
                        ))}
                        {industry.recommended_integrations.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{industry.recommended_integrations.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredIndustries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No industries found matching "{searchTerm}"</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setSearchTerm("")}
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}
