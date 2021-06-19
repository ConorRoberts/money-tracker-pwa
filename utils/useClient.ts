import { useQuery, gql } from "@apollo/client"
import { useSession } from "next-auth/client";

const GET_USER_DATA = gql`
  query getUserData($id: String!,$first:Int,$last:Int) {
    get_client(id: $id,first:$first,last:$last) {
      id
      transactions {
        id
        note
        category
        amount
        created_at
        taxable
        type
        subcategory
      }
    }
  }
`;

export default function useClient({ first, last }) {
  const [session, _loading] = useSession();

  return useQuery(GET_USER_DATA, {
    variables: { id: session?.user.id, first, last },
    pollInterval: 2500,
  });
};
