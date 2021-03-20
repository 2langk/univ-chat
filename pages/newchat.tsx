import {
	Heading,
	VStack,
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Radio,
	RadioGroup,
	Button,
	Select,
	Text,
	useToast
} from '@chakra-ui/react';
import Link from 'next/link';
import axios from 'axios';
import { Formik, Form, useField } from 'formik';
import { NextPage } from 'next';
import * as Yup from 'yup';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import Meta from '../components/Meta';

const NewChatPage: NextPage = () => {
	const { data: currentUser } = useSWR('api/auth/me');

	const toast = useToast();
	const router = useRouter();

	const TextInput = ({ label, ...props }: any) => {
		const [field, meta] = useField(props);

		return (
			<FormControl my="10" isInvalid={!!meta.error && !!meta.touched}>
				<FormLabel htmlFor={label}>{label}</FormLabel>
				{/* eslint-disable-next-line  */}
				<Input {...field} {...props} type="text" />
				<FormErrorMessage>유효하지 않은 {label} 입니다.</FormErrorMessage>
			</FormControl>
		);
	};

	const SelectionInput = ({ label, children, ...props }: any) => {
		const [field, meta] = useField(props);

		return (
			<FormControl my="10" isInvalid={!!meta.error && !!meta.touched}>
				<FormLabel htmlFor={label}>{label}</FormLabel>
				{/* eslint-disable-next-line  */}
				<Select placeholder="Select option" {...field} {...props}>
					{children}
				</Select>
				<FormErrorMessage>유효하지 않은 {label} 입니다.</FormErrorMessage>
			</FormControl>
		);
	};

	const RadioInput = ({ label, ...props }: any) => {
		const [field] = useField(props);

		return (
			// eslint-disable-next-line react/jsx-props-no-spreading
			<Radio {...field} {...props} type="radio">
				{label}
			</Radio>
		);
	};

	if (!currentUser) {
		return (
			<VStack justify="center">
				<Heading>Loading....</Heading>
				<Text>로그인하지 않았다면?</Text>
				<Link href="/login">
					<Text cursor="pointer" color="blue.400" _hover={{ color: 'blue.200' }}>
						로그인
					</Text>
				</Link>
			</VStack>
		);
	}

	return (
		<>
			<Meta title="newChat" />
			<VStack mt="10" w="100%" maxWidth="3xl" mx="auto">
				<Heading>Create New Chat</Heading>
				<Formik
					initialValues={{
						name: '',
						description: '',
						category: '',
						university: 'all'
					}}
					validationSchema={Yup.object({
						name: Yup.string().required('채팅방 이름을 입력하세요.'),
						description: Yup.string().required('채팅방 소개를 입력하세요.'),
						category: Yup.string().required('카테고리를 입력하세요.'),
						university: Yup.string().required('채팅방의 범위을 입력하세요.')
					})}
					onSubmit={(values, { setSubmitting, resetForm }) => {
						setSubmitting(true);

						const { name, description, category, university } = values;

						axios
							.post('/api/chatroom', {
								name,
								description,
								category,
								university
							})
							.then((res) => {
								if (res.status === 200) {
									toast({
										title: `새로운 채팅방 ${name}을 생성했습니다.`,
										status: 'success',
										duration: 60 * 1000,
										isClosable: true
									});

									router.push('/chatspace');
								}
							})
							.catch(() => {
								alert('채팅방 생성 실패!');
							})
							.finally(() => {
								resetForm();
								setSubmitting(false);
							});
					}}
				>
					<Form>
						<TextInput label="채팅방 이름" name="name" id="name" placeholder="채팅방 이름" />
						<TextInput label="채팅방 소개" name="description" id="description" placeholder="채팅방 소개" />
						<SelectionInput label="카테고리" name="category" id="category" placeholder="카테고리">
							<option value="취업">취업</option>
							<option value="스터디">스터디</option>
							<option value="친목">친목</option>
							<option value="기타">기타</option>
						</SelectionInput>
						<RadioGroup display="flex" alignItems="center" justifyContent="space-between">
							<Text mx="4">공개 범위</Text>
							<RadioInput mx="4" cursor="pointer" label="전체" value="all" name="university" defaultChecked />
							<RadioInput
								mx="4"
								cursor="pointer"
								label="우리 학교만"
								value={currentUser.user.university}
								name="university"
							/>
						</RadioGroup>
						<Button mt="4" type="submit" colorScheme="messenger" w="100%" p="4">
							Create Chat Room
						</Button>
					</Form>
				</Formik>
			</VStack>
		</>
	);
};

export default NewChatPage;
