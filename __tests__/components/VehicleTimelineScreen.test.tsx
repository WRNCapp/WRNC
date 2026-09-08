import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { VehicleTimelineScreen } from '../../components/workspace/VehicleTimelineScreen';
import type { Activity } from '../../types/activity';
import type { Vehicle } from '../../types/vehicle';

const vehicle: Vehicle = {
  id: 'veh-1',
  workspaceId: 'ws-1',
  vin: '12345678901234567',
  year: 1998,
  make: 'Honda',
  model: 'Civic',
  trim: 'EX',
  nickname: 'Bluebird',
  engine: '2.0L',
  transmission: 'Manual',
  mileage: 120000,
  coverPhotoUrl: null,
  archivedAt: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const activities: Activity[] = [
  {
    id: 'act-1',
    vehicleId: 'veh-1',
    userId: 'user-1',
    activityType: 'Maintenance',
    title: 'Brake Service',
    description: 'Replaced pads and flushed fluid.',
    activityDate: '2026-08-01',
    createdAt: '2026-08-01T18:00:00.000Z',
    updatedAt: null,
    photos: [],
    attachments: [],
    metadata: { odometer: 125000, cost: 249.99 },
    archivedAt: null,
  },
  {
    id: 'act-2',
    vehicleId: 'veh-1',
    userId: 'user-1',
    activityType: 'Progress Update',
    title: 'Weekend Photos',
    description: 'Captured fresh shots after the wash.',
    activityDate: '2026-06-21',
    createdAt: '2026-06-21T17:00:00.000Z',
    updatedAt: null,
    photos: ['https://example.com/photo.jpg'],
    attachments: [],
    metadata: null,
    archivedAt: null,
  },
  {
    id: 'act-3',
    vehicleId: 'veh-1',
    userId: 'user-1',
    activityType: 'Maintenance',
    title: 'Archived Inspection',
    description: 'Historical inspection entry.',
    activityDate: '2026-07-15',
    createdAt: '2026-07-15T16:00:00.000Z',
    updatedAt: null,
    photos: [],
    attachments: [],
    metadata: null,
    archivedAt: '2026-07-16T00:00:00.000Z',
  },
];

describe('VehicleTimelineScreen', () => {
  it('renders an empty state with a create action when no activities exist', () => {
    const onCreateActivity = jest.fn();
    const onBuildPassport = jest.fn();
    const { getByText } = render(
      <VehicleTimelineScreen
        vehicle={vehicle}
        activities={[]}
        onBack={jest.fn()}
        onBuildPassport={onBuildPassport}
        onActivityPress={jest.fn()}
        onCreateActivity={onCreateActivity}
      />
    );

    expect(getByText('No activities yet')).toBeTruthy();
    fireEvent.press(getByText('Create Activity'));
    expect(onCreateActivity).toHaveBeenCalled();
    fireEvent.press(getByText('Build Passport'));
    expect(onBuildPassport).toHaveBeenCalled();
  });

  it('filters activities and opens selected entries', () => {
    const onActivityPress = jest.fn();
    const onCreateActivity = jest.fn();
    const { getAllByRole, getByText, getByLabelText, queryByText } = render(
      <VehicleTimelineScreen
        vehicle={vehicle}
        activities={activities}
        onBack={jest.fn()}
        onBuildPassport={jest.fn()}
        onActivityPress={onActivityPress}
        onCreateActivity={onCreateActivity}
      />
    );

    expect(getByText('Brake Service')).toBeTruthy();
    expect(getByText('Weekend Photos')).toBeTruthy();
    fireEvent.press(getByText('Add Activity'));
    expect(onCreateActivity).toHaveBeenCalled();

    const maintenanceButtons = getAllByRole('button', { name: 'Maintenance' });
    fireEvent.press(maintenanceButtons[0]);
    expect(queryByText('Weekend Photos')).toBeNull();
    expect(getByText('Brake Service')).toBeTruthy();
    expect(getByText('Archived Inspection')).toBeTruthy();

    const archivedButtons = getAllByRole('button', { name: 'Archived' });
    fireEvent.press(archivedButtons[0]);
    expect(queryByText('Brake Service')).toBeNull();
    expect(getByText('Archived Inspection')).toBeTruthy();

    fireEvent.changeText(getByLabelText('Start Date'), '2026-08-01');
    expect(queryByText('Archived Inspection')).toBeNull();
    expect(getByText('No activities yet')).toBeTruthy();

    fireEvent.changeText(getByLabelText('Start Date'), '');
    const allButtons = getAllByRole('button', { name: 'All' });
    fireEvent.press(allButtons[0]);
    fireEvent.press(allButtons[1]);

    fireEvent.press(getByText('Weekend Photos'));
    expect(onActivityPress).toHaveBeenCalledWith('act-2');
  });
});
