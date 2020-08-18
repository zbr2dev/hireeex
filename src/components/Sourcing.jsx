import React from 'react';
import Filters from './Filters';
import SourcingList from './SourcingList';
import API from '../API.js';

class Sourcing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            havingSources: null,
            projectId: props.match.params.id
        }
    }

    componentWillMount(){
        this.getSourcingList();
    }

    getSourcingList(){
        API.sourcing().getSourcingCount(this.props.match.params.id)
            .then(res => {
                this.setState({havingSources: res.data});
            })
            .catch(err=> {
                console.log(err);
                this.setState({havingSources: 5}); //Change havingSources value to zero to see Filters page 
            })
    }

    render(){
        if(this.state.havingSources === 0){
            var content = <Filters/>
        }
        else if(this.state.havingSources > 0) {
            var content = <SourcingList projectId={this.state.projectId}/>
        }
        else{
            var content = <div></div>
        }

        return(
            content
        )
    }
}

export default Sourcing;