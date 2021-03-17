import { Avatar, Box, Flex, HStack, Text } from '@chakra-ui/react';

const ChatMessageCard: React.VFC<any> = ({ roomChat }) => {
	return (
		<Flex border="1px" borderColor="gray.800" rounded="xl" p="4" alignItems="center">
			<Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" h="16" w="16" />
			<Flex direction="column">
				<HStack>
					<Text fontWeight="bold" ml="2">
						{roomChat.user.name}
					</Text>
					<Text fontWeight="medium" fontSize="xs" mx="2">
						{roomChat.createdAt}
					</Text>
				</HStack>
				<Box>
					<Text m="2">{roomChat.message}</Text>
				</Box>
			</Flex>
		</Flex>
	);
};

export default ChatMessageCard;
