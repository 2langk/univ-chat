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
	HStack
} from '@chakra-ui/react';

const ChatRoomCard = () => {
	return (
		<Popover>
			<PopoverTrigger>
				<Flex alignItems="center" p="2" w="100%" cursor="pointer" _hover={{ bgColor: 'gray.600' }}>
					<ChatIcon w="12" h="12" mr="4" />
					<Flex direction="column">
						<Heading size="sm">채팅방 이름</Heading>
						<Text>학교: 학교이름</Text>
					</Flex>
				</Flex>
			</PopoverTrigger>

			<Portal>
				<PopoverContent>
					<PopoverHeader>채팅방 이름</PopoverHeader>
					<PopoverCloseButton />
					<PopoverBody>
						<Text mb="2">채팅방 소개 채팅방 소개 채팅방 소개 채팅방 소개</Text>
						<HStack spacing="2" py="2">
							<Text>카테고리: 일반</Text>
							<Text>인원: 10</Text>
							<Button colorScheme="messenger" p="4" mx="2" position="absolute" right="0">
								입장
							</Button>
						</HStack>
					</PopoverBody>
				</PopoverContent>
			</Portal>
		</Popover>
	);
};

export default ChatRoomCard;
