import React from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

let ModalView = ({show, closeMethod, display}) => (
     <div>
      {
        show &&
        <ModalContainer onClose={closeMethod}>
          <ModalDialog onClose={closeMethod}>
            {display}
          </ModalDialog>
        </ModalContainer>
      }
    </div>
  );

export default ModalView;
