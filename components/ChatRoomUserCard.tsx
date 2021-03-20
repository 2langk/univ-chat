import { Flex, Text, Avatar } from '@chakra-ui/react';

const ChatRoomUserCard: React.FC<any> = ({ roomUser }) => {
	return (
		<>
			<Flex alignItems="center" cursor="pointer" _hover={{ bgColor: 'gray.600' }}>
				<Avatar mx="4" name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
				<Text mx="2">{roomUser.user.name}</Text>
			</Flex>
		</>
	);
};

export default ChatRoomUserCard;
