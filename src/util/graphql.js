import { gql } from "@apollo/client";

export const FETCH_POSTS_QUERY = gql`
	{
		getPosts {
			id
			body
			username
			likesCount
			likes {
				username
			}
			commentsCount
			comments {
				id
				username
				createdAt
				body
			}
			createdAt
		}
	}
`;
