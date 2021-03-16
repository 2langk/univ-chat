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

const SettingPage: NextPage = () => {
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

	if (!user) {
		router.push('/login');
	}

	return (
		<>
			<Meta title="setting" />
			setting
		</>
	);
};

export default SettingPage;
