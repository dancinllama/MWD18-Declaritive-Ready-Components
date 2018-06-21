public class ListViewDesignAttribute extends VisualEditor.DynamicPickList{
    
    public override VisualEditor.DataRow getDefaultValue(){
        return new VisualEditor.DataRow('None','');
    }
	
    public override VisualEditor.DynamicPickListRows getValues(){
        VisualEditor.DynamicPickListRows listViews = new VisualEditor.DynamicPicklistRows();
        listViews.addRow(new VisualEditor.DataRow('None',''));
        
        for(ListView lv : [Select Id,sObjectType,Name From ListView Order By sObjectType Asc, Name Asc]){
			VisualEditor.DataRow val = new VisualEditor.DataRow('(' + lv.sObjectType + ') ' + lv.Name,String.valueOf(lv.Id));    
            listViews.addRow(val);
        }  
        return listViews;
    }
}