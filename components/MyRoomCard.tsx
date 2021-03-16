import { ChatIcon, CheckIcon } from '@chakra-ui/icons';
import { Flex, Heading, Text, HStack } from '@chakra-ui/react';

const MyRoomCard: React.VFC<any> = ({ id, name, university, isCurrentRoom, joinChatRoom }) => {
	return (
		<Flex
			alignItems="center"
			justify="space-between"
			p="2"
			w="100%"
			cursor="pointer"
			_hover={{ bgColor: 'gray.600' }}
			onClick={() => joinChatRoom({ id, name, university })}
		>
			<HStack>
				<ChatIcon w="12" h="12" mr="4" />
				<Flex direction="column">
					<Heading size="sm">{name}</Heading>
					<Text>학교: {university}</Text>
				</Flex>
			</HStack>
			{isCurrentRoom && <CheckIcon w="4" h="4" mr="4" />}
		</Flex>
	);
};

export default MyRoomCard;
