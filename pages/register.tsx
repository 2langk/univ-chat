import { NextPage } from 'next';
import { Formik, Form, useField } from 'formik';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import useSWR from 'swr';
import { useState } from 'react';
import * as Yup from 'yup';
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

const RegisterPage: NextPage = () => {
	const { data: currentUser } = useSWR('/api/auth/me');
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

	if (currentUser) {
		router.push('/chatspace');
	}
	return (
		<>
			<Meta title="Signup" />
			<VStack w="4xl" mx="auto" py="10">
				<Heading size="4xl" my="10" mx="auto">
					Sign up
				</Heading>
				{/* Form */}
				<Formik
					initialValues={{
						name: '',
						email: '',
						university: '',
						password: '',
						passwordCheck: ''
					}}
					validationSchema={Yup.object({
						email: Yup.string().email().required('이메일을 입력하세요.'),
						password: Yup.string().required('비밀번호를 입력하세요'),
						passwordCheck: Yup.string().oneOf([Yup.ref('password'), null], '비밀번호를 확인하세요.')
					})}
					onSubmit={(values, { setSubmitting, resetForm }) => {
						setSubmitting(true);

						axios
							.post('/api/auth/register', {
								name: values.name,
								email: values.email,
								university: values.university,
								password: values.password,
								passwordCheck: values.passwordCheck
							})
							.then((res) => {
								if (res.status === 200) {
									router.push('/login');
								}
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
						<TextInput label="이름" name="name" id="name" type="text" placeholder="이름" />
						<TextInput label="Email" name="email" id="email" type="text" placeholder="email@email.com" />
						<TextInput label="대학교" name="university" id="university" type="text" placeholder="이름" />
						<TextInput
							label="Password"
							name="password"
							id="password"
							type="password"
							placeholder="비밀번호를 입력하세요."
						/>
						<TextInput
							label="Password 확인"
							name="passwordCheck"
							id="passwordCheck"
							type="password"
							placeholder="비밀번호를 다시 입력하세요."
						/>
						<Flex justify="space-between">
							<Text>이미 계정이 있다면?</Text>
							<Link href="/login">
								<Text cursor="pointer" color="blue.400" _hover={{ color: 'blue.200' }}>
									로그인
								</Text>
							</Link>
						</Flex>

						<Button mt="4" type="submit" colorScheme="messenger" w="100%" p="4">
							Create Account
						</Button>
						{isError && (
							<Alert status="error" mt="4" rounded="md">
								<AlertIcon />
								에러: 이메일이 존재합니다!
							</Alert>
						)}
					</Form>
				</Formik>
			</VStack>
		</>
	);
};

export default RegisterPage;
