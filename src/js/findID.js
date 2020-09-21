function setDisplay1(){
    if($('input:radio[id=phone]').is(':checked')){
        $('.number_form').show();
        $('.name_form').hide();
    }
}


function setDisplay2(){
    if($('input:radio[id=name]').is(':checked')){
        $('.name_form').show();
        $('.number_form').hide();
    }
}
