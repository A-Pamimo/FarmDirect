import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ImpactCounters } from '@harvestlink/shared';
import { getApiBaseUrl } from '../lib/env';

export const useImpact = () => {
  return useQuery<ImpactCounters>({
    queryKey: ['impact'],
    queryFn: async () => {
      const { data } = await axios.get<ImpactCounters>(`${getApiBaseUrl()}/impact`);
      return data;
    },
    refetchInterval: 2000,
  });
};
