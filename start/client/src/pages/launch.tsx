import React, { Fragment } from 'react';
import { useQuery } from '@apollo/client';
import { RouteComponentProps } from '@reach/router';
import { gql } from '@apollo/client';
import { Loading, Header, LaunchDetail } from '../components';
import { ActionButton } from '../containers';
import { LAUNCH_TILE_DATA } from './launches';

interface LaunchProps extends RouteComponentProps {}
export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      site
      rocket {
        name
      }
      ...LaunchTile
    }
  }
  ${LAUNCH_TILE_DATA}
`;
const Launch: React.FC<LaunchProps> = () => {
  const { data, loading, error } = useQuery(GET_LAUNCH_DETAILS, {
    variables: { launchId:1 },
  });
  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
    <Fragment>
      <Header image={data.launch.mission.missionPatch}>
        {data.launch.mission.name}
      </Header>
      <LaunchDetail {...data.launch} />
      <ActionButton {...data.launch} />
    </Fragment>
  );
};

export default Launch;
