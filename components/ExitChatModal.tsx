import { SmallCloseIcon } from '@chakra-ui/icons';
import {
	Button,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	useToast
} from '@chakra-ui/react';
import axios from 'axios';
import useSWR from 'swr';

const ExitChatModal: React.FC<any> = ({ currentRoom, setCurrentRoom }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { mutate: setMyRooms } = useSWR('/api/chatRoom/my');

	const toast = useToast();

	const exitRoom = (close: () => void) => {
		axios.delete(`/api/chatRoom/${currentRoom.id}`, {}).then(() => {
			toast({
				title: `채팅방을 나갔습니다.`,
				status: 'success',
				isClosable: true
			});

			setCurrentRoom.setCurrentRoom({ id: '', name: '', univiersity: '' });
			setCurrentRoom.setCurrentRoomChats([]);
			setCurrentRoom.setCurrentRoomUsers([]);

			setMyRooms('', true);
		});
	};
	return (
		<>
			<IconButton colorScheme="red" aria-label="add room" icon={<SmallCloseIcon w="8" h="8" />} onClick={onOpen} />

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent m="auto">
					<ModalHeader>채팅방 나가기</ModalHeader>
					<ModalCloseButton />
					<ModalBody>정말로 채팅방을 나가겠습니까?</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={() => exitRoom(onClose)}>
							네
						</Button>
						<Button variant="ghost" onClick={onClose}>
							아니오
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ExitChatModal;
