import { useState, useEffect } from 'react';
import BoardSDK from '@api/BoardSDK';

const board = new BoardSDK();

// Pure function to calculate metrics from opportunities array
export const calculateMetrics = (opportunities) => {
  // Compute stage breakdown client-side
  const stageBreakdown = opportunities.reduce((acc, opp) => {
    const groupId = opp.group?.id;
    const groupTitle = opp.group?.title;
    if (!groupId) return acc;

    const existing = acc.find(s => s.group?.id === groupId);
    if (existing) {
      existing.count += 1;
      existing.value += opp.dealAmount || 0;
    } else {
      acc.push({
        group: { id: groupId, title: groupTitle },
        count: 1,
        value: opp.dealAmount || 0,
      });
    }
    return acc;
  }, []);

  // Compute conversion breakdown
  const conversionBreakdown = opportunities.reduce((acc, opp) => {
    const conv = opp.conversionChance;
    if (!conv) return acc;

    const existing = acc.find(c => c.conversionChance === conv);
    if (existing) {
      existing.count += 1;
      existing.value += opp.dealAmount || 0;
    } else {
      acc.push({
        conversionChance: conv,
        count: 1,
        value: opp.dealAmount || 0,
      });
    }
    return acc;
  }, []);

  // Calculate totals
  const dealsWithValue = opportunities.filter(o => o.dealAmount).length;
  const totalValue = opportunities.reduce((sum, o) => sum + (o.dealAmount || 0), 0);
  const avgDealSize = dealsWithValue > 0 ? totalValue / dealsWithValue : 0;

  return {
    totalOpportunities: opportunities.length,
    totalPipelineValue: totalValue,
    averageDealSize: avgDealSize,
    dealsWithValue: dealsWithValue,
    byStage: stageBreakdown,
    byConversion: conversionBreakdown,
  };
};

export const useSalesData = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all opportunities with pagination
      const allOpportunities = [];
      let cursor = null;
      
      do {
        const result = await board.items()
          .withColumns([
            'status', 'conversionChance', 'dealAmount', 'company', 'region',
            'salesTeam', 'sdm', 'complexity', 'type', 'dateAdded', 'lastUpdatedOn',
            'healthStatus', 'aiType', 'dealType', 'timeline',
            'engagementDescription', 'poc', 'transactionType', 'pricedMargins',
            'deliveredMargins', 'team', 'annotationType'
          ])
          .withPagination(cursor ? { cursor } : { limit: 100 })
          .execute();
        
        allOpportunities.push(...result.items);
        cursor = result.cursor;
      } while (cursor);

      setOpportunities(allOpportunities);

      // Calculate metrics from fetched opportunities
      const calculatedMetrics = calculateMetrics(allOpportunities);
      setMetrics(calculatedMetrics);

    } catch (err) {
      console.error('Failed to fetch sales data:', err);
      setError('Failed to load sales data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    opportunities,
    metrics,
    loading,
    error,
    refetch: fetchData,
  };
};
