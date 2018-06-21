/**
 * LightningResponse
 * @author James Loghry (DCS)
 * @date 2/5/2018
 * @description This class  is used as a wrapper for Lightning Components.  Used for properly reproting success and error conditions
 */
public class LightningResponse{
    
    //The various variables returned back to the component when an action is invoked.
	@AuraEnabled public String jsonResponse {get; set;}
    @AuraEnabled public List<ResponseError> errors {get; set;}
    @AuraEnabled public String state {get; set;}
    
    //Success / Default constructor
    public LightningResponse(){
        this.errors = new List<ResponseError>();
        this.state = 'SUCCESS';
    }
    
    //Error response constructor
    public LightningResponse(Exception e){
        this();
        this.state = 'ERROR';
        if(e != null){
            this.errors.add(new ResponseError(e));
            System.debug('Exception: ' + e.getMessage());
            System.debug('Exception stack trace: ' + e.getStackTraceString());
        }
    }
    
    //Error object returned when there is an error.  Handled properly by the abstract component.
    public class ResponseError{
        @AuraEnabled public String message {get; set;}
        @AuraEnabled public String stackTrace {get; set;}
        public ResponseError(Exception e){
            this.message = e.getMessage();
            this.stackTrace = e.getStackTraceString();
        }
    }
}