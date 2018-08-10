// BROWSE X4

$(document).on('click','#start_4',function(){

    for (i = 1; i < 5; ++i) {
        var src = $('.td_url[data-i="'+i+'"]').html();
        var id = $('.td_url[data-i="'+i+'"]').data('id');
        $('.iframe_class[data-i="'+i+'"]').attr('src',src)
        $('.iframe_class[data-i="'+i+'"]').data('id',id)
    }
    
	$('#browseLinkx4Modal').modal('show');

	$.APP.startTimer('cd',4);
    $.APP2.startTimer('sw',4);
	$.APP3.startTimer('cd',4);

})


$(document).on('click','.waiting_link',function(){
	var waiting_link = $(this).parent('div').siblings('.waiting_div').children('iframe').attr('src');
	var main_link = $('.main_link').children('iframe').attr('src');
	$('.main_link').children('iframe').attr('src',waiting_link);
	$(this).parent('div').siblings('.waiting_div').children('iframe').attr('src',main_link);
})

$('#browseLinkx4Modal').on('hidden.bs.modal', function () {
    $.APP2.pauseTimer();

    var time = $('#sw_s_4').html();
    var points = $('#points_4').html();

    var formData = new FormData();
    formData.append("time", time);
    formData.append("points", points);

    $('.iframe_class').each(function() {
        var id = $(this).data('id');
        var linksId = new Array();
        linksId.push(id);

        formData.append("linksId[]", linksId);
    })

    $.ajax({
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      url: ('addClick'),
      success: function(data){ 
        window.location.reload();
      }
    });
})

// VIEW X1

$(document).on('click','.view_link',function(){

    var src = $(this).data('url');
    var id = $(this).data('id');
    $('#iframe_class_view').attr('src',src)
    $('#iframe_class_view').data('id',id)
    
    $('#browseLinkx1Modal').modal('show');

    $.APP.startTimer('cd',1);
    $.APP2.startTimer('sw',1);
    $.APP3.startTimer('cd',1);

})

$('#browseLinkx1Modal').on('hidden.bs.modal', function () {
    $.APP2.pauseTimer();

    var time = $('#sw_s_1').html();
    var points = $('#points_1').html();

    var formData = new FormData();
    formData.append("time", time);
    formData.append("points", points);

    $('#iframe_class_view').each(function() {
        var id = $(this).data('id');
        var linksId = new Array();
        linksId.push(id);

        formData.append("linksId[]", linksId);
    })

    $.ajax({
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      url: ('addClick'),
      success: function(data){ 
        window.location.reload();
      }
    });
})


// REPORT LINK

$(document).on('click','.report_link',function(){
	var id = $(this).data('id')
	$('.report_link_message').val('');
	$('#btn_report_link').data('id',id)
	$('#reportLinkModal').modal('show');
})

$(document).on('click','#btn_report_link',function(){
	var message = $('.report_link_message').val();
	var link = $('#btn_report_link').data('id');

	if(message==''){
		$.alert({
	        title: 'Report message',
	        theme: 'material',
	        content: 'Please, tell us the reason why you want to report this link',
	        type: 'red'
	    });
	} else {
		$.ajax({
			type: "POST",
			url: ('reportLink'),
			dataType: 'json',
			data: {
			  'message': message,
			  'link': link
			},
			success: function (data) {
				if(data=='true'){
				    $.alert({
				        title: 'Thank you',
				        theme: 'material',
				        content: 'We will take a look at this link',
				        type: 'red'
				    });
					$('#reportLinkModal').modal('hide');
				}else{
					$.alert({
				        title: 'Report',
				        theme: 'material',
				        content: 'You already have reported this link !',
				        type: 'red'
				    });
				}
			}
		});	
	}
	
})

// TIMER

function randomTime(){
	var time = Math.floor(Math.random() *  (90 - 40 + 1) + 40);
	return time;
}

