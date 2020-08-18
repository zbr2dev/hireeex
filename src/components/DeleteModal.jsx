import React from 'react';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class DeleteModal extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            modalIsOpen: false,
        }

        this.openModal = this
            .openModal
            .bind(this);
        this.afterOpenModal = this
            .afterOpenModal
            .bind(this);
        this.closeModal = this
            .closeModal
            .bind(this);
    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed. this.subtitle.style.color =
        // '#f00';
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    render(){
        return(
            <>
                <span onClick={this.openModal}>Delete</span>
                <Modal className="createProjModal"
                    portalClassName="ReactModalPortal modalPortalCreateProj "
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal">
                    <div
                        className="remodal"
                        data-remodal-id="modal"
                        role="dialog"
                        aria-labelledby="modal1Title"
                        aria-describedby="modal1Desc">
                        {/*  TOP ROW OF "CREATE PROJECT" POPUP  */}
                        <div className="create-proj-top-row">
                            <p>{this.props.title}</p>
                            <button
                                onClick={this.closeModal}
                                data-remodal-action="close"
                                className="remodal-close create-proj-close"
                                aria-label="Close"></button>
                        </div>
                        {/*  MAIN PART OF "CREATE PROJECT" POPUP */}
                        <div className="create-proj-main">
                            <div className="create-proj-info-wrapper">
                                <div className="create-proj-info-item">
                                    <div className="create-proj-block" style={{marginBottom: 0}}>
                                        <p className="create-proj-info-label">{this.props.message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>{/*  end of create-proj-main  */} {/*  BOTTOM ROW OF "CREATE PROJECT" POPUP  */}
                        <div className="create-proj-bottom-buttons ">
                            <button onClick={this.closeModal} className="create-proj-btn create-proj-back-btn">Cancel</button>
                            <button onClick={() => {this.props.onDelete(); this.closeModal();}} className="create-proj-btn create-proj-create-btn">Delete</button>
                        </div>{/*  end of remodal-bottom-buttons  */}
                    </div>
                </Modal>
            </>
        )
    }
}

export default DeleteModal;