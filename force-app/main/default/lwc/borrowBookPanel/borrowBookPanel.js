import { publish, MessageContext } from 'lightning/messageService';
import BORROW_CHANNEL from '@salesforce/messageChannel/borrowChannel__c';
import { LightningElement, wire } from 'lwc';

import getBooks from '@salesforce/apex/LibraryDataController.getBooks';
import getMembers from '@salesforce/apex/LibraryDataController.getMembers';
import borrowBook from '@salesforce/apex/BorrowActionController.borrowBook';

export default class BorrowBookPanel extends LightningElement {

    bookOptions = [];
    memberOptions = [];

    selectedBookId;
    selectedMemberId;

    @wire(MessageContext)
    messageContext;

    // Load books
    @wire(getBooks)
    wiredBooks({ data }) {
        if (data) {
            this.bookOptions = data.map(book => ({
                label: book.Name,
                value: book.Id
            }));
        }
    }

    // Load members
    @wire(getMembers)
    wiredMembers({ data }) {
        if (data) {
            this.memberOptions = data.map(member => ({
                label: member.Name,
                value: member.Id
            }));
        }
    }

    handleBookChange(event){
        this.selectedBookId = event.detail.value;
    }

    handleMemberChange(event){
        this.selectedMemberId = event.detail.value;
    }

    handleBorrow(){

        if(!this.selectedBookId || !this.selectedMemberId){
            alert('Please select book and member');
            return;
        }

        borrowBook({
            bookId: this.selectedBookId,
            memberId: this.selectedMemberId
        })
        .then(() => {

            // 🔥 SEND MESSAGE TO OTHER COMPONENTS
            publish(this.messageContext, BORROW_CHANNEL, {
                status: 'borrowed'
            });

            alert('Book borrowed successfully');
        })
        .catch(error => {
            console.error(error);
        });
    }
}