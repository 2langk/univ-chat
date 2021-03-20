import { ChatIcon } from '@chakra-ui/icons';
import {
	Button,
	Flex,
	Heading,
	Popover,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Portal,
	Text,
	HStack,
	useToast
} from '@chakra-ui/react';
import { useCallback } from 'react';
import useSWR from 'swr';

const ChatRoomCard: React.VFC<any> = ({ id, name, category, description, university, socket }) => {
	const { data: currentUser } = useSWR('/api/auth/me');
	const { data: myRooms, mutate: setMyRooms } = useSWR('/api/chatRoom/my');
	const toast = useToast();

	const joinChatRoom = useCallback(
		(e, onClose) => {
			e.preventDefault();
			if (!['all', currentUser.user.university].includes(university)) {
				toast({
					title: `입장가능한 채팅방이 아닙니다!`,
					status: 'warning',
					duration: 3000,
					isClosable: true
				});

				return;
			}
			socket.emit('newUserJoin', { roomId: id, user: currentUser.user });
			setMyRooms(myRooms, true);
			toast({
				title: `채팅방에 입장했습니다`,
				status: 'success',
				duration: 3000,
				isClosable: true
			});
			onClose();
		},
		[id, myRooms, setMyRooms, toast, currentUser, socket, university]
	);

	return (
		<Popover>
			{({ onClose }) => (
				<>
					<PopoverTrigger>
						<Flex alignItems="center" p="2" w="100%" cursor="pointer" _hover={{ bgColor: 'gray.600' }}>
							<ChatIcon w="12" h="12" mr="4" />
							<Flex direction="column">
								<Heading size="sm" whiteSpace="nowrap">
									{name}
								</Heading>
								<Text>학교: {university}</Text>
							</Flex>
						</Flex>
					</PopoverTrigger>

					<Portal>
						<PopoverContent>
							<PopoverHeader>{name}</PopoverHeader>
							<PopoverCloseButton />
							<PopoverBody>
								<Text mb="2">{description}</Text>
								<HStack spacing="2" py="2">
									<Text>카테고리: {category}</Text>
									<Button
										colorScheme="messenger"
										p="4"
										mx="2"
										position="absolute"
										right="0"
										onClick={(e) => joinChatRoom(e, onClose)}
									>
										입장
									</Button>
								</HStack>
							</PopoverBody>
						</PopoverContent>
					</Portal>
				</>
			)}
		</Popover>
	);
};

export default ChatRoomCard;
