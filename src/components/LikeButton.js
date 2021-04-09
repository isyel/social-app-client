import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Label } from "semantic-ui-react";
import PopUpUtil from "../util/PopUpUtil";

function LikeButton({ user, post: { id, likes, likesCount } }) {
	const [liked, setLiked] = useState(false);
	useEffect(() => {
		if (user && likes?.find((like) => like.username === user.username)) {
			setLiked(true);
		} else setLiked(false);
	}, [user, likes]);

	const [likePost] = useMutation(LIKE_POST_MUTATION, {
		variables: {
			postId: id,
		},
	});

	const likeButton = user ? (
		liked ? (
			<Button color="teal">
				<Icon name="heart" />
			</Button>
		) : (
			<Button color="teal" basic>
				<Icon name="heart" />
			</Button>
		)
	) : (
		<Button as={Link} to="/login" color="teal" basic>
			<Icon name="heart" />
		</Button>
	);

	return (
		<Button as="div" labelPosition="right" onClick={likePost}>
			<PopUpUtil content={liked ? "Unlike" : "Like"}>{likeButton}</PopUpUtil>
			<Label basic color="teal" pointing="left">
				{likesCount}
			</Label>
		</Button>
	);
}

const LIKE_POST_MUTATION = gql`
	mutation likePost($postId: ID!) {
		likePost(postId: $postId) {
			id
			likes {
				id
				username
			}
			likesCount
		}
	}
`;

export default LikeButton;
