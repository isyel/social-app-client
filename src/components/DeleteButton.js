import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, Icon, Confirm, Popup } from "semantic-ui-react";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import PopUpUtil from "../util/PopUpUtil";

function DeleteButton({ postId, commentId, callback }) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

	const [deletePostOrComment] = useMutation(mutation, {
		variables: { postId, commentId },
		update(proxy) {
			setConfirmOpen(false);
			// remove post from cache
			if (!commentId) {
				console.log("Deleting post");
				const data = proxy.readQuery({
					query: FETCH_POSTS_QUERY,
				});
				const getPosts = data.getPosts.filter((p) => p.id !== postId);
				proxy.writeQuery({
					query: FETCH_POSTS_QUERY,
					data: {
						getPosts,
					},
				});
			}
			if (callback) callback();
		},
	});

	return (
		<>
			<PopUpUtil content={commentId ? "Delete comment" : "Delete post"}>
				<Button
					as="div"
					color="red"
					floated="right"
					onClick={() => setConfirmOpen(true)}>
					<Icon name="trash" style={{ margin: 0 }} />
				</Button>
			</PopUpUtil>
			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrComment}
			/>
		</>
	);
}

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($commentId: ID!, $postId: ID!) {
		deleteComment(commentId: $commentId, postId: $postId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentsCount
		}
	}
`;

export default DeleteButton;
