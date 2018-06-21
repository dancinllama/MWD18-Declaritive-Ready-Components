/**
 * SuperLightningListbuilderCtrl
 * @description Controller class for the Super Lightning List Builder component
 * @author James Loghry (Demand Chain)
 * @date 4/30/2018
 */
public class SuperLightningListBuilderCtrl {

    @AuraEnabled
    public static LightningResponse getRecords(String listViewId,boolean displayAddAction){
     	LightningResponse lr = new LightningResponse();
        try{
            ListResult listr = new ListResult();
            
            Id listViewIdCasted = (Id)listViewId;
            
            MetadataAPI api = new MetadataAPI();
            
           	List<ListView> lvList = [Select sObjectType From ListView Where Id = : listViewIdCasted];
            MetadataAPI.ListViewWrapper wrapper = api.describeListview(lvList.get(0).sObjectType,listViewIdCasted);
            
            String query = wrapper.query;
            listr.records = Database.query(query);
            
            for(MetadataAPI.ListViewColumn lvc: wrapper.columns){
                if(!lvc.hidden){
                    listr.columns.add(new Column(lvc));	    
                }
            }
            
            String serializedColumns = JSON.serialize(listr.columns);
            serializedColumns = serializedColumns.replaceAll('class_x','class');
            
            String serializedRecords = JSON.serialize(listr.records);
            lr.jsonResponse = '{"records":'+serializedrecords + ',"columns":'+serializedColumns+'}';
        }catch(Exception ex){
            lr = new LightningResponse(ex);
        }
        return lr;
    }
    
    public class ListResult{
        public List<Column> columns {get; set;}
        public List<sObject> records {get; set;}
        
        public ListResult(){
            this.columns = new List<Column>();
            this.records = new List<sObject>();
        }
    }
    
    public class Column{
        public String label {get; set;}
        public String fieldName {get; set;}
        public String type {get; set;}
        public boolean sortable {get; set;}
        public Integer initialWidth {get; set;}
        public ColumnTypeAttributes typeAttributes {get; set;}
        
        public Column(){}
        
        public Column(MetadataAPI.ListViewColumn lvc){
            this.label = lvc.label;
            this.fieldName = lvc.fieldNameOrPath;
            this.type = getType(lvc.type);
            this.sortable = true;

            
            if(lvc.fieldNameOrPath.endsWithIgnoreCase('.Name')){
                this.type = 'url';
                this.typeAttributes = new ColumnTypeAttributes();
                this.typeAttributes.label = new ColumnLabelAttribute();
                this.typeAttributes.label.fieldName = lvc.fieldNameOrPath.replace('.Name','___Name');
                this.fieldName = lvc.fieldNameOrPath.replace('.Name','___Id');
            }else{
            	this.fieldName = lvc.fieldNameOrPath.replace('.','___');
            }
                
        }
        
        private String getType(String str){
            try{
                List_View_Field_Type_Mapping__mdt lvftm = [Select Data_Table_Type__c From List_View_Field_Type_Mapping__mdt Where DeveloperName = :str];
                return lvftm.Data_Table_Type__c;
            }catch(Exception e){
                return str;
            }
        }
    }
    
    public class ColumnTypeAttributes{
        public Integer minimumIntegerDigits {get; set;}
        public Integer minimumFractionDigits {get; set;}
        public Integer maximumFractionDigits {get; set;}
        public Integer minimumSignificantDigits {get; set;}
        public Integer maximumSignificantDigits {get; set;}
        public String rowActions {get; set;}
        public String menuAlignment {get; set;}
        public boolean disabled {get; set;}
        public String iconName {get; set;}
        public String iconPosition {get; set;}
        public ColumnLabelAttribute label {get; set;}
        public String name {get; set;}
        public String title {get; set;}
        public String variant {get; set;}
        public Long longitude {get; set;}
        public Long latitude {get; set;}
        public String currencyCode {get; set;}
        public String currencyDisplayAs {get; set;}
        public String target {get; set;}
        public String class_x {get; set;}
    }
    
    public class ColumnLabelAttribute{
        public String fieldName {get; set;}
    } 
}