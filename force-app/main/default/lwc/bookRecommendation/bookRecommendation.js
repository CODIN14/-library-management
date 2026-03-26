import { LightningElement } from 'lwc';
import searchBooks from '@salesforce/apex/BookRecommendationService.searchBooks';

export default class BookRecommendation extends LightningElement {

    query = '';
    books = [];
    isLoading = false;
    error;

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
}