import React, {useState, useContext, useEffect} from 'react';

import { ContextLibrary } from '.';

import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
  };

export default function TransitionsModal() {
    const context =  useContext(ContextLibrary);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalHeader, setModalHeader] = useState("");
    
    useEffect(() => {
        setModalOpen(context.data.modal.showModal);
        setModalHeader(context.data.modal.modalHeader);
        setModalContent(context.data.modal.modalContent);
    }, [context.data.modal.showModal]);

  
	return (
		<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			open={modalOpen}
			onClose={()=>context.toggleModal()}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
				timeout: 500,
			}}
		>
			<Fade in={modalOpen}>
				<Box sx={style}>
					<Typography id="transition-modal-title" variant="h6" component="h2">
						{modalHeader}
					</Typography>
					<Typography id="transition-modal-description" sx={{ mt: 2 }}>
						{modalContent}
					</Typography>
				</Box>
			</Fade>
		</Modal>
	);
}
