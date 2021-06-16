import { useQuery, gql } from "@apollo/client"
import { useSession } from "next-auth/client";

const GET_USER_DATA = gql`
  query getUserData($id: String!) {
    get_client_categories(id: $id)
  }
`;

export default function useClientCategories() {
    const [session, _] = useSession();

    const { data, refetch } = useQuery(GET_USER_DATA, {
        variables: { id: session?.user.id ?? " " },
    });

    return [data, refetch];
};
