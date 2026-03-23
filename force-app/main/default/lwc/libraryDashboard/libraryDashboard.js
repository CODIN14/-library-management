import { LightningElement, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import BORROW_CHANNEL from '@salesforce/messageChannel/borrowChannel__c';
import getLibraryStats from '@salesforce/apex/LibraryDashboardController.getLibraryStats';
import { refreshApex } from '@salesforce/apex';

export default class LibraryDashboard extends LightningElement {

    stats = {};
    wiredResult;

    @wire(MessageContext)
    messageContext;

    @wire(getLibraryStats)
    wiredStats(result) {
        this.wiredResult = result;

        if (result.data) {
            this.stats = result.data;
        } else if (result.error) {
            console.error(result.error);
        }
    }

    handleRefresh(){
        refreshApex(this.wiredResult);
    }

    subscribeToChannel(){

        subscribe(
            this.messageContext,
            BORROW_CHANNEL,
            (message) => {

                // 🔥 THIS IS THE MAGIC
                refreshApex(this.wiredResult);
            }
        );
    }

    connectedCallback(){
        this.subscribeToChannel();
    }

}