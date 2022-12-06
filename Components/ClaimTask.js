import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import SuccessAlert from './SuccessAlert';

const style = {
  position: 'absolute',
  top: '40%',
  left: '78%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  pt: 0,
  borderRadius: 5,
  alignItems: 'center',
  overflow: 'scroll',
};

//Parent modal for deciding what type of edit you would like to make -- Edit or Delete
export default function ClaimTask({ task, user }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = (e, closing) => {
    if (closing) {
      setOpen(false);
      return;
    }
    setDoc(
      doc(db, 'Tasks', task.id),
      { assignedTo: user.uid },
      { merge: true }
    );
    setOpen(false);
    return <SuccessAlert />;
  };

  return (
    <div>
      <div className='flex justify-around'>
        <button
          onClick={handleOpen}
          className='text-green-600 border border-green-600 rounded-3xl p-2 hover:bg-green-600 hover:text-white'
        >
          Claim Task
        </button>
      </div>
      <Modal
        open={open}
        onClose={(e) => handleClose(e, true)}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={{ ...style, width: 300, height: 150 }}>
          <div className='flex flex-col items-center p-4'>
            <CloseIcon
              className='absolute top-0 right-0 m-3 duration-300 hover:scale-110 hover:font-bold'
              onClick={(e) => handleClose(e, true)}
            />
            <h2 id='parent-modal-title'>Task: {task.name}</h2>
            <p>{task.completed ? 'Status: Completed' : 'Status: Incomplete'}</p>
            <p>Due: {task.due}</p>
            <button
              onClick={(e) => handleClose(e, false)}
              className='text-green-600 border border-green-600 rounded-3xl px-2 m-4 hover:bg-green-600 hover:text-white'
            >
              Confirm!
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
