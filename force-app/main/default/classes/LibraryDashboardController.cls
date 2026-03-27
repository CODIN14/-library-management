public with sharing class LibraryDashboardController {

    public class LibraryStats {
        @AuraEnabled public Integer totalBooks;
        @AuraEnabled public Integer availableBooks;
        @AuraEnabled public Integer borrowedBooks;
        @AuraEnabled public Integer overdueBooks;
        @AuraEnabled public Integer members;
    }

    @AuraEnabled(cacheable=true)
    public static LibraryStats getLibraryStats() {
        LibraryStats stats = new LibraryStats();

        // Total copies currently available (from Book records)
        AggregateResult availableAgg = [SELECT SUM(Available_Copies__c) availableSum FROM Book__c];
        Decimal availableSum = (Decimal)availableAgg.get('availableSum');
        stats.availableBooks = (availableSum == null) ? 0 : Integer.valueOf(availableSum.setScale(0, RoundingMode.DOWN).intValue());

        // Borrowed and overdue counts from borrow records
        AggregateResult borrowedAgg = [SELECT COUNT(Id) cnt FROM Borrow_Record__c WHERE status__c = 'Borrowed'];
        stats.borrowedBooks = (Integer)borrowedAgg.get('cnt');

        AggregateResult overdueAgg = [SELECT COUNT(Id) cnt FROM Borrow_Record__c WHERE status__c = 'Overdue'];
        stats.overdueBooks = (Integer)overdueAgg.get('cnt');

        // Total members
        AggregateResult memberAgg = [SELECT COUNT(Id) cnt FROM Member__c];
        stats.members = (Integer)memberAgg.get('cnt');

        // Total books = available + borrowed + overdue (all tracked copies)
        stats.totalBooks = stats.availableBooks + stats.borrowedBooks + stats.overdueBooks;

        return stats;
    }
}
