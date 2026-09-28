import React from 'react';
import Head from 'expo-router/head';
import { useLocalSearchParams } from 'expo-router';
import { PublicBuild } from '../../components/workspace/PublicBuild';

export default function SharedBuildWeb() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const shareToken = Array.isArray(token) ? token[0] : token;
  return <>
    <Head>
      <title>Shared Build Passport · WRNC</title>
      <meta name="description" content="Explore a vehicle build shared from WRNC Build Passport." />
      <meta name="robots" content="noindex, nofollow" />
      {shareToken ? <meta name="apple-itunes-app" content={`app-id=6791770564, app-argument=https://www.wrnc.app/build/${shareToken}`} /> : null}
    </Head>
    <PublicBuild />
  </>;
}
