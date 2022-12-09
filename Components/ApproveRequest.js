import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { db } from '../firebase';
import { query, collection, where, getDocs, getDoc, updateDoc, setDoc, doc } from 'firebase/firestore';

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


const approveRequest = async (request) => {
  //Build a query to find the right ecosystemMember

  const q = query(
    collection(db, 'EcosystemMembers'),
    where('ecosystemId', '==', request.ecosystemId),
    where('userId', '==', request.userId)
  );
  const ecoMemberdocSnap = await getDocs(q);
  //const currentName = docSnap.docs[0].data().userName;
    //request.requestId
    const requestdocSnap = await getDoc(doc(db, "RewardRequests", request.requestId))

  ecoMemberdocSnap.forEach((ecoMember) => {
    let newAmount = +ecoMember.data().currencyAmount + +requestdocSnap.data().reward;
    updateDoc(ecoMember.ref, {
      currencyAmount: newAmount,
    });
  })

  updateDoc(doc(db, "RewardRequests", request.requestId), {approved: true})

  // docSnap.forEach((ecoMem) => console.log(ecoMem.ref));




  //create notification
  /* const currentTaskDoc = await getDoc(doc(db, 'Tasks', id));
  const TaskObj = currentTaskDoc.data();

  if (TaskObj.assignedTo !== TaskObj.owner) {
    await setDoc(doc(db, 'Notifications', id), {
      ...TaskObj,
      orgName: singleEcosystem.orgName,
      userName: currentName,
    });
  } */

  //setOpen(false);
};

//Parent modal for deciding what type of edit you would like to make -- Edit or Delete
export default function ApproveRequest({ request}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = (e, closing) => {
    if (closing) {
      setOpen(false);
      return;
    }
  //find the ecosystem member using request.userId
  //increase their currencyAmount
  //delete the request
  approveRequest(request)
    setOpen(false);
  };

  return (
    <div>
      <div className='flex justify-around'>
        <button
          onClick={handleOpen}
          className='text-green-600 border border-green-600 rounded-3xl p-2 hover:bg-green-600 hover:text-white'
        >
          Approve 
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
            <h2 id='parent-modal-title'>Task: {request.name}</h2>
            <p>{request.reward} points will be awarded to {request.userName}</p>
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