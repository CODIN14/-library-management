public with sharing class BorrowActionController {

    @AuraEnabled
    public static void borrowBook(Id bookId, Id memberId){

        Borrow_Record__c br = new Borrow_Record__c();

        br.Book__c = bookId;
        br.Member__c = memberId;
        br.status__c = 'Borrowed';
        br.Borrow_Date__c = Date.today();

        insert br;
    }
}