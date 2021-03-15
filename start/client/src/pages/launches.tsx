import React, { Fragment } from 'react';
import { useQuery } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';
import { gql } from '@apollo/client';
import { Header, LaunchTile, Button, Loading } from '../components';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      missionPatch
    }
  }
`;
const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchesProps extends RouteComponentProps {}

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
const Launches: React.FC<LaunchesProps> = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_LAUNCHES);
  if (loading) return <Loading />;
  if (error) {
    console.log(error);
    return <p>ERROR</p>;
  }
  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map((launch: Launch) => (
          <LaunchTile key={launch.id} launch={launch} />
        ))}
      {data.launches && data.launches.hasMore && (
        <Button
          onClick={() => {
            console.log(data);
            fetchMore({
              variables: {
                after: data.launches.cursor,
              },
              updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                if (!fetchMoreResult) return prev;
                return {
                  ...fetchMoreResult,
                  launches: {
                    ...fetchMoreResult.launches,
                    launches: [
                      ...prev.launches.launches,
                      ...fetchMoreResult.launches.launches,
                    ],
                  },
                };
              },
            });
          }}
        >
          Load More
        </Button>
      )}
    </Fragment>
  );
};

export default Launches;
