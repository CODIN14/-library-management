public with sharing class LibraryDataController {

    @AuraEnabled(cacheable=true)
    public static List<Book__c> getBooks(){
        return [SELECT Id, Name FROM Book__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Member__c> getMembers(){
        return [SELECT Id, Name FROM Member__c];
    }
}