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
    @AuraEnabled
    public static void returnBook(Id borrowId){
        try {
            if (borrowId == null) {
                throw new IllegalArgumentException('Borrow ID cannot be null');
            }

            Borrow_Record__c br = [
                SELECT Id, status__c
                FROM Borrow_Record__c
                WHERE Id = :borrowId
                LIMIT 1
            ];

            br.status__c = 'Returned';
            br.Return_Date__c = Date.today();

            update br;
        } catch (QueryException e) {
            throw new AuraHandledException('Record not found: ' + e.getMessage());
        } catch (Exception e) {
            throw new AuraHandledException('Error returning book: ' + e.getMessage());
        }
    }
}