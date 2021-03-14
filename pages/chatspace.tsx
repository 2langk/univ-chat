import {
	Box,
	HStack,
	VStack,
	Input,
	Heading,
	Flex,
	Text,
	Avatar,
	Button,
	RadioGroup,
	Radio,
	Textarea
} from '@chakra-ui/react';
import { SearchIcon, UnlockIcon } from '@chakra-ui/icons';
import { NextPage } from 'next';
import useSWR from 'swr';
import Link from 'next/link';
import ChatRoomCard from '../components/ChatRoomCard';
import Meta from '../components/Meta';

const ChatPage: NextPage = () => {
	const { data: user } = useSWR('/api/auth/me');

	if (!user) {
		return (
			<VStack>
				<Heading>로그인이 필요한 서비스입니다.</Heading>
				<Link href="/login">
					<Text cursor="pointer" color="blue.400" _hover={{ color: 'blue.200' }}>
						로그인
					</Text>
				</Link>
			</VStack>
		);
	}

	return (
		<HStack>
			<Meta title="chat space" />
			{/* 사이드 아이콘 */}
			<VStack w="24" h="100vh" bgColor="blue.100" justify="flex-end" spacing="8" pb="4">
				<UnlockIcon w="8" h="8" position="absolute" top="0" my="4" />

				<UnlockIcon w="8" h="8" />
				<UnlockIcon w="8" h="8" />
				<UnlockIcon w="8" h="8" />
			</VStack>

			{/* 채팅방 검색 */}
			<VStack w="xl" h="100vh" bgColor="red.100" p="4" spacing="4" display={{ base: 'none', xl: 'flex' }}>
				<Heading as="h3" size="lg">
					채팅방 검색
				</Heading>
				<Flex alignItems="center">
					<SearchIcon mr="2" w="8" h="8" />
					<Input placeholder="large size" size="lg" />
				</Flex>
				<RadioGroup mb="2">
					<HStack spacing="2">
						<Radio value="1" cursor="pointer" defaultChecked>
							전체
						</Radio>
						<Radio value="2" cursor="pointer">
							우리 학교만
						</Radio>
					</HStack>
				</RadioGroup>

				{/* 채팅방 검색 리스트 */}
				<VStack w="100%" alignItems="flex-start" spacing="4" overflowY="scroll">
					{[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((i) => (
						<ChatRoomCard />
					))}
				</VStack>
			</VStack>

			{/* 참여중인 채팅방 */}
			<VStack w="xl" h="100vh" bgColor="green.100" p="4" spacing="4" display={{ base: 'none', md: 'flex' }}>
				<Heading as="h3" size="lg">
					참여중인 채팅
				</Heading>
				<Flex alignItems="center">
					<SearchIcon mr="2" w="8" h="8" />
					<Input placeholder="large size" size="lg" />
				</Flex>

				<RadioGroup mb="2">
					<HStack spacing="2">
						<Radio value="1" cursor="pointer" defaultChecked>
							전체
						</Radio>
						<Radio value="2" cursor="pointer">
							우리 학교만
						</Radio>
					</HStack>
				</RadioGroup>

				{/* 참여중인 채팅방 리스트 */}
				<VStack w="100%" alignItems="flex-start" spacing="4" overflowY="scroll">
					{[1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, 1, 1].map((i) => (
						<ChatRoomCard />
					))}
				</VStack>
			</VStack>

			{/* 채팅화면 */}
			<Flex direction="column" w="100%" h="100vh" bgColor="blue.100" p="4">
				<Heading as="h3" size="lg" position="fixed">
					채팅방 이름
				</Heading>
				<VStack mt="16" spacing="4" alignItems="flex-start" overflowY="scroll">
					{[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((i) => (
						<Flex border="1px" borderColor="gray.800" rounded="xl" p="4" alignItems="center">
							<Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" h="16" w="16" />
							<Flex direction="column">
								<HStack>
									<Text ml="2">이름</Text>
									<Text>11:20</Text>
								</HStack>
								<Box>
									<Text m="2">메시지 메시지 메시지 메시지 메시지</Text>
								</Box>
							</Flex>
						</Flex>
					))}
				</VStack>
				<Flex w="100%" alignItems="center" mt="4">
					<Textarea placeholder="Here is a sample placeholder" resize="none" />
					<Button colorScheme="blue" h="20" p="4">
						Button
					</Button>
				</Flex>
			</Flex>

			{/* 채팅방 정보 및 인원 */}
			<VStack w="md" h="100vh" bgColor="orange.100" display={{ base: 'none', md: 'flex' }}>
				<Heading as="h5" size="md" p="4">
					채팅방 인원
				</Heading>
				<VStack overflowY="scroll" h="60%" w="100%">
					{[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((i) => (
						<Flex alignItems="center" cursor="pointer" _hover={{ bgColor: 'gray.600' }}>
							<Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
							<Text mx="2">이름이</Text>
						</Flex>
					))}
				</VStack>
				<Flex direction="column" position="absolute" bottom="0" mb="5">
					<Heading as="h5" size="md" mb="2">
						프로필
					</Heading>
					<Flex direction="column">
						<Text my="2">이메일: test@test.com</Text>
						<Text my="2">이름: 이름</Text>
						<Text my="2">학교: 대학교이름</Text>
						<Text my="2">학번: 20학번</Text>
					</Flex>
				</Flex>
			</VStack>
		</HStack>
	);
};

export default ChatPage;
