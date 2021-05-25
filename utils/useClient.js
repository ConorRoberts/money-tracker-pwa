import { useQuery, gql } from "@apollo/client"
import { useSession } from "next-auth/client";

const GET_USER_DATA = gql`
  query getUserData($id: String!) {
    get_client(id: $id) {
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

export default function useClient() {
    const [session, _] = useSession();

    const { data } = useQuery(GET_USER_DATA, {
        variables: { id: session?.user.id ?? " " },
    });

    return data;
};
