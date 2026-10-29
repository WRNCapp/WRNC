import React from 'react';
import { Image, View } from 'react-native';
import { useVehiclePhotoUrl } from '../../hooks/useVehiclePhotos';

export interface VehicleHeroPhotoProps {
  coverPhotoPath: string | null | undefined;
  /** Rounds only the top corners when the photo caps a card. */
  capsCard?: boolean;
}

/** Read-only vehicle cover photo; renders nothing until a photo exists. */
export function VehicleHeroPhoto({ coverPhotoPath, capsCard = false }: VehicleHeroPhotoProps) {
  const { data: signedUrl } = useVehiclePhotoUrl(coverPhotoPath);

  if (!coverPhotoPath) return null;

  return (
    <View
      testID="vehicle-hero-photo"
      className={`overflow-hidden bg-wrnc-surface-elevated ${capsCard ? 'rounded-t-xl' : 'rounded-xl'}`}
      style={{ aspectRatio: 16 / 9, width: '100%' }}
    >
      {signedUrl ? (
        <Image
          accessibilityIgnoresInvertColors
          accessibilityLabel="Vehicle photo"
          resizeMode="cover"
          source={{ uri: signedUrl }}
          style={{ height: '100%', width: '100%' }}
        />
      ) : null}
    </View>
  );
}
