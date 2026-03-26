import { LightningElement, wire } from 'lwc';
import searchBooks from '@salesforce/apex/BookRecommendationService.searchBooks';
import addBookToLibrary from '@salesforce/apex/BookRecommendationService.addBookToLibrary';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from 'lightning/messageService';
import BOOK_CHANNEL from '@salesforce/messageChannel/borrowChannel__c';

export default class BookRecommendation extends LightningElement {
    columns = [
        { label: 'Title', fieldName: 'title' },
        { label: 'Author', fieldName: 'author' },
        {
            type: 'button',
            typeAttributes: {
                label: 'Add to Inventory',
                name: 'add',
                variant: 'brand'
            }
        }
    ];

    query = '';
    books = [];
    isLoading = false;
    error;

    @wire(MessageContext)
    messageContext;

    handleChange(event){
        this.query = event.target.value;
    }

    handleSearch(){

        this.isLoading = true;
        this.error = null;

        searchBooks({ query: this.query })
        .then(result => {
            this.books = result;
        })
        .catch(error => {
            this.error = 'Failed to fetch books';
            console.error(error);
        })
        .finally(() => {
            this.isLoading = false;
        });
    }

    handleRowAction(event){

    const row = event.detail.row;

    addBookToLibrary({
        title: row.title,
        author: row.author
    })
    .then(result => {

        if(result === 'EXISTS'){
            this.showToast('Info', 'Book already exists', 'info');
        } else {
            this.showToast('Success', 'Book added to library', 'success');
                    publish(this.messageContext, BOOK_CHANNEL, {
            action: 'bookAdded'
        });
        }

    })
    .catch(error => {
        console.error(error);
        this.showToast('Error', 'Something went wrong', 'error');
    });
}

    showToast(title, message, variant){
    this.dispatchEvent(
        new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        })
    );
}

}