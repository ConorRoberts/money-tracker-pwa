import { useQuery, gql } from "@apollo/client"
import { useSession } from "next-auth/client";

const GET_USER_DATA = gql`
  query getUserData($id: String!,$first:Int,$last:Int) {
    get_client(id: $id,first:$first,last:$last) {
      transactions {
        id
        note
        category
        amount
        created_at
        taxable
        type
      }
    }
  }
`;

export default function useClient({ first, last }) {
  const [session, _] = useSession();

  const { data, refetch } = useQuery(GET_USER_DATA, {
    variables: { id: session?.user.id ?? " ", first, last },
  });

  return [data, refetch];
};
