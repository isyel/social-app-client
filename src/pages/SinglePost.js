import { gql, useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import React, { useContext, useRef, useState } from "react";
import {
	Button,
	Card,
	Form,
	Grid,
	Icon,
	Image,
	Label,
} from "semantic-ui-react";
import DeleteButton from "../components/DeleteButton";
import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import PopUpUtil from "../util/PopUpUtil";

function SinglePost(props) {
	const postId = props.match.params.postId;
	const { user } = useContext(AuthContext);
	const [comment, setComment] = useState("");
	const formInputRef = useRef(null);

	const { data } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});

	function deletePostCallback() {
		props.history.push("/");
	}

	const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
		variables: { postId, body: comment },
		update() {
			setComment("");
			formInputRef.current.blur();
		},
	});

	let postMarkup;
	if (!data?.getPost) {
		postMarkup = <p>Loading Post...</p>;
	} else {
		const {
			id,
			username,
			body,
			createdAt,
			comments,
			commentsCount,
			likes,
			likesCount,
		} = data.getPost;

		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}>
						<Image
							floated="right"
							size="small"
							src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
						/>
					</Grid.Column>
					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</Card.Content>
							<hr />
							<Card.Content extra>
								<LikeButton post={{ id, likes, likesCount }} user={user} />
								<PopUpUtil content="Comment on post">
									<Button
										as="div"
										labelPosition="right"
										onClick={() => formInputRef.current.focus()}>
										<Button color="blue" basic>
											<Icon name="comments" />
										</Button>
										<Label basic color="blue" pointing="left">
											{commentsCount}
										</Label>
									</Button>
								</PopUpUtil>
								{user && user.username === username && (
									<DeleteButton postId={id} callback={deletePostCallback} />
								)}
							</Card.Content>
						</Card>
						{user && (
							<Card fluid>
								<Card.Content>
									<p>Post a comment:</p>
									<Form>
										<div className="ui action input fluid">
											<input
												name="comment"
												placeholder="comment.."
												value={comment}
												onChange={(event) => setComment(event.target.value)}
												ref={formInputRef}
											/>
											<button
												type="submit"
												className="ui button teal"
												disabled={comment.trim() === ""}
												onClick={submitComment}>
												Comment
											</button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}
						{comments.map((comment) => (
							<Card fluid key={comment.id}>
								<Card.Content>
									{user && user.username === comment.username && (
										<DeleteButton postId={postId} commentId={comment.id} />
									)}
									<Card.Header>{comment.username}</Card.Header>
									<Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
									<Card.Description>{comment.body}</Card.Description>
								</Card.Content>
							</Card>
						))}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
	return postMarkup;
}

const FETCH_POST_QUERY = gql`
	query($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			username
			commentsCount
			comments {
				id
				body
				username
				createdAt
			}
			likesCount
			likes {
				username
			}
		}
	}
`;

const SUBMIT_COMMENT_MUTATION = gql`
	mutation($postId: ID!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments {
				id
				body
				createdAt
				username
			}
			commentsCount
		}
	}
`;

export default SinglePost;
