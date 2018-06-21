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