$(document).ready(function() {

    (function($){
    
        $.extend({
            
            APP : {                
                
                formatTimer : function(a) {
                    if (a < 10) {
                        a = '0' + a;
                    }                              
                    return a;
                },    
                
                startTimer : function(dir, val) {
                    
                    var a;
                    
                    // save type
                    $.APP.dir = dir;

                    // save type
                    $.APP.val = val;
                    
                    // get current date
                    $.APP.d1 = new Date();
                    
                    switch($.APP.state) {
                            
                        case 'pause' :
                            
                            // resume timer
                            // get current timestamp (for calculations) and
                            // substract time difference between pause and now
                            $.APP.t1 = $.APP.d1.getTime() - $.APP.td;                            
                            
                        break;
                            
                        default :
                            
                            // get current timestamp (for calculations)
                            $.APP.t1 = $.APP.d1.getTime(); 
                            
                            // if countdown add ms based on seconds in textfield
                            if ($.APP.dir === 'cd') {
                                $.APP.t1 += parseInt(randomTime())*1000;
                            }    
                        
                        break;
                            
                    }                                   
                    
                    // reset state
                    $.APP.state = 'alive';   
                    
                    // start loop
                    $.APP.loopTimer();
                    
                },

                resetTimer : function() {

                    // reset display
                    $('#' + $.APP.dir + '_ms,#' + $.APP.dir + '_s,#' + $.APP.dir + '_m,#' + $.APP.dir + '_h').html('00');                 
                    
                    // change button value
                    $('#' + $.APP.dir + '_start').val('Start');                    
                    
                    // set state
                    $.APP.state = 'reset';  
                    $('#' + $.APP.dir + '_status').html('Reset & Idle again');
                    
                },
                
                endTimer : function(callback) {
                   
                    // change button value
                    $('#' + $.APP.dir + '_start').val('Restart');
                    
                    // set state
                    $.APP.state = 'end';
                    
                    // invoke callback
                    if (typeof callback === 'function') {
                        callback();
                    }    
                    
                },    
                
                loopTimer : function() {
                    
                    var td;
                    var d2,t2;
                    
                    var ms = 0;
                    var s  = 0;
                    var m  = 0;
                    var h  = 0;
                    
                    if ($.APP.state === 'alive') {
                                
                        // get current date and convert it into 
                        // timestamp for calculations
                        d2 = new Date();
                        t2 = d2.getTime();   
                        
                        
                        td = $.APP.t1 - t2;
                        if (td <= 0) {
                            // if time difference is 0 end countdown
                            $.APP.endTimer(function(){
                                $.APP.resetTimer();
                                $.APP2.pauseTimer();
                                $.APP3.pauseTimer();
                                $.alert({
							        title: 'Warning',
							        theme: 'material',
							        content: 'Are you a bot ?',
							        type: 'red',
					                buttons: {
								        no: function () {
								        	$.APP.startTimer('cd',$.APP.val);
								        	$.APP2.startTimer('sw',$.APP.val);
                                            $.APP3.startTimer('cd',$.APP.val);
								        }
							    	}
							    });
                            });
                        }    
                          
                       
                        // calculate milliseconds
                        ms = td%1000;
                        if (ms < 1) {
                            ms = 0;
                        } else {    
                            // calculate seconds
                            s = (td-ms)/1000;
                            if (s < 1) {
                                s = 0;
                            } else {
                                // calculate minutes   
                                var m = (s-(s%60))/60;
                                if (m < 1) {
                                    m = 0;
                                } else {
                                    // calculate hours
                                    var h = (m-(m%60))/60;
                                    if (h < 1) {
                                        h = 0;
                                    }                             
                                }    
                            }
                        }
                      
                        // substract elapsed minutes & hours
                        ms = Math.round(ms/100);
                        s  = s-(m*60);
                        m  = m-(h*60);   
                        
                        // loop
                        $.APP.t = setTimeout($.APP.loopTimer,1);
                    
                    } else {
                    
                        // kill loop
                        clearTimeout($.APP.t);
                        return true;
                    
                    }  
                    
                }
                    
            }    
        
        });             
                
    })(jQuery);
        
});


// POINTS

