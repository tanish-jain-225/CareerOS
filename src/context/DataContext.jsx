'use client';

import React, { createContext, useContext } from 'react';
import { useCollection, useUserDoc } from '@/hooks/useDatabase';

const DataContext = createContext({});

const PROFILE_DEFAULT = {
  name: 'New Operator',
  title: 'Awaiting Assignment',
  mission: '',
};

export function DataProvider({ children }) {
  const jobs = useCollection('jobs');
  const outreach = useCollection('outreach');
  const profile = useUserDoc('profiles', PROFILE_DEFAULT);

  const value = React.useMemo(
    () => ({
      jobs,
      outreach,
      profile,
    }),
    [jobs, outreach, profile]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
