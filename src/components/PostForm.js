import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Button, Form } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import useForm from "../util/hooks";

function PostForm() {
	const { onSubmit, onChange, values } = useForm(createPostCallback, {
		body: "",
	});

	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		variables: values,
		update(proxy, result) {
			const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
			const getPosts = [result.data.createPost, ...data.getPosts];
			proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: { getPosts } });
			values.body = "";
		},
	});

	function createPostCallback() {
		createPost();
	}

	return (
		<>
			<Form onSubmit={onSubmit}>
				<h2>Create a post:</h2>
				<Form.Field>
					<Form.Input
						placeholder="Social App"
						name="body"
						onChange={onChange}
						values={values.body}
						error={error ? true : false}
					/>
					<Button type="submit" color="teal">
						Post
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message" style={{ marginBottom: 20 }}>
					<ul>
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</>
	);
}

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likesCount
			comments {
				id
				username
				body
				createdAt
			}
			commentsCount
		}
	}
`;

export default PostForm;
