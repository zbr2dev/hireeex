import React from 'react';

// import * as CustomJS from '../custom.js';


class Pagination extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            itemsPerPage: 20,
            firstPageNumber: 1,
            // lastPageNumber: 

        }
    }
    
    render() {
        console.log('page NUMBERS', this.props.pageNumbers)
 const disabledFirstPage = this.props.currentPage === 1;
 const disabledLastPage = this.props.currentPage === this.props.pagesQuantity;
        // console.log('pagination props', pagesArray)
        return (
            <div className="pagination">
                <div className="pagination-previous">
                    <button disabled={disabledFirstPage} className={`${disabledFirstPage ? 'disabled-btn' : ''} `} onClick={this.props.moveToPrevPage}>Previous</button>
                    <p>Page</p>
                 
                </div>
        <div className="page">{this.props.currentPage}</div>
            <div className="pagination-previous pagination-next">
                    <p>of {this.props.pagesQuantity}</p>
                  
                    <button className={`${disabledLastPage ? 'disabled-btn' : ''} `} disabled={disabledLastPage} onClick={this.props.moveToNextPage}>Next</button>
           
                 
                </div>
            </div>
        )
    }
}


export default Pagination;