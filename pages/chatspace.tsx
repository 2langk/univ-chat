import { AddIcon, SearchIcon, SettingsIcon, StarIcon } from '@chakra-ui/icons';
import {
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
	Textarea,
	useToast,
	IconButton
} from '@chakra-ui/react';
import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import useSWR from 'swr';
import MyRoomCard from '../components/MyRoomCard';
import ChatRoomCard from '../components/ChatRoomCard';
import Meta from '../components/Meta';
import ChatMessageCard from '../components/ChatMessageCard';
import LogoutModal from '../components/LogoutModal';
import ExitChatModal from '../components/ExitChatModal';

const socket: Socket = io('http://localhost:4000');

const ChatPage: NextPage<any> = ({ initAllRooms, initMyRooms }) => {
	const { data: currentUser } = useSWR('/api/auth/me');
	const { data: allRooms } = useSWR('/api/chatRoom', { initialData: initAllRooms });
	const { data: myRooms } = useSWR('/api/chatRoom/my', { initialData: initMyRooms });

	const [currentRoom, setCurrentRoom] = useState({ id: '', name: '', university: '' });
	const [currentRoomChats, setCurrentRoomChats] = useState<any>([]);
	const [currentRoomUsers, setCurrentRoomUsers] = useState<any>([]);

	const chatInputRef = useRef<HTMLTextAreaElement>(null);
	const chatBoxRef = useRef<HTMLDivElement>(null);
	const toast = useToast();

	useEffect(() => {
		socket.off('messageFromServer');
		socket.off('roomInfo');
		socket.off('newUserJoinFromServer');

		socket.on('roomInfo', ({ roomUsers, roomChats }) => {
			setCurrentRoomUsers(roomUsers);
			setCurrentRoomChats(roomChats);
			chatBoxRef.current!.scrollTop = chatBoxRef.current!.scrollHeight;
		});

		socket.on('messageFromServer', ({ newMessage }) => {
			if (newMessage.chatRoom === currentRoom.id) {
				setCurrentRoomChats((prev: any) => [...prev, newMessage]);
				chatBoxRef.current!.scrollTop = chatBoxRef.current!.scrollHeight;
			} else {
				toast({
					title: `${newMessage.chatRoom}에 새로운 메시지가 있습니다`,
					status: 'info',
					duration: 60 * 1000,
					isClosable: true
				});
			}
		});

		socket.on('newUserJoinFromServer', ({ user, roomId }) => {
			if (roomId === currentRoom.id) {
				setCurrentRoomUsers((prev: any) => [...prev, { user }]);
				toast({
					title: `새로운 유저가 입장했습니다`,
					status: 'info',
					duration: 60 * 1000,
					isClosable: true
				});
			}
		});
	}, [currentRoom, toast]);

	useEffect(() => {
		socket.emit('userLogin', { myRooms: myRooms.chatRooms });
	}, [myRooms.chatRooms]);

	const joinChatRoom = useCallback(({ id, name, university }) => {
		setCurrentRoom({ id, name, university });
		socket.emit('joinRoom', { roomId: id });
	}, []);

	const sendMessage = useCallback(
		(e) => {
			if ((e.code === 'Enter' && e.ctrlKey) || e.type === 'click') {
				e.preventDefault();
				const userId = currentUser.user.id;
				const roomId = currentRoom.id;
				const message = chatInputRef.current!.value;

				socket.emit('messageToServer', { userId, roomId, message });

				chatInputRef.current!.value = '';
				chatInputRef.current!.focus();
			}
		},
		[currentRoom, currentUser?.user?.id]
	);

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
		<HStack>
			<Meta title="chat space" />
			{/* -- 사이드 아이콘 */}
			<VStack w="28" h="100vh" bgColor="blue.100" justify="flex-end" spacing="8" pb="4">
				<IconButton
					position="absolute"
					top="0"
					mt="4"
					colorScheme="whatsapp"
					aria-label="add room"
					icon={<StarIcon w="8" h="8" p="2" />}
				/>

				<Link href="/newchat">
					<IconButton colorScheme="whatsapp" aria-label="add room" icon={<AddIcon w="8" h="8" p="2" />} />
				</Link>
				<Link href="/setting">
					<IconButton colorScheme="whatsapp" aria-label="add room" icon={<SettingsIcon w="8" h="8" p="2" />} />
				</Link>
				<LogoutModal />
			</VStack>

			{/* -- 채팅방 검색 */}
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
					{allRooms &&
						allRooms.chatRooms.map((room: any) => (
							<ChatRoomCard
								key={room.id}
								id={room.id}
								name={room.name}
								category={room.category}
								description={room.description}
								university={room.university}
								socket={socket}
							/>
						))}
				</VStack>
			</VStack>

			{/* -- 참여중인 채팅방 */}
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
					{myRooms &&
						myRooms.chatRooms.map((room: any) => (
							<MyRoomCard
								id={room.id}
								key={room.id}
								name={room.name}
								university={room.university}
								isCurrentRoom={currentRoom.id === room.id}
								joinChatRoom={joinChatRoom}
							/>
						))}
				</VStack>
			</VStack>

			{/* -- 채팅화면 */}
			{currentRoom?.id ? (
				<Flex direction="column" w="100%" h="100vh" bgColor="gray.100" p="4" justify="space-between">
					<Flex justify="space-between" w="100%">
						<Heading as="h3" size="lg" m="0" p="0">
							{currentRoom.name}
						</Heading>
						<ExitChatModal />
					</Flex>

					{/* 채팅방의 메시지 리스트 */}
					<VStack
						mt="4"
						p="4"
						spacing="4"
						alignItems="flex-start"
						overflowY="scroll"
						ref={chatBoxRef}
						bgColor="linkedin.100"
					>
						{currentRoomChats.map((roomChat: any) => (
							<ChatMessageCard roomChat={roomChat} />
						))}
					</VStack>

					{/* 채팅 입력창 및 전송버튼 */}

					<Flex w="100%" alignItems="center" mt="4">
						<Textarea
							placeholder="메시지 입력하세요. 전송 = 'ctrl + Enter'"
							resize="none"
							border="1px"
							borderColor="gray.300"
							ref={chatInputRef}
							onKeyPress={sendMessage}
						/>
						<Button type="submit" colorScheme="blue" h="20" p="4" onClick={sendMessage}>
							Button
						</Button>
					</Flex>
				</Flex>
			) : (
				<Flex w="100%" h="100vh" bgColor="gray.100" p="4" justify="center" alignItems="center">
					<Heading>채팅에 참여해보세요!</Heading>
				</Flex>
			)}

			{/* -- 채팅에 참여중인 인원 */}
			<VStack w="md" h="100vh" bgColor="orange.100" display={{ base: 'none', md: 'flex' }}>
				<Heading as="h5" size="md" p="4">
					채팅방 인원
				</Heading>

				<VStack overflowY="scroll" h="60%" w="100%" alignItems="flex-start">
					{currentRoomUsers.map((roomUser: any) => (
						<Flex alignItems="center" cursor="pointer" _hover={{ bgColor: 'gray.600' }}>
							<Avatar mx="4" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
							<Text mx="2">{roomUser.user.name}</Text>
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

export const getServerSideProps: GetServerSideProps<any> = async (ctx) => {
	if (!ctx.req.cookies.jwt) {
		return {
			redirect: {
				permanent: false,
				destination: '/login'
			}
		};
	}
	const res1 = await axios.get('http://localhost:4000/api/chatRoom', {
		headers: {
			cookie: `jwt=${ctx.req.cookies.jwt}`
		}
	});
	const res2 = await axios.get('http://localhost:4000/api/chatRoom/my', {
		headers: {
			cookie: `jwt=${ctx.req.cookies.jwt}`
		}
	});

	return {
		props: {
			initAllRooms: res1.data,
			initMyRooms: res2.data
		}
	};
};
export default ChatPage;
