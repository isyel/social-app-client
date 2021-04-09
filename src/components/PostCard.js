import React, { useContext } from "react";
import { Button, Card, Icon, Image, Label } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import PopUpUtil from "../util/PopUpUtil";

function PostCard({
	post: {
		body,
		createdAt,
		id,
		username,
		likesCount,
		likes,
		comments,
		commentsCount,
	},
}) {
	const { user } = useContext(AuthContext);

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated="right"
					size="mini"
					src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
				/>
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>
					{moment(createdAt).fromNow(true)}
				</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton post={{ id, likes, likesCount }} user={user} />
				<PopUpUtil content={"Comment on post"}>
					<Button labelPosition="right" as={Link} to={`/posts/${id}`}>
						<Button color="blue" basic>
							<Icon name="comments" />
						</Button>
						<Label basic color="blue" pointing="left">
							{commentsCount}
						</Label>
					</Button>
				</PopUpUtil>
				{user && user.username === username && <DeleteButton postId={id} />}
			</Card.Content>
		</Card>
	);
}

export default PostCard;
