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
import { useRouter } from 'next/router';
import useSWR from 'swr';

const ExitChatModal = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { mutate: setUser } = useSWR('/api/auth/me');

	const router = useRouter();
	const toast = useToast();

	const logout = (close: () => void) => {
		axios.post('/api/auth/logout', {}).then(() => {
			toast({
				title: `로그아웃 성공`,
				status: 'success',
				isClosable: true
			});

			setUser('', false);
			setTimeout(() => {
				router.push('/login');
			}, 1000);
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
						<Button colorScheme="blue" mr={3} onClick={() => logout(onClose)}>
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
