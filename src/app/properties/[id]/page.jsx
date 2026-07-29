'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import PropertyDetails from '../../../views/public/PropertyDetails';

export default function PropertyDetailsPage() {
  const params = useParams();
  const id = params?.id;

  return <PropertyDetails idOverride={id} />;
}
