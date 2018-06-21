({
    doInit : function(component, event, helper) {
		helper.doInit(component);
	},
    handleRemoveTag : function(component, event, helper){
        debugger;
        helper.handleRemoveTag(component, event);
    },
    // Client-side controller called by the onsort event handler
    updateColumnSorting: function (component, event, helper) {
        var sortDirection = event.getParam('sortDirection');
        var fieldName = event.getParam('fieldName');
        var formerFieldName = component.get("v.sortedBy");
        /*if(!$A.util.isEmpty(formerFieldName) && formerFieldName === fieldName){
            if(sortDirection === 'asc' || sortDirection === 'ASC'){
                sortDirection = 'desc';
            }else{
                sortDirection = 'asc';
            }
        }*/
        
        // assign the latest attribute with the sorted column fieldName and sorted direction
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
        helper.sortData(component, fieldName, sortDirection);
    },
    handleRowAction : function(component, event, helper){
        helper.handleRowAction(component, event);
    },
    exportCSV : function(component, event, helper){
        helper.exportCSV(component);
    },
    filterData : function(component, event, helper){
        helper.filterData(component);
    },
    filterDataByLetter : function(component, event, helper){
        helper.filterDataByLetter(component);
    }
})