$(document).ready(function() {

    (function($){
    
        $.extend({
            
            APP2 : {                
                
                formatTimer : function(a) {
                    if (a < 10) {
                        a = '0' + a;
                    }                              
                    return a;
                },    
                
                startTimer : function(dir, val) {
                    
                    var a;
                    
                    // save type
                    $.APP2.dir = dir;

                    // save value
                    $.APP2.val = val;
                    
                    // get current date
                    $.APP2.d1 = new Date();
                    
                    switch($.APP2.state) {
                            
                        case 'pause' :
                            
                            // resume timer
                            // get current timestamp (for calculations) and
                            // substract time difference between pause and now
                            $.APP2.t1 = ($.APP2.d1.getTime() - $.APP2.td);                            
                            
                        break;
                            
                        default :
                            
                            // get current timestamp (for calculations)
                            $.APP2.t1 = $.APP2.d1.getTime();  
                        
                        break;
                            
                    }                                   
                    
                    // reset state
                    $.APP2.state = 'alive';   
                    $('#' + $.APP2.dir + '_status').html('Running');
                    
                    // start loop
                    $.APP2.loopTimer();
                    
                },
                
                pauseTimer : function() {
                    
                    // save timestamp of pause
                    $.APP2.dp = new Date();
                    $.APP2.tp = $.APP2.dp.getTime();
                    
                    // save elapsed time (until pause)
                    $.APP2.td = $.APP2.tp - $.APP2.t1;
                    
                    // set state
                    $.APP2.state = 'pause';
                },
                
                stopTimer : function() {
                    
                    // change button value
                    $('#' + $.APP2.dir + '_start').val('Restart');                    
                    
                    // set state
                    $.APP2.state = 'stop';
                    $('#' + $.APP2.dir + '_status').html('Stopped');
                    
                },
                
                resetTimer : function() {

                    // reset display
                    $('#' + $.APP2.dir + '_ms,#' + $.APP2.dir + '_s,#' + $.APP2.dir + '_m,#' + $.APP2.dir + '_h').html('00');                 
                    
                    // change button value
                    $('#' + $.APP2.dir + '_start').val('Start');                    
                    
                    // set state
                    $.APP2.state = 'reset';  
                    $('#' + $.APP2.dir + '_status').html('Reset & Idle again');
                    
                },
                
                endTimer : function(callback) {
                   
                    // change button value
                    $('#' + $.APP2.dir + '_start').val('Restart');
                    
                    // set state
                    $.APP2.state = 'end';
                    
                    // invoke callback
                    if (typeof callback === 'function') {
                        callback();
                    }    
                    
                },    
                
                loopTimer : function() {
                    
                    var td;
                    var d2,t2;
                    
                    var ms = 0;
                    var s  = 0;
                    var m  = 0;
                    var h  = 0;
                    
                    if ($.APP2.state === 'alive') {
                                
                        // get current date and convert it into 
                        // timestamp for calculations
                        d2 = new Date();
                        t2 = d2.getTime();   
                        
                        td = t2 - $.APP2.t1;
                        
                        // calculate milliseconds
                        ms = (td%1000);
                        if (ms < 1) {
                            ms = 0;
                        } else {    
                            // calculate seconds
                            s = ((td-ms)/1000);
                        }
                      
                        // substract elapsed minutes & hours
                        ms = Math.round(ms/100);
                        s  = s-(m*60);
                        m  = m-(h*60);                                
                        
                        // update display
                        $('#' + $.APP2.dir + '_s_' + $.APP2.val).html($.APP2.formatTimer(s));
                        majPoints($.APP2.formatTimer(s), $.APP2.val);
                        
                        // loop
                        $.APP2.t = setTimeout($.APP2.loopTimer,1);
                    
                    } else {
                    
                        // kill loop
                        clearTimeout($.APP2.t);
                        return true;
                    
                    }  
                    
                }
                    
            }    
        
        });              
                
    })(jQuery);
        
});

function majPoints(points, value){
	var total = points * value; 
	$('#points_'+value).html(total);
}


// TIME WATCH

function randomTimeWatch(){
    var time = Math.floor(Math.random() *  (240 - 60 + 1) + 60);
    return time;
}

