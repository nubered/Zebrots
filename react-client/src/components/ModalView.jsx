import React from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import $ from 'jquery';

let ModalView = ({show, closeMethod, post, submitted}) => (
     <div>
      {
        show &&
        <ModalContainer onClose={closeMethod}>
          <ModalDialog onClose={closeMethod}>
            {!submitted
              ?
              <div>
                <h1>Ask a question and connect!</h1>
                <form>
                <input
                  id="inputTopic" type="text" size="60"
                  placeholder=" I haven't quite grokked React... Anyone down for a chat?"
                />
                <button onClick={post}>Connect</button>
                </form>
              </div>
              :
              <div>
                <h1>Thanks for connecting :-)</h1>
                <h3>Your topic has been posted</h3>
              </div>
                }
          </ModalDialog>
        </ModalContainer>
      }
    </div>
  );

export default ModalView;
