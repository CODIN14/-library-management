public with sharing class BookRecommendationService {

    // This defines what we send to LWC
    public class BookWrapper {
        @AuraEnabled public String title;
        @AuraEnabled public String author;
    }

    @AuraEnabled
    public static BookWrapper getRecommendation(){

        // STEP 1: Create HTTP request
        Http http = new Http();
        HttpRequest req = new HttpRequest();

        // STEP 2: API endpoint
        req.setEndpoint('https://openlibrary.org/search.json?q=fiction');
        req.setMethod('GET');

        // STEP 3: Send request
        HttpResponse res = http.send(req);

        // STEP 4: Convert JSON → Map
        Map<String, Object> data =
            (Map<String, Object>) JSON.deserializeUntyped(res.getBody());

        // STEP 5: Get list of books
        List<Object> docs = (List<Object>) data.get('docs');

        if(docs == null || docs.isEmpty()){
            return null;
        }

        // STEP 6: Pick random first book
        Integer size = docs.size();
        Integer randomIndex = Math.mod(Math.abs(Crypto.getRandomInteger()), size);

        Map<String, Object> firstBook = (Map<String, Object>) docs[randomIndex];

        // STEP 7: Create wrapper
        BookWrapper book = new BookWrapper();

        book.title = (String) firstBook.get('title');

        List<Object> authors = (List<Object>) firstBook.get('author_name');
        if(authors != null && !authors.isEmpty()){
            book.author = (String) authors[0];
        }

        return book;
    }
}