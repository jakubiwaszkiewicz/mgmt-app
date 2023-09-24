import { FaTrash } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { DELETE_CLIENT } from '../mutations/clientMutations';

export default function ClientRow( {client}) {
    // useMutation is a hook that will send the mutation to the server and return the response
    const [deleteClient, { loading, error }] = useMutation(DELETE_CLIENT, {
        // variables is an object that will be sent to the server which allows us to pass arguments to the mutation
        variables: {
            // id is the argument of the mutation which allows us to identify which client will be deleted
            id: client.id
        },
        // refetchQueries is an array of queries that will be sent to the server after the mutation is completed
        refetchQueries: ['GET_CLIENTS']
    });

  return (
    <tr>
        <td>{ client.name }</td>
        <td>{ client.email }</td>
        <td>{ client.email }</td>
        <td>
            <button className="btn btn-danger btn-sm" onClick={deleteClient}>
                <FaTrash />
            </button>
        </td>
    </tr>
  )
}
