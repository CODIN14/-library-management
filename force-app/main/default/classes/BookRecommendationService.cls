public with sharing class BookRecommendationService {

    // This defines what we send to LWC
    public class BookWrapper {
        @AuraEnabled public String title;
        @AuraEnabled public String author;
    }

    @AuraEnabled
    public static List<BookWrapper> searchBooks(String query){

    Http http = new Http();
    HttpRequest req = new HttpRequest();

    String endpoint = 'https://openlibrary.org/search.json?q=' + query;

    req.setEndpoint(endpoint);
    req.setMethod('GET');

    HttpResponse res = http.send(req);

    Map<String, Object> data =
        (Map<String, Object>) JSON.deserializeUntyped(res.getBody());

    List<Object> docs = (List<Object>) data.get('docs');

    List<BookWrapper> books = new List<BookWrapper>();

    if(docs != null){

        Integer maxResults = Math.min(5, docs.size()); // 🔥 limit results

        for(Integer i = 0; i < maxResults; i++){

            Map<String, Object> bookData = (Map<String, Object>) docs[i];

            BookWrapper book = new BookWrapper();

            book.title = (String) bookData.get('title');

            List<Object> authors = (List<Object>) bookData.get('author_name');
            if(authors != null && !authors.isEmpty()){
                book.author = (String) authors[0];
            }

            books.add(book);
        }
    }

    return books;
}
}