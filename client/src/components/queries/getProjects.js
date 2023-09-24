import { gql } from '@apollo/client';

const GET_PROJECTS = gql`
    query getProjects {
         projects {
            name
            description
            client {
                name
            }
         }

    }
`
export default GET_PROJECTS;