({
    doInit : function(component){
		component.set('v.columns',[{label: 'Record name', fieldName: 'name', type: 'text'}]);
        
        var listViewId = component.get("v.listView");
        
        if(!$A.util.isEmpty(listViewId)){
            this.handleAction(
                component
                ,{
                    listViewId : listViewId,
                    displayAddAction : component.get("v.displayAddAction")
                }
                ,"c.getRecords"
                ,this.handleDoInitCallback
            );
        }
    },
	handleRemoveTag : function(component, event){
        debugger;
        var recordId = event.getSource().get("v.name");
        
        var records = [];
        var selectedRows = component.get("v.selectedRows");
        for(var i=0; i < selectedRows.length; i++){
            if(selectedRows[i].Id !== recordId){
                records.push(selectedRows[i]);
            }
        }
        component.set("v.selectedRows",records);
        this.filterDataWithValue(component,component.get("v.filterText"));
	},
    sortData: function (component, fieldName, sortDirection) {
        var items = component.get("v.records");
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
       	items.sort(this.sortBy(fieldName, reverse));
        component.set("v.records", items);
        
       	this.filterDataWithValue(component,component.get("v.filterText"));
    },
    sortBy: function (field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    },
    handleDoInitCallback : function(component, returnValue, ctx){
        //Iterate through the records and look for any cross object relationship fields.
        //If relationship fields are found, then handle them accordingly
        for(var i=0; i < returnValue.records.length; i++){
            var record = returnValue.records[i];
            
            //Loop through all the fields in each record, looking for relationships.
            var keys = Object.keys(record);
            for(var j=0; j < keys.length; j++){
                var key = keys[j];
                
                
                var currentVal = record[key];
                
                if(!$A.util.isEmpty(currentVal)){
                    if(currentVal instanceof Object){
                        if(key !== 'attributes'){
                            var parentKeys = Object.keys(currentVal);
                            //Loop through all the fields in the parent object and make them work with the data table.
                            for(var k=0; k < parentKeys.length; k++){
                                var parentKey = parentKeys[k];
                                var parentVal = currentVal[parentKey];
                                
                                if(!$A.util.isEmpty(parentVal)){
                                    
                                    
                                    
                                    var fieldOrPathName = key + '___' + parentKey;
                                    
                                    //Turn Ids into links.
                                    if(parentKey === 'Id'){
                                        parentVal = '/' + parentVal;
                                    }
                                    
                                    record[fieldOrPathName] = parentVal;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        for(var i=0; i < returnValue.columns.length; i++){
            var col = returnValue.columns[i];
            var keys = Object.keys(col);
            for(var j=0; j < keys.length; j++){
                var key = keys[j];
                if($A.util.isEmpty(col[key])){
                    delete col[key];
                }else{
                    if(key === 'typeAttributes'){
                        var attrKeys = Object.keys(col[key]);
                        for(var k=0; k < attrKeys.length; k++){
                            var attrKey = attrKeys[k];
                            if($A.util.isEmpty(col[key][attrKey])){
                                delete col[key][attrKey];
                            }
                        }
                    }
                }
            }
        }
        
        var columns = [];
        var displayAddAction = component.get("v.displayAddAction");
        if(displayAddAction){
            columns.push({
                type : 'button',
                typeAttributes : {
                    iconName : 'utility:add',
                    name : 'addRecord',
                    variant : 'neutral',
                    class : 'nomarginright',
                },
                initialWidth: 50
            });
        }
        columns.push.apply(columns,returnValue.columns);
        component.set("v.columns",columns);
        component.set("v.records",returnValue.records);
        component.set("v.filteredData",returnValue.records);
    },
    handleRowAction : function(component, event){
        var action = event.getParam("action");
        var row = event.getParam("row");
        
        if(action.name === 'addRecord'){
            this.handleAddRecord(component, event, row);
        }
    },
    handleAddRecord : function(component, event,  record){
        //var record = component.get("v.records")[idx];
        var selectedRows = component.get("v.selectedRows");
        for(var i=0; i < selectedRows.length; i++){
            if(record.Id === selectedRows[i].Id){
                return;
            }
        }        
        
        selectedRows.push(record);
        
        component.set("v.selectedRows",selectedRows);
        this.filterDataWithValue(component,component.get("v.filterText"));
    },
    getIcon : function(component, row, callback){
        var idx = component.get("v.selectedRows").indexOf(row);
        if(idx >= 0){
            callback('action:check');
        }else{
            callback('utility:add');
        }
    },
    getRowActions : function(component, row, callback){
      var actions = [];
        actions.push({
            label: "Increment", 
            name: "inc",
            // allow three increments per row
            disabled: row.intValue > 2 });
        callback(actions); 
    },
    exportCSV : function(component){
        
        var separator = component.get("v.csvSeparator");
        if('comma' === separator){
            separator = ',';
        }
        
        if('semicolon' === separator){
            separator === ';';
        }
        
        var fileName = component.get("v.csvFileName");
        
        var columns = component.get("v.columns");
        
        var csv = '';
        
        var fields = [];
        
        for(var i = 0; i < columns.length; i++){
            if(i > 0){
                csv += separator;
            }
            csv += columns[i].label;
            fields.push(columns[i].fieldName);
        }
        
        var data = component.get("v.records");
        
        for(var i=0; i < data.length; i++){
            var row = data[i];
            for(var j = 0; j < fields.length; j++){
                var field = fields[j];
                var value = this.replaceIfEmpty(row[field]);
                
                if(j > 0){
                    csv += separator;
                }
                
                csv += value;
            }
            csv += '\n';
        }
        
        var csvBlob = new Blob([csv], {type: 'text/xls'});
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(csvBlob);
        link.download = fileName;
        link.click();
    },
    replaceIfEmpty : function(val){
        if($A.util.isEmpty(val)){
            return '';
        }
        if(typeof val === 'string'){
            val = val.replace(/,/g,'');
        }
        return val;
    },
    filterDataByLetter : function(component){
    	this.filterDataWithValue(component,component.get("v.filterText"));  
    },
    filterData : function(component){
    	var filter = component.find("filterBox").getElement().value;
        this.filterDataWithValue(component,filter);
        component.set("v.filterText",filter);
    
    },
    filterDataWithValue : function(component, value){
        var txt = value;
        
        var filteredData = [];
        var records = component.get("v.records");
        //if($A.util.isEmpty(txt)){
            //filteredData = records;
            //component.set("v.filteredData",filteredData);
        //}else{
            if(!$A.util.isEmpty(records) && records.length > 0){
                var tempkeys = Object.keys(records[0]);
                var keys = [];
                for(var i=0; i < tempkeys.length;  i++){
                    var key = tempkeys[i];
                    if(typeof records[0][key] === 'string'){
                        keys.push(key);
                    }
                }
            }
        //}
        
        for(var i=0; i < records.length; i++){
             if(this.includeRecord(records[i],keys,txt,component.get("v.selectedRows"),component)){
                 filteredData.push(records[i]);
             }
         }
        
        component.set("v.filteredData",filteredData);
    },
    includeRecord : function(record,keys,searchText,selectedRecords,component){
        if(!$A.util.isEmpty(selectedRecords)){
            for(var i=0; i < selectedRecords.length; i++){
                if(selectedRecords[i].Id == record.Id){
                    return false;
                }
            }
        }
        
        var result = $A.util.isEmpty(searchText);
        if(!$A.util.isEmpty(searchText)){
            for(var i=0; i < keys.length; i++){
                var key = keys[i];
                var value = record[key];
                if(!$A.util.isEmpty(value)){
                    result |= (value.toLowerCase().indexOf(searchText.toLowerCase()) >= 0);
                }
            }
        }
        
        var selectedLetter = component.get("v.selectedLetter");
        var columnToFilter = component.get("v.sortedBy");
        if(!$A.util.isEmpty(selectedLetter) && !$A.util.isEmpty(columnToFilter) && selectedLetter !== 'All'){
            result &= (typeof record[columnToFilter] != 'string' || (!$A.util.isEmpty(record[columnToFilter]) && record[columnToFilter].toUpperCase().startsWith(selectedLetter)));
        }
        
        return result;
    },
    handleLookup : function(component){
    	var search = component.get("v.filterText");
        this.handleAction(
            component
            ,{
                searchText: searchText,
                listViewId : component.get("v.lookupListviewId")
            }
            ,"c.searchRecords"
            ,this.handleSearchCallback
        );
	},
    handleSearchCallback : function(component, returnValue, ctx){
        
    }
})