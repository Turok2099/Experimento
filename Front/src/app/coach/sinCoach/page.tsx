'use client';

import Disponibles from '@/views/sinCoach/SinCoach';
import React from 'react';
import { ClasesProvider } from '@/context/ClasesContext';

const SinCoach = () => {
  return (
    <ClasesProvider>
      <Disponibles />
    </ClasesProvider>
  );
};

export default SinCoach;
