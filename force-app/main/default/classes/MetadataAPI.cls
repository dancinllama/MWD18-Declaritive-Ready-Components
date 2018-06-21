/**
 * MetadataAPI
 * @description Class for calling MetadataAPI RESTful calls.
 * @author James Loghry
 * @date 4/20/2018
 **/
public class MetadataAPI{

    // The API version used relates to the types and structures defined here
    private static final String METADATA_API_URI = '/services/data/v42.0/sobjects';

    // Session Id can be resovled automatically depending on consturctor used
    private String sessionId;

    /**
     * Uses the current users Session Id, only compatible in a interactive context
     * @throws ToolingAPIException if no Session Id can be resolved (e.g. in a batch context)
     **/
    public MetadataAPI() {
        this.sessionId = UserInfo.getSessionId();
    }
    
    public List<ListViewWrapper> getListViews(String sobjectType){
        HttpResponse response = submitRestCall('/' + sobjectType + '/listviews','GET', null);
        System.debug('response body: ' + response.getBody());
        ListViewsResult result = (ListViewsResult)JSON.deserialize(response.getBody(),ListViewsResult.class);
        return result.listviews;
    }
    
    public ListViewWrapper describeListView(String sobjectType,String listViewId){
        HttpResponse response = submitRestCall('/' + sobjectType + '/listviews/' + listViewId + '/describe','GET', null);
        System.debug('response body: ' + response.getBody());
        ListViewWrapper result = (ListViewWrapper)JSON.deserialize(response.getBody(),ListViewWrapper.class);
        return result;
    }
    
    public class ListViewsResult{
        public List<ListViewWrapper> listviews {get; set;}
        public boolean done {get; set;}
    }
    
    public class ListViewWrapper{
        public String describeUrl {get; set;}
        public String developerName {get; set;}
        public String id {get; set;}
        public String label {get; set;}
        public String resultsUrl {get; set;}
        public String soqlCompatible {get; set;}
        public String url {get; set;}
        public String query {get; set;}
        public List<ListViewColumn> columns {get; set;}
    }
    
    public class ListViewColumn{
        public String ascendingLabel {get; set;}
        public String descendingLabel {get; set;}
        public String fieldNameOrPath {get; set;}
        public List<ListViewFilter> filters {get; set;}
        public String filterScope {get; set;}
        public boolean hidden {get; set;}
        public String label {get; set;}
        public String selectListItem {get; set;}
        public String sortDirection {get; set;}
        public String sortIndex {get; set;}
        public boolean sortable {get; set;}
        public String type {get; set;}
    }
    
    public class ListViewFilter{
        public String filter {get; set;}
        public String operation {get; set;}
        public String value {get; set;}
    }
    
    public class ErrorResponse{
        public List<String> fields;
        public String errorCode;
        public String message;
    }
    
    /**
     * MetadataAPIException
     * @description Apex class for exceptions encountered with the Metadata API callouts
     * @author James Loghry
     * @date 4/30/2018
     */
    public class MetadataAPIException extends Exception{
        public MetadataAPIException(List<MetadataAPI.ErrorResponse> errorResponses){
            this(errorResponses[0].errorCode + ' : ' + errorResponses[0].message);
        }
    }
    
    
    

    /*
     * Helper method for submitting the REST request using the given method and data.
     *
     * @throws ToolingAPIAuthorizationException if the remote site is not authorized.
     */
    private HttpResponse submitRestCall(String relativeUrl, String method,String body){
        Http h = new Http();
        HttpRequest queryReq = new HttpRequest();
        queryReq.setEndpoint('callout:Salesforce_REST_API_Sandbox' + METADATA_API_URI + relativeUrl);
        queryReq.setHeader('Authorization', 'OAuth ' + this.sessionId);
        queryReq.setHeader('Content-Type', 'application/json');
        queryReq.setMethod(method);
        
        if(!String.isEmpty(body)){
            queryReq.setBody(body);
        }

        HttpResponse queryRes = h.send(queryReq);
        
        Set<Integer> successCodes = new Set<Integer>{200,201,204};
        if(!successCodes.contains(queryRes.getStatusCode())){
            if(queryRes.getBody().length()>0){
                throw new MetadataAPIException((List<ErrorResponse>) JSON.deserialize(queryRes.getBody(), List<ErrorResponse>.class));
            }else{
                throw new MetadataAPIException('Unexpected HTTP Status ' + queryRes.getStatusCode());
            }
        }
        return queryRes;
    }
}