$(document).ready(function() {

    (function($){
    
        $.extend({
            
            APP3 : {                
                
                formatTimer : function(a) {
                    if (a < 10) {
                        a = '0' + a;
                    }                              
                    return a;
                },    
                
                startTimer : function(dir, val) {
                    
                    var a;
                    
                    // save type
                    $.APP3.dir = dir;

                    // save value
                    $.APP2.val = val;
                    
                    // get current date
                    $.APP3.d1 = new Date();
                    
                    switch($.APP3.state) {
                            
                        case 'pause' :
                            
                            // resume timer
                            // get current timestamp (for calculations) and
                            // substract time difference between pause and now
                            $.APP3.t1 = $.APP3.d1.getTime() - $.APP3.td;                            
                            
                        break;
                            
                        default :
                            
                            // get current timestamp (for calculations)
                            $.APP3.t1 = $.APP3.d1.getTime(); 
                            
                            // if countdown add ms based on seconds in textfield
                            if ($.APP3.dir === 'cd') {
                                $.APP3.t1 += parseInt(randomTimeWatch())*1000;
                            }    
                        
                        break;
                            
                    }                                   
                    
                    // reset state
                    $.APP3.state = 'alive'; 
                    
                    // start loop
                    $.APP3.loopTimer();
                    
                },

                pauseTimer : function() {
                    
                    // save timestamp of pause
                    $.APP3.dp = new Date();
                    $.APP3.tp = $.APP3.dp.getTime();
                    
                    // save elapsed time (until pause)
                    $.APP3.td = $.APP3.tp - $.APP3.t1;
                    
                    // set state
                    $.APP3.state = 'pause';
                },

                stopTimer : function() {                 
                    
                    // set state
                    $.APP3.state = 'stop';
                    
                },

                resetTimer : function() {

                    // reset display
                    $('#' + $.APP3.dir + '_ms,#' + $.APP3.dir + '_s,#' + $.APP3.dir + '_m,#' + $.APP3.dir + '_h').html('00');                    
                    
                    // set state
                    $.APP3.state = 'reset';  
                    
                },
                
                endTimer : function(callback) {
                   
                    // change button value
                    $('#' + $.APP3.dir + '_start').val('Restart');
                    
                    // set state
                    $.APP3.state = 'end';
                    
                    // invoke callback
                    if (typeof callback === 'function') {
                        callback();
                    }    
                    
                },    
                
                loopTimer : function() {
                    
                    var td;
                    var d2,t2;
                    
                    var ms = 0;
                    var s  = 0;
                    var m  = 0;
                    var h  = 0;
                    
                    if ($.APP3.state === 'alive') {
                                
                        // get current date and convert it into 
                        // timestamp for calculations
                        d2 = new Date();
                        t2 = d2.getTime();   

                        if ($.APP3.dir === 'sw') {
                            td = t2 - $.APP3.t1;
                        // reversed if countdown
                        } else {
                            td = $.APP3.t1 - t2;
                            if (td <= 0) {
                                // if time difference is 0 end countdown
                                $.APP3.endTimer(function(){
                                    $.APP.resetTimer();
                                    $.APP2.pauseTimer();
                                    if($.APP2.val==1){
                                        $('#browseLinkx1Modal').modal('hide');
                                    }else{
                                        $('#browseLinkx4Modal').modal('hide');
                                    }
                                });
                            }    
                        }
                        
                       
                        // calculate milliseconds
                        ms = td%1000;
                        if (ms < 1) {
                            ms = 0;
                        } else {    
                            // calculate seconds
                            s = (td-ms)/1000;
                            if (s < 1) {
                                s = 0;
                            } else {
                                // calculate minutes   
                                var m = (s-(s%60))/60;
                                if (m < 1) {
                                    m = 0;
                                } else {
                                    // calculate hours
                                    var h = (m-(m%60))/60;
                                    if (h < 1) {
                                        h = 0;
                                    }                             
                                }    
                            }
                        }
                      
                        // substract elapsed minutes & hours
                        ms = Math.round(ms/100);
                        s  = s-(m*60);
                        m  = m-(h*60);   
                        
                        // loop
                        $.APP3.t = setTimeout($.APP3.loopTimer,1);
                    
                    } else {
                    
                        // kill loop
                        clearTimeout($.APP3.t);
                        return true;
                    
                    }  
                    
                }
                    
            }    
        
        });             
                
    })(jQuery);
        
});
