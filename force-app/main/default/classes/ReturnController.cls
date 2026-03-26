public with sharing class ReturnController {

    @AuraEnabled(cacheable=true)
    public static List<Borrow_Record__c> getBorrowRecords(){

        return [
            SELECT Id, Book__r.Name, Member__r.Name
            FROM Borrow_Record__c
            WHERE status__c = 'Borrowed'
        ];
    }
}