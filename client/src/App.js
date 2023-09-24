import Clients from './components/Clients';
import Header from './components/Header';

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

// Apollo Client Setup which is used to connect to the GraphQL Server cache is used to store the data in the client side
const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache()
});

function App() {
  return (
    <>
      {/* The ApolloProvider is similar to the Context Provider, it wraps the entire application and allows us to access the data from anywhere in the application */}
      <ApolloProvider client={client}>
        <Header/>
        <div className='container'>
          <Clients />
        </div>
      </ApolloProvider>
    </>
  );
}

export default App;
