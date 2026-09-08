import React from 'react';
import { Redirect } from 'expo-router';

/** Native fallback for the root route; web resolves to index.web.tsx. */
export default function MissionControlScreen() {
  // The protected route owns session checks and the query provider.
  return <Redirect href="/workspace" />;
}
