import React, { Fragment } from 'react';
import { useQuery } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';
import { gql } from '@apollo/client';
import { Loading, Header, LaunchTile } from '../components';
import { LAUNCH_TILE_DATA } from './launches';

const GET_MY_TRIPS = gql`
  query GetMyTrips {
    me {
      id
      email
      trips {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;
interface ProfileProps extends RouteComponentProps {}
type Launch = {
  id: Number;
  site: String;
  mission: Mission;
  rocket: Rocket;
  isBooked: Boolean;
};
type LaunchConnection = {
  cursor: String;
  hasMore: Boolean;
  launches: [Launch];
};
type Mission = {
  missionPatch(mission: String, size: PatchSize): String;
};
type Mutation = {
  bookTrips(launchIds: [Number]): TripUpdateResponse;
  cancelTrip(launchId: Number): TripUpdateResponse;
  login(email: String): String;
};
enum PatchSize {
  SMALL,
  LARGE,
}
type Query = {
  launches(pageSize: Number, after: String): LaunchConnection;
  launch(id: Number): Launch;
  me: User;
};
type Rocket = {
  id: Number;
  name: String;
  type: String;
};
type TripUpdateResponse = {
  success: Boolean;
  message: String;
  launches: [Launch];
};
type User = {
  id: Number;
  email: String;
  trips: [Launch];
};
const Profile: React.FC<ProfileProps> = () => {
  const { data, loading, error } = useQuery(GET_MY_TRIPS, {
    fetchPolicy: 'network-only',
  });

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <Fragment>
      <Header>My Trips</Header>
      {data.me && data.me.trips.length ? (
        data.me.trips.map((launch:Launch) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))
      ) : (
        <p>You haven't booked any trips</p>
      )}
    </Fragment>
  );
}

export default Profile;