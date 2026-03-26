import { LightningElement, wire } from 'lwc';

import getBorrowRecords from '@salesforce/apex/ReturnController.getBorrowRecords';
import returnBook from '@salesforce/apex/BorrowActionController.returnBook';

export default class ReturnBookPanel extends LightningElement {

    connectedCallback(){
        console.log('COMPONENT LOADED');
    }

    records = [];
    selectedBorrowId;

    @wire(getBorrowRecords)
    wiredRecords({ data }) {
        if (data) {
            this.records = data.map(rec => ({
                label: rec.Book__r.Name + ' - ' + rec.Member__r.Name,
                value: rec.Id
            }));
        }
    }

    handleChange(event){
        this.selectedBorrowId = event.detail.value;
    }

    handleReturn(){
        console.log('BUTTON CLICKED');

        if(!this.selectedBorrowId){
            alert('Select a record');
            return;
        }

        returnBook({ borrowId: this.selectedBorrowId })
        .then(() => {
            console.log('APEX SUCCESS');
            alert('Book returned successfully');
            // Refresh the records list
            this.records = [];
        })
        .catch(error => {
            console.error('ERROR:', error);
            const errorMessage = error?.body?.message || error?.message || 'An error occurred while returning the book';
            alert('Error: ' + errorMessage);
        });
    }
}