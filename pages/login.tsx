import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import useSWR from 'swr';
import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
	Text,
	VStack
} from '@chakra-ui/react';
import Meta from '../components/Meta';

const LoginPage: NextPage = () => {
	const { data: user, mutate: setUser } = useSWR('/api/auth/me');
	const [isError, setIsError] = useState(false);

	const router = useRouter();

	const TextInput = ({ label, ...props }: any) => {
		const [field, meta] = useField(props);

		return (
			<Box mb="16" h="10" w="96">
				<FormControl isInvalid={!!meta.error && !!meta.touched}>
					<FormLabel htmlFor={label}>{label}</FormLabel>
					{/* eslint-disable-next-line react/jsx-props-no-spreading */}
					<Input {...field} {...props} />
					<FormErrorMessage>유효하지 않은 {label} 입니다.</FormErrorMessage>
				</FormControl>
			</Box>
		);
	};

	if (user) {
		router.push('/chatspace');
	}

	return (
		<>
			<Meta title="Signin" />
			<VStack w="4xl" mx="auto" py="10">
				<Heading size="4xl" my="10" mx="auto">
					Sign in
				</Heading>
				{/* Form */}
				<Formik
					initialValues={{
						email: '',
						password: ''
					}}
					validationSchema={Yup.object({
						email: Yup.string().email().required('이메일을 입력하세요.'),
						password: Yup.string().required('비밀번호를 입력하세요.')
					})}
					onSubmit={async (values, { setSubmitting, resetForm }) => {
						setSubmitting(true);

						axios
							.post('/api/auth/login', {
								email: values.email,
								password: values.password
							})
							.then((res) => {
								setUser(res.data.user, false);
							})
							.catch(() => {
								setIsError(true);
							})
							.finally(() => {
								resetForm();
								setSubmitting(false);
							});
					}}
				>
					<Form>
						<TextInput label="Email" name="email" id="email" type="text" placeholder="email@email.com" />
						<TextInput
							label="Password"
							name="password"
							id="password"
							type="password"
							placeholder="비밀번호를 입력하세요."
						/>
						<Flex justify="space-between">
							<Text>아직 계정이 없다면?</Text>
							<Link href="register">
								<Text cursor="pointer" color="blue.400" _hover={{ color: 'blue.200' }}>
									회원가입
								</Text>
							</Link>
						</Flex>

						<Button mt="4" type="submit" colorScheme="messenger" w="100%" p="4">
							Login
						</Button>
						{isError && (
							<Alert status="error" mt="4" rounded="md">
								<AlertIcon />
								Error: 로그인에 실패했습니다. 다시 시도해주세요.
							</Alert>
						)}
					</Form>
				</Formik>
			</VStack>
		</>
	);
};

export default LoginPage;
