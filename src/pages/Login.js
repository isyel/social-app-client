import { gql, useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import useForm from "../util/hooks";

function Login(props) {
	const context = useContext(AuthContext);
	const [errors, setErrors] = useState({});

	const { onChange, onSubmit, values } = useForm(loginUserCallback, {
		username: "",
		password: "",
	});

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		update(_, { data: { login: userData } }) {
			context.login(userData);
			props.history.push("/");
		},
		onError(error) {
			console.log(
				"Errors: ",
				error.graphQLErrors[0]?.extensions.exception.errors
			);
			setErrors(error.graphQLErrors[0]?.extensions.exception.errors);
		},
		variables: values,
	});

	function loginUserCallback() {
		loginUser();
	}

	return (
		<div className="form-container">
			<Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
				<h1>Login</h1>
				<Form.Input
					label="Username"
					placeholder="Username"
					name="username"
					value={values.username}
					error={errors?.username ? true : false}
					onChange={onChange}
				/>
				<Form.Input
					label="Password"
					placeholder="Password"
					name="password"
					value={values.password}
					type="password"
					error={errors?.password ? true : false}
					onChange={onChange}
				/>
				<Button type="submit" primary>
					Login
				</Button>
			</Form>
			{Object.keys(errors).length > 0 && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors).map((value) => (
							<li key={value}>{value}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Login;
