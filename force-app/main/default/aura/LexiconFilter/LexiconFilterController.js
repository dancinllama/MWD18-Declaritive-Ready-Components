({
	doInit : function(component, event, helper) {
		var alphabet = [];
        var letter = 'A';
        while(letter <= 'Z'){
           alphabet.push(letter);
           letter = String.fromCharCode(letter.charCodeAt() + 1);
        }
        component.set("v.alphabet",alphabet);
	},
    updateLetter : function(component, event){
        var letter = event.currentTarget.dataset.letter;
        component.set("v.selectedLetter",letter);
    }
})