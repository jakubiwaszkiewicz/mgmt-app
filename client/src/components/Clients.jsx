import { useQuery } from '@apollo/client'
import ClientRow from './ClientRow'
import GET_CLIENTS from './queries/getClients'
import Spinner from './Spinner'

// GET_CLIENTS is a GraphQL query that will be sent to the server, the same way as in GraphiQL localhost:5000/graphql



export default function Clients() {
    // useQuery is a hook that will send the query to the server and return the response
    const { loading, error, data } = useQuery(GET_CLIENTS)

    if (loading) return <Spinner />
    if (error) return <p>Error :(</p>


    return (
        <>
            {!loading && !error && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.clients.map(client => (
                            <ClientRow key={client.id} client={client} />
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}
