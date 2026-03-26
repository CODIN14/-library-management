import { LightningElement } from 'lwc';
import getRecommendation from '@salesforce/apex/BookRecommendationService.getRecommendation';

export default class BookRecommendation extends LightningElement {

    book;
    isLoading = false; // 🔥 NEW
    error;

    handleClick(){

        this.isLoading = true;   // start loading
        this.error = null;       // reset error

        getRecommendation()
        .then(result => {
            this.book = result;
        })
        .catch(error => {
            this.error = 'Something went wrong';
            console.error(error);
        })
        .finally(() => {
            this.isLoading = false; // stop loading
        });
    }
}