const head_pos_up = $('#head').css( "top" ).split('px')[0]
const head_pos_down = head_pos_up * 1.25

$(document).ready(function(){ 
    head_move_down()
});

const head_move_down = () => {
    $('#head').animate( {top : head_pos_up + 'px'} , 1000, head_move_up)
}

const head_move_up = () => {
    $('#head').animate( {top : head_pos_down + 'px'} , 1000, head_move_down